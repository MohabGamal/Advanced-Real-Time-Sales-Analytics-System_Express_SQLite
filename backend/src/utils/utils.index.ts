import { Request } from "express"
import https from "https"
import http from "http"
import { ServerError } from "./httpErrors"
import { NODE_ENV } from "../constants"

// normalize IPs
function normalizeIp(ip: string): string {
	if (ip.startsWith("::ffff:")) {
		return ip.slice(7) // Strip the "::ffff:" prefix from IPv4-mapped IPv6 addresses
	}
	return ip
}

// get client IP
export function getClientIp(req: Request): string | null {
	// Return a hardcoded IP address for development because it would always be localhost
	if (NODE_ENV === "development") return "84.239.14.158"
	let xForwardedFor = req.headers["x-forwarded-for"]
	if (xForwardedFor) {
		if (typeof xForwardedFor === "string") {
			xForwardedFor = xForwardedFor.split(",")[0]
		} else {
			xForwardedFor = xForwardedFor[0]
		}
	}
	const ip =
		xForwardedFor ||
		req.socket?.remoteAddress ||
		req.connection?.remoteAddress ||
		null

	return ip ? normalizeIp(ip) : null
}

// make HTTPS requests in Node.js natively
export function nodeFetch<T>(
	url: string,
	options: {
		method?: string
		headers?: Record<string, string>
		body?: any
	} = {}
): Promise<T> {
	return new Promise((resolve, reject) => {
		const protocol = url.startsWith("https") ? https : http
		const { method = "GET", headers = {}, body } = options

		const request = protocol.request(url, { method, headers }, (response) => {
			let data = ""
			response.on("data", (chunk) => {
				data += chunk
			})
			response.on("end", () => {
				try {
					const parsedData = JSON.parse(data) as T
					// Check if the response is an error, different APIs have different error formats
					if (parsedData && (parsedData as any).status === "fail") {
						reject(
							new ServerError(`Request failed: ${(parsedData as any).message}`)
						)
					}
					if (parsedData && (parsedData as any).error) {
						reject(
							new ServerError(
								`Request failed: ${(parsedData as any).error.message}`
							)
						)
					}
					resolve(parsedData)
				} catch (error) {
					reject(new ServerError("Failed to parse JSON response"))
				}
			})
		})
		request.on("error", (error) => {
			reject(new ServerError(`Failed to make request: ${error.message}`))
		})
		if (body) {
			const bodyData = typeof body === "string" ? body : JSON.stringify(body)
			request.write(bodyData)
		}
		request.end()
	})
}

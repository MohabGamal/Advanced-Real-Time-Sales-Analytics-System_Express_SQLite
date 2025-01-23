import { NextFunction, Request, Response } from "express"
import { TMiddlewareFn } from "./types"
import { ServerError } from "./utils/httpErrors"
import { Database } from "sqlite"
import { initDatabase } from "./config"

const db = initDatabase()

export const dbInitMiddleware: TMiddlewareFn = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		req.db = await db
		return next()
	} catch (error) {
		console.error(error)
		return next(new ServerError("Failed to connect to database"))
	}
}

import { WebSocketServer, WebSocket } from "ws"
import { TWsActions } from "./constants"

let wss: WebSocketServer

export const initWebSocket = (server: any) => {
	wss = new WebSocketServer({ server })

	wss.on("connection", (ws) => {
		console.log("New client connected")

		ws.on("message", (message) => {
			console.log(`Received message: ${message}`)
		})

		ws.on("close", () => {
			console.log(`Client disconnected`)
		})
	})
}

// Broadcast function to send messages to all clients
export const broadcast = (action: TWsActions, message: any) => {
	if (!wss) throw new Error("WebSocket server is not initialized")

	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify({ action, message }))
		}
	})
}

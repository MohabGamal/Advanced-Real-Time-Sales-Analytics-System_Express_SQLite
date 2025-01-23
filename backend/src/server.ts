import express, { NextFunction, Request, Response } from "express"
import path from "path"
import "./types"
import { NODE_ENV } from "./constants"
import apis from "./routes"
import { dbInitMiddleware } from "./middlewares"
import { HttpError, NotFoundError, ServerError } from "./utils/httpErrors"

const server = express()
// Middlewares
server.use(express.urlencoded({ extended: true }))
server.use(express.json({ limit: "10mb" }))
server.use(express.static(path.resolve("..", "frontend", "dist")))

// Database initialization to db to req (req.db)
server.use(dbInitMiddleware)

server.get("/health-check", (req, res) => {
	res.send("hello, I am good :)")
})

// Routes
server.use("/api", apis)

// // frontend serve
// server.get("/*", (req, res) => {
// 	res.sendFile(path.resolve("..", "frontend", "dist", "index.html"))
// })

server.use((req, res, next) => {
	return next(new NotFoundError("Not Found"))
})

server.use((error: Error, req: Request, res: Response, next: NextFunction) => {
	// log all errors in development and only server errors in production
	NODE_ENV == "development" && console.error(error)
	if (error instanceof ServerError) {
		NODE_ENV == "production" && console.error(error)
		res.status(500).send("500: internal server error")
		return
	}
	if (error instanceof HttpError) {
		res.status(error.status).json({ message: error.message })
		return
	}
	res
		.status(500)
		.send({ message: "500: internal server error", status: "fail" })
})

export default server

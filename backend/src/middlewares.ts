import { NextFunction, Request, Response } from "express"
import { TMiddlewareFn } from "./types"
import { ServerError } from "./utils/httpErrors"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import { Database } from "sqlite"

let db: Database | null = null
open({
	filename: "./sales.sqlite",
	driver: sqlite3.Database,
})
	.then((dbInstance) => {
		db = dbInstance
		console.log("Connected to database.")
	})
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})

export const dbInitMiddleware: TMiddlewareFn = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		req.db = db as Database
		return next()
	} catch (error) {
		console.error(error)
		return next(new ServerError("Failed to connect to database"))
	}
}

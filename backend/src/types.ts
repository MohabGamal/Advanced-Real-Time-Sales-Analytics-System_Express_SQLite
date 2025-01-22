import { NextFunction, Request, Response } from "express"
import { Database } from "sqlite"

declare global {
	namespace Express {
		interface Request {
			db: Database
		}
	}
}

export type TMiddlewareFn = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void>

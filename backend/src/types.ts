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


export type TWeatherApiResponse = {
	name: string
	main: { temp: number }
}

export type TGeminiApiBody = {
  contents: {
    parts: { text: string }[]
  }[]
}

export type TGeminiApiResponse = {
  candidates: {
    content: {
      parts: {
        text: string
      }[]
    }
  }[]
}
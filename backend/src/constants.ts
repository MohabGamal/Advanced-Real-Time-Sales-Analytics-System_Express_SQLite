import dotenv from "dotenv"
dotenv.config()

export const NODE_ENV = process.env.NODE_ENV || "development"
export const PORT = process.env.PORT || 8800
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY
export const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY
// console.log(OPEN_AI_KEY)

export const wsActions = {
	ANALYTICS: "analytics",
	NEWORDER: "neworder",
} as const

export type TWsActions = (typeof wsActions)[keyof typeof wsActions]

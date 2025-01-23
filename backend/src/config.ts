import sqlite3 from "sqlite3"
import { Database, open } from "sqlite"


export const initDatabase = async () => {
	try {
		 const db = await open({
			filename: "./sales.sqlite",
			driver: sqlite3.Database,
		})
		console.log("Connected to database.")
    return db as Database
  } catch (error) {
		console.error("Database connection failed:", error)
		process.exit(1)
	}
}

import sqlite3 from "sqlite3"
import { open } from "sqlite"

export const createOrdersTable = async () => {
	const db = await open({
		filename: "./sales.sqlite",
		driver: sqlite3.Database,
	})
	await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      product_ID INTEGER PRIMARY KEY AUTOINCREMENT,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
	console.log("created orders table")
	return db
}

createOrdersTable()

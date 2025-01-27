import { initDatabase } from "../config"

// dev scripts to use when needed

const createOrdersTable = async () => {
	const db = await initDatabase()
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

type TOrder = {
  quantity: number
  price: number
}

const AddOrders = async (orders : TOrder[]) => {
  const db = await initDatabase()
  const stmt = await db.prepare("INSERT INTO orders (quantity, price) VALUES (?, ?)")
  orders.forEach(async (order) => {
    await stmt.run(order.quantity, order.price)
  })
  console.log("added orders")
}
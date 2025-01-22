import { Database } from "sqlite"
import { ServerError } from "./utils/httpErrors"

type TPostOrderServiceParams = {
	db: Database
	quantity: number
	price: number
}

export const postOrderService = async (params: TPostOrderServiceParams) => {
	const { db, quantity, price } = params
	try {
		const query = `
    INSERT INTO orders (quantity, price)
    VALUES (?, ?)
  `
		const newOrder = await db.run(query, [quantity, price])
		if (!newOrder) {
			return new ServerError("Failed to add order")
		}
		return newOrder
	} catch (error) {
		return new ServerError("Failed to add order")
	}
}

export const getAnalyticsService = async (db: Database) => {
	try {
		const totalRevenueQuery = `
      SELECT SUM(quantity * price) AS total_revenue
      FROM orders
    `
		const totalRevenue = await db.get(totalRevenueQuery)
		const topSalesQuery = `
      SELECT 
      product_id, 
      SUM(quantity * price) AS total_revenue
      FROM orders
      GROUP BY product_id
      ORDER BY total_revenue DESC
    `
		const topSales = await db.all(topSalesQuery)
		// formula = ((revenue this minute - revenue last minute) / revenue last minute) * 100
		const revenueChangeLastMinuteQuery = `
    SELECT 
    CASE 
      WHEN SUM(CASE 
        WHEN date >= DATETIME('now', '-2 minute') AND date < DATETIME('now', '-1 minute') 
        THEN quantity * price 
        ELSE 0 
        END) = 0 THEN NULL
        ELSE ROUND(
        (
          (
            SUM(CASE 
              WHEN date >= DATETIME('now', '-1 minute')
              THEN quantity * price 
              ELSE 0 
            END) - 
            SUM(CASE 
              WHEN date >= DATETIME('now', '-2 minute') AND date < DATETIME('now', '-1 minute') 
              THEN quantity * price 
              ELSE 0 
            END)
          ) * 100.0 / 
          SUM(CASE 
            WHEN date >= DATETIME('now', '-2 minute') AND date < DATETIME('now', '-1 minute') 
            THEN quantity * price 
            ELSE 0 
          END)
        ), 2
      )
      END AS percentage_change
    FROM orders;
`
		const revenueChangeLastMinute = await db.get(revenueChangeLastMinuteQuery)
		const totalOrdersLastMinuteQuery = `
    SELECT COUNT(*) AS TOTAL_ORDERS FROM orders WHERE date >= DATETIME('now', '-1 minute')
    `
		const totalOrdersLastMinute = await db.get(totalOrdersLastMinuteQuery)
		return {
			totalRevenue,
			topSales,
			revenueChangeLastMinute,
			totalOrdersLastMinute,
		}
	} catch (error) {
		return new ServerError("Failed to get analytics")
	}
}

import { Database } from "sqlite"
import { ServerError } from "./utils/httpErrors"
import { nodeFetch } from "./utils/utils.index"
import { GEMINI_API_KEY, OPEN_WEATHER_API_KEY } from "./constants"
import {
	TGeminiApiBody,
	TGeminiApiResponse,
	TWeatherApiResponse,
} from "./types"

type TPostOrderServiceParams = {
	db: Database
	quantity: number
	price: number
}

export const postOrderService = async (params: TPostOrderServiceParams) => {
	const { db, quantity, price } = params

	const query = `
    INSERT INTO orders (quantity, price)
    VALUES (?, ?)
  `
	const newOrder = await db.run(query, [quantity, price])
	if (!newOrder) {
		throw new ServerError("Failed to add order")
	}
	return newOrder
}

export const getAnalyticsService = async (db: Database) => {
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
}

export const getRecommendationsService = async (db: Database) => {
	const recommendationsQuery = `
    SELECT
      product_ID,
      SUM(quantity) AS total_quantity,
      SUM(quantity * price) AS total_revenue,
      AVG(price) AS average_price
    FROM orders
    GROUP BY product_ID
    ORDER BY total_revenue DESC
    LIMIT 5;
  `
	const recommendations = await db.all(recommendationsQuery)

	const aiRecommendationsBody: TGeminiApiBody = {
		contents: [
			{
				parts: [
					{
						text: `	 	
              Given this sales data, which products should we promote for higher revenue?
              Just give the give the product promotion suggestions or strategic actions.
              The sales Data:
              ${JSON.stringify(recommendations)}
            `,
					},
				],
			},
		],
	}
  const recommendationRes = await nodeFetch<TGeminiApiResponse>(
		`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(aiRecommendationsBody),
		}
	)
  const aiRecommendations = recommendationRes.candidates[0].content.parts[0].text
	return aiRecommendations
}

type TWeatherData = {
	city: string
	temperature: string
}

export const getWeatherService = async (
	clientIp: string
): Promise<TWeatherData> => {
	const geoUrl = `http://ip-api.com/json/${clientIp}`
	const geoData = await nodeFetch<{ city: string }>(geoUrl)
	if (!geoData.city) {
		throw new ServerError("Failed to get client location")
	}
	const { city } = geoData
	const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPEN_WEATHER_API_KEY}&units=metric`
	const weatherDataRes = await nodeFetch<TWeatherApiResponse>(weatherUrl)
	if (!weatherDataRes.main) {
		throw new ServerError("Failed to get weather data")
	}
	const { name, main } = weatherDataRes
	const weatherData = { city: name, temperature: main.temp + "°C" }
	return weatherData
}

export const getWeatherRecommedationsService = async (
	weatherData: TWeatherData
) => {
	const aiRecommendationsBody: TGeminiApiBody = {
		contents: [
			{
				parts: [
					{
						text: `Promote cold drinks on hot days or hot drinks on cold days.
	                Also, suggest dynamic pricing based on weather or seasonality.
	                no need for flavor text in your answer.
	                given the weather data: ${JSON.stringify(weatherData)}
	      `,
					},
				],
			},
		],
	}
	const aiRecommendationRes = await nodeFetch<TGeminiApiResponse>(
		`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(aiRecommendationsBody),
		}
	)
	const aiRecommendations = aiRecommendationRes.candidates[0].content.parts[0].text
	return aiRecommendations
}

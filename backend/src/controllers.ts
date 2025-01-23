// import { getClientIp } from 'request-ip';
import {
	getAnalyticsService,
	getRecommendationsService,
	getWeatherRecommedationsService,
	getWeatherService,
	postOrderService,
} from "./services"
import { TMiddlewareFn } from "./types"
import { BadRequestError, ServerError } from "./utils/httpErrors"
import { getClientIp } from "./utils/utils.index"

type TPostOrderBody = {
	quantity: number
	price: number
}

// POST /api/orders/
export const postOrder: TMiddlewareFn = async (req, res, next) => {
	const { quantity, price } = req.body as TPostOrderBody
	if (!quantity || !price) {
		return next(new BadRequestError("please provide quantity and price"))
	}
	try {
		const newOrder = await postOrderService({ db: req.db, quantity, price })
		if (newOrder instanceof Error) {
			return next(newOrder)
		}
		res.status(201).json({
			message: "Order added successfully!",
			orderId: newOrder.lastID,
			quantity,
			price,
		})
	} catch (error: any) {
		return next(new ServerError(error.message))
	}
}

// GET /api/analytics/
export const getAnalytics: TMiddlewareFn = async (req, res, next) => {
	try {
		const totalRevenue = await getAnalyticsService(req.db)
		res.status(200).json({
			message: "Analytics retrieved successfully!",
			totalRevenue,
		})
	} catch (error: any) {
		return next(new ServerError(error.message))
	}
}

// GET /api/recommendations/
export const getRecommendations: TMiddlewareFn = async (req, res, next) => {
	try {
		const aiRecomendations = await getRecommendationsService(req.db)
		res.status(200).json({
			message: "Recommendations retrieved successfully!",
			aiRecomendations,
		})
	} catch (error: any) {
		return next(new ServerError(error.message))
	}
}

// GET /api/weather/
export const getWeather: TMiddlewareFn = async (req, res, next) => {
	try {
		const clientIp = getClientIp(req)
		if (!clientIp) {
			return next(new BadRequestError("Unable to determine client IP address."))
		}
		const weatherData = await getWeatherService(clientIp)
    const weatherRecommedations = await getWeatherRecommedationsService(weatherData)
		res.status(200).json({
			message: "Weather data retrieved successfully!",
			weatherData,
      weatherRecommedations
		})
	} catch (error: any) {
		return next(new ServerError(error.message))
	}
}

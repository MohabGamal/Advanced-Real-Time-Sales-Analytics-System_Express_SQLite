import { getAnalyticsService, postOrderService } from "./services"
import { TMiddlewareFn } from "./types"
import { BadRequestError, ServerError } from "./utils/httpErrors"

type TPostOrderBody = {
	quantity: number
	price: number
}

// POST /api/orders/
export const postOrder: TMiddlewareFn = async (req, res, next) => {
	const { quantity, price } = req.body as TPostOrderBody
	if (!quantity || !price) {
		return next(new BadRequestError("Invalid request"))
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
	} catch (error) {
		return next(new ServerError("Failed to add order"))
	}
}

// GET /api/analytics/
export const getAnalytics: TMiddlewareFn = async (req, res, next) => {
  try {
    const totalRevenue = await getAnalyticsService(req.db)
    if (totalRevenue instanceof Error) {
      return next(totalRevenue)
    }
    res.status(200).json(totalRevenue)
  } catch (error) {
    return next(new ServerError("Failed to get analytics"))
  }
}

// GET /api/recommendations/
export const getRecommendations: TMiddlewareFn = async (req, res, next) => {
  
}

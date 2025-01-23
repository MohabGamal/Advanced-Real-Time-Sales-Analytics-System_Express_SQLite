import express from "express"
import {
	postOrder,
	getAnalytics,
	getRecommendations,
	getWeather,
} from "./controllers"

const router = express.Router()

// POST /api/orders/
router.post("/orders", postOrder)
// GET /api/analytics/
router.get("/analytics", getAnalytics)
// GET /api/recommendations/
router.get("/recommendations", getRecommendations)
// GET /api/weather/
router.get("/weather", getWeather)

export default router

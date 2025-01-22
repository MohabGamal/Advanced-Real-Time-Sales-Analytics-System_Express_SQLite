import express from 'express'
import { postOrder, getAnalytics, getRecommendations } from './controllers'


const router = express.Router()

// POST /api/orders/
router.post('/orders', postOrder)
// GET /api/analytics/
router.get('/analytics', getAnalytics)
// GET /api/recommendations/
router.get('/recommendations', getRecommendations)


export default router

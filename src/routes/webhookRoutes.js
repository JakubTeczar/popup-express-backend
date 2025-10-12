import express from 'express'
import { handleWordPressWebhook, testWebhook } from '../controllers/webhookController.js'

const router = express.Router()

// WordPress webhook endpoint
router.post('/wordpress', handleWordPressWebhook)

// Test endpoint
router.get('/test', testWebhook)

export default router

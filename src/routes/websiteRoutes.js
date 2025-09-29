import express from 'express'
import { 
    getAllWebsites, 
    getWebsiteById, 
    getWebsitesByUserId,
    createWebsite, 
    updateWebsite, 
    deleteWebsite,
    createMultipleWebsites
} from '../controllers/websiteController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Get all websites (admin only)
router.get('/', verifyToken, getAllWebsites)

// Get websites by user ID
router.get('/user/:userId', verifyToken, getWebsitesByUserId)

// Get website by ID
router.get('/:id', verifyToken, getWebsiteById)

// Create single website
router.post('/', verifyToken, createWebsite)

// Create multiple websites (bulk)
router.post('/bulk', verifyToken, createMultipleWebsites)

// Update website
router.put('/:id', verifyToken, updateWebsite)

// Delete website
router.delete('/:id', verifyToken, deleteWebsite)

export default router

import express from 'express'
import { uploadImage, getImageByUrl, getAllUserImages, deleteImage, getImageById } from '../controllers/imageController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

// All routes require authentication

// Upload new image
router.post('/upload', verifyToken, uploadImage)

// Get all user images
router.get('/', verifyToken, getAllUserImages)

// Get specific image by url
router.get('/:file_url', getImageByUrl)

// Get specific image by id
router.get('/:id', verifyToken, getImageById)

// Delete image
router.delete('/:id', verifyToken, deleteImage)

export default router
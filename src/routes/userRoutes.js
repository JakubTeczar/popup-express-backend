import express from 'express'
import { registerUser, getUserById, createUser, updateUser, deleteUser, loginUser, logoutUser, generateUserKeys, getWebsitePopup, getUserKeys, getUserWebsites } from '../controllers/userController.js'
import { validateUser } from '../middlewares/inputValidator.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()


router.post('/', validateUser, createUser)

router.post('/register', validateUser, registerUser)

router.post('/login', loginUser)

router.post('/logout', verifyToken, logoutUser)

// Get user access key and secret key
router.get('/keys', verifyToken, getUserKeys)

// Get user websites
router.get('/websites', verifyToken, getUserWebsites)

// Generate access and secret keys for user
router.post('/generate-keys', verifyToken, generateUserKeys)

// Get website popup (with page ID)
router.post('/get-website-popup', getWebsitePopup)

router.get('/:id', verifyToken, getUserById)

router.put('/:id', verifyToken, validateUser, updateUser)

router.delete('/:id', verifyToken, deleteUser)



export default router
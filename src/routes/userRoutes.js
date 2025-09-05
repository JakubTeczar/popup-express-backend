import express from 'express'
import { registerUser, getUserById, createUser, updateUser, deleteUser, loginUser, logoutUser } from '../controllers/userController.js'
import { validateUser } from '../middlewares/inputValidator.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()


router.post('/', validateUser, createUser)

router.get('/:id', verifyToken, getUserById)

router.put('/:id', verifyToken, validateUser, updateUser)

router.delete('/:id', verifyToken, deleteUser)

router.post('/register', validateUser, registerUser)

router.post('/login', loginUser)

router.post('/logout', verifyToken, logoutUser)

export default router
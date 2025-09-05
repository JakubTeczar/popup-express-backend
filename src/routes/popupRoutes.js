import express from 'express'
import { createPopup, getPopup, updatePopup, deletePopup, getAllUserPopups } from '../controllers/popupController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/create', createPopup)

router.get('/get-user-popups/:user_id', verifyToken, getAllUserPopups)

router.get('/:share_id', getPopup)

router.put('/:share_id', updatePopup)

router.delete('/:share_id', deletePopup)

export default router
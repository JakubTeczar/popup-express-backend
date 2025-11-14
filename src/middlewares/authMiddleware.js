import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'
import { getUserByIdService } from '../models/userModel.js'

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
        return res.status(401).json({
            status: 401,
            message: 'Access token is required'
        })
    }

    const token = authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            status: 401,
            message: 'Invalid token format'
        })
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret)
        
        // Sprawdź czy token istnieje w bazie danych
        const user = await getUserByIdService(decoded.id)
        if (!user || user.token !== token) {
            return res.status(403).json({
                status: 403,
                message: 'Token has been invalidated'
            })
        }
        
        req.user = decoded
        next()
    } catch (error) {
        return res.status(403).json({
            status: 403,
            message: 'Invalid or expired token'
        })
    }
}



import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'

export const verifyToken = (req, res, next) => {
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
        req.user = decoded
        next()
    } catch (error) {
        return res.status(403).json({
            status: 403,
            message: 'Invalid or expired token'
        })
    }
}



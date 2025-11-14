import { getAllUsersService, createUserService, getUserByIdService, updateUserService, deleteUserService, loginUserService, logoutUserService, generateUserKeysService, getUserByAccessKeyService, getUserKeysService, updateUserTokenService } from '../models/userModel.js'
import { getWebsitesByUserIdService, getWebsiteByPageIdAndUserIdService } from '../models/websiteModel.js'
import { getActivePopupForWebsiteService } from '../models/popupModel.js'
import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'

// Standard CRUD responses
const handleResponse = (res, statusCode, message, data) => {
    res.status(statusCode).json({
        status: statusCode,
        message,
        data
    })
}

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService()
        if (!users.length) {
            return handleResponse(res, 404, 'No users found', [])
        }
        handleResponse(res, 200, 'Users fetched successfully', users)
    } catch (error) {
        next(error)
    }
}

export const getUserById = async (req, res, next) => {
    const { id } = req.params
    try {
        const user = await getUserByIdService(id)
        handleResponse(res, 200, 'User fetched successfully', user)
    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req, res, next) => {
    const { id } = req.params
    const { name, email, password } = req.body
    try {
        const updatedUser = await updateUserService(id, { name, email, password })
        handleResponse(res, 200, 'User updated successfully', updatedUser)
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {

    const { id } = req.params
    try {
        await deleteUserService(id)
        handleResponse(res, 200, 'User deleted successfully', null)
    } catch (error) {
        next(error)
    }
}

export const createUser = async (req, res, next) => {
    const { name, email, password } = req.body
    try {
        const newUser = await createUserService({ name, email, password })
        handleResponse(res, 201, 'User created successfully', newUser)
    } catch (error) {
        next(error)
    }
}

export const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body
    try {
        const newUser = await createUserService({ name, email, password })
        const token = jwt.sign({ id: newUser.id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn })
        
        // Zapisz token do bazy danych
        const userWithToken = await updateUserTokenService(newUser.id, token)

        handleResponse(res, 201, 'User created successfully', { ...userWithToken, token })
    } catch (error) {
        next(error)
    }
}

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await loginUserService(email, password)
        const token = jwt.sign({ id: user.id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn })
        
        // Zapisz token do bazy danych
        const userWithToken = await updateUserTokenService(user.id, token)

        handleResponse(res, 200, 'User logged in successfully', { ...userWithToken, token })
    } catch (error) {
        next(error)
    }
}

export const logoutUser = async (req, res, next) => {
    const { id } = req.params
    try {
        await logoutUserService(id)
        handleResponse(res, 200, 'User logged out successfully', null)
    } catch (error) {
        next(error)
    }
}

export const generateUserKeys = async (req, res, next) => {
    const { id } = req.user
    try {
        const userWithKeys = await generateUserKeysService(id)
        handleResponse(res, 200, 'Access and secret keys generated successfully', userWithKeys)
    } catch (error) {
        next(error)
    }
}

export const getWebsitePopup = async (req, res, next) => {
    const accessKey = req.headers['x-access-key']
    const timestamp = req.headers['x-timestamp']
    const signature = req.headers['x-signature']
    const pageId = req.headers['x-page-id']
    
    try {
        if (!accessKey || !timestamp || !signature || !pageId) {
            return handleResponse(res, 400, 'Missing required headers: X-Access-Key, X-Timestamp, X-Signature, X-Page-Id', null)
        }
        
        // Get user by access key
        const user = await getUserByAccessKeyService(accessKey)
        if (!user) {
            return handleResponse(res, 401, 'Invalid access key', null)
        }
        
        // Verify signature
        const crypto = await import('crypto')
        const expectedSignature = crypto.createHmac('sha256', user.secret_key)
            .update(accessKey + timestamp)
            .digest('hex')
        
        if (signature !== expectedSignature) {
            return handleResponse(res, 401, 'Invalid signature', null)
        }
        
        // Check if timestamp is not too old (e.g., within 5 minutes)
        const currentTime = Math.floor(Date.now() / 1000)
        const requestTime = parseInt(timestamp)
        const timeDiff = currentTime - requestTime
        
        if (timeDiff > 300) { // 5 minutes
            return handleResponse(res, 401, 'Request timestamp is too old', null)
        }
        
        // Find website by page_id and user_id
        const website = await getWebsiteByPageIdAndUserIdService(pageId, user.id)
        if (!website) {
            return handleResponse(res, 404, 'Website not found for this page', null)
        }
        
        // Get active popup for this website
        const popup = await getActivePopupForWebsiteService(user.id, website.id)
        if (!popup) {
            return handleResponse(res, 404, 'No active popup found for this website', null)
        }

        
        handleResponse(res, 200, 'Popup found successfully', { 
            popup: popup.exported_html,
            settings: popup.content,
            website_url: website.url,
        })
    } catch (error) {
        next(error)
    }
}

export const getUserKeys = async (req, res, next) => {
    const { id } = req.user
    try {
        const user = await getUserKeysService(id)
        handleResponse(res, 200, 'User keys fetched successfully', user)
    } catch (error) {
        next(error)
    }
}

export const getUserWebsites = async (req, res, next) => {
    const { id } = req.user
    try {
        const websites = await getWebsitesByUserIdService(id)
        
        // Transform websites data to return only URL and title
        const websitesData = websites.map(website => ({
            id: website.id,
            url: website.url,
            title: website.title,
            page_id: website.page_id,
            created_at: website.created_at,
            updated_at: website.updated_at
        }))
        
        handleResponse(res, 200, 'User websites fetched successfully', {
            count: websitesData.length,
            websites: websitesData
        })
    } catch (error) {
        next(error)
    }
}
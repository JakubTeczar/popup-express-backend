import { 
    getAllWebsitesService, 
    getWebsiteByIdService, 
    getWebsitesByUserIdService,
    createWebsiteService, 
    updateWebsiteService, 
    deleteWebsiteService,
    createMultipleWebsitesService
} from '../models/websiteModel.js'

// Standard CRUD responses
const handleResponse = (res, statusCode, message, data) => {
    res.status(statusCode).json({
        status: statusCode,
        message,
        data
    })
}

export const getAllWebsites = async (req, res, next) => {
    try {
        const websites = await getAllWebsitesService()
        if (!websites.length) {
            return handleResponse(res, 404, 'No websites found', [])
        }
        handleResponse(res, 200, 'Websites fetched successfully', websites)
    } catch (error) {
        next(error)
    }
}

export const getWebsiteById = async (req, res, next) => {
    const { id } = req.params
    try {
        const website = await getWebsiteByIdService(id)
        if (!website) {
            return handleResponse(res, 404, 'Website not found', null)
        }
        handleResponse(res, 200, 'Website fetched successfully', website)
    } catch (error) {
        next(error)
    }
}

export const getWebsitesByUserId = async (req, res, next) => {
    const { userId } = req.params
    try {
        const websites = await getWebsitesByUserIdService(userId)
        handleResponse(res, 200, 'User websites fetched successfully', websites)
    } catch (error) {
        next(error)
    }
}

export const createWebsite = async (req, res, next) => {
    const { user_id, url, title, page_id } = req.body
    try {
        const newWebsite = await createWebsiteService({ user_id, url, title, page_id })
        handleResponse(res, 201, 'Website created successfully', newWebsite)
    } catch (error) {
        next(error)
    }
}

export const updateWebsite = async (req, res, next) => {
    const { id } = req.params
    const { url, title, page_id } = req.body
    try {
        const updatedWebsite = await updateWebsiteService(id, { url, title, page_id })
        if (!updatedWebsite) {
            return handleResponse(res, 404, 'Website not found', null)
        }
        handleResponse(res, 200, 'Website updated successfully', updatedWebsite)
    } catch (error) {
        next(error)
    }
}

export const deleteWebsite = async (req, res, next) => {
    const { id } = req.params
    try {
        const deletedWebsite = await deleteWebsiteService(id)
        if (!deletedWebsite) {
            return handleResponse(res, 404, 'Website not found', null)
        }
        handleResponse(res, 200, 'Website deleted successfully', deletedWebsite)
    } catch (error) {
        next(error)
    }
}

// Bulk create websites (for webhook)
export const createMultipleWebsites = async (req, res, next) => {
    const { websites } = req.body
    try {
        if (!Array.isArray(websites)) {
            return handleResponse(res, 400, 'Websites must be an array', null)
        }
        
        const createdWebsites = await createMultipleWebsitesService(websites)
        handleResponse(res, 201, 'Websites created successfully', createdWebsites)
    } catch (error) {
        next(error)
    }
}

import { createPopupService, getPopupService, updatePopupService, deletePopupService, getAllUserPopupsService } from '../models/popupModel.js'
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

export const createPopup = async (req, res, next) => {
    const { user_id, name, template_id, popup_config, content, exported_html, active, websites, images } = req.body
    try {
        // Parse images array if provided
        let imageList = []
        if (images && Array.isArray(images)) {
            imageList = images.map(img => ({
                id: img.id,
                name: img.name,
                url: img.url
            }))
        }
        
        const popupData = { 
            user_id, 
            name, 
            template_id, 
            popup_config, 
            content, 
            exported_html, 
            active, 
            websites: websites || [],
            images: imageList
        }
        
        const newPopup = await createPopupService(popupData)
        handleResponse(res, 201, 'Popup created successfully', newPopup)
    } catch (error) {
        next(error)
    }
}

export const getPopup = async (req, res, next) => {
    const { share_id } = req.params
    try {
        const popup = await getPopupService(share_id)
        if (!popup) {
            return handleResponse(res, 404, 'Popup not found', null)
        }
        handleResponse(res, 200, 'Popup fetched successfully', popup)
    } catch (error) {
        next(error)
    }
}

export const updatePopup = async (req, res, next) => {
    const { share_id } = req.params
    const { name, template_id, popup_config, content, exported_html, active, websites, images } = req.body
    try {
        // Parse images array if provided
        let imageList = []
        if (images && Array.isArray(images)) {
            imageList = images.map(img => ({
                id: img.id,
                name: img.name,
                url: img.url
            }))
        }

        const updatedPopup = await updatePopupService(share_id, name, template_id, popup_config, content, exported_html, active, websites || [], imageList)
        if (!updatedPopup) {
            return handleResponse(res, 404, 'Popup not found', null)
        }
        handleResponse(res, 200, 'Popup updated successfully', updatedPopup)
    } catch (error) {
        next(error)
    }
}

export const deletePopup = async (req, res, next) => {
    const { share_id } = req.params
    try {
        const deletedPopup = await deletePopupService(share_id)
        if (!deletedPopup) {
            return handleResponse(res, 404, 'Popup not found', null)
        }
        handleResponse(res, 200, 'Popup deleted successfully', deletedPopup)
    } catch (error) {
        next(error)
    }
}

export const getAllUserPopups = async (req, res, next) => {
    const { user_id } = req.params
    try {
        const popups = await getAllUserPopupsService(user_id)
        if (!popups) {
            return handleResponse(res, 404, 'No popups found', null)
        }
        handleResponse(res, 200, 'All user popups fetched successfully', popups)
    } catch (error) {
        next(error)
    }
}
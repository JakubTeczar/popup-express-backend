import pool from '../config/db.js'
import { loadNamedQueries } from '../utils/sqlLoader.js'
import crypto from 'crypto'

const queries = loadNamedQueries('popupQueries')

export const createPopupService = async (popup) => {
    const { user_id, name, template_id, popup_config, content, exported_html, active, website_url, images } = popup
    const share_id = crypto.randomUUID() 
    const checkShareId = await pool.query(queries.checkShareId, [share_id])
    if (checkShareId.rows.length > 0) {
        throw new Error('Share ID already exists')
    }
    const result = await pool.query(queries.createPopup, [user_id, name, template_id, popup_config, content, exported_html, active, share_id, website_url, images])
    return result.rows[0]
}

export const getPopupService = async (share_id) => {
    const result = await pool.query(queries.getPopup, [share_id])
    return result.rows[0]
}

export const updatePopupService = async (share_id, name, template_id, popup_config, content, exported_html, active, website_url, images) => {
    const result = await pool.query(queries.updatePopup, [share_id, name, template_id, popup_config, content, exported_html, active, website_url, images])
    return result.rows[0]
}

export const deletePopupService = async (share_id) => {
    const result = await pool.query(queries.deletePopup, [share_id])
    return result.rows[0]
}

export const getAllUserPopupsService = async (user_id) => {
    const result = await pool.query(queries.getAllUserPopups, [user_id])
    return result.rows
}
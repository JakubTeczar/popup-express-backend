import pool from '../config/db.js'
import { loadNamedQueries } from '../utils/sqlLoader.js'

const queries = loadNamedQueries('imageQueries')

export const uploadImageService = async (imageData) => {
    const { 
        user_id, 
        original_name, 
        file_name, 
        file_path, 
        file_url, 
        file_size, 
        mimetype 
    } = imageData
    
    const result = await pool.query(queries.uploadImage, [
        user_id, 
        original_name, 
        file_name, 
        file_path, 
        file_url, 
        file_size, 
        mimetype
    ])
    
    return result.rows[0]
}

export const getImageByUrlService = async (file_url) => {
    const result = await pool.query(queries.getImageByUrl, [file_url])
    return result.rows[0]
}

export const getAllUserImagesService = async (userId) => {
    const result = await pool.query(queries.getAllUserImages, [userId])
    return result.rows
}

export const deleteImageService = async (imageId, userId) => {
    const result = await pool.query(queries.deleteImage, [imageId, userId])
    return result.rows[0]
}

export const getImageByIdService = async (id) => {
    const result = await pool.query(queries.getImageById, [id])
    return result.rows[0]
}
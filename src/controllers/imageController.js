import { uploadImageService, getImageByUrlService, getAllUserImagesService, deleteImageService, getImageByIdService } from '../models/imageModel.js'
import { uploadFile, deleteFile } from '../utils/fileUpload.js'

// Standard CRUD responses
const handleResponse = (res, statusCode, message, data) => {
    res.status(statusCode).json({
        status: statusCode,
        message,
        data
    })
}

export const uploadImage = async (req, res, next) => {
    try {
        if (!req.files || !req.files.image) {
            return handleResponse(res, 400, 'No image file provided', null)
        }

        const userId = req.user.id // From JWT token

        // Upload file
        const uploadedFile = uploadFile(req.files.image, 'uploads/images')
        
        // Save to database
        const imageData = {
            user_id: userId,
            original_name: uploadedFile.originalName,
            file_name: uploadedFile.fileName,
            file_path: uploadedFile.filePath,
            file_url: uploadedFile.fileUrl,
            file_size: uploadedFile.size,
            mimetype: uploadedFile.mimetype
        }

        const newImage = await uploadImageService(imageData)
        handleResponse(res, 201, 'Image uploaded successfully', newImage)
    } catch (error) {
        next(error)
    }
}

export const getImageByUrl = async (req, res, next) => {
    const { file_url } = req.params

    try {
        const image = await getImageByUrlService(file_url)
        if (!image) {
            return handleResponse(res, 404, 'Image not found', null)
        }
        handleResponse(res, 200, 'Image fetched successfully', image)
    } catch (error) {
        next(error)
    }
}

export const getImageById = async (req, res, next) => {
    const { id } = req.params
    try {
        const image = await getImageByIdService(id)
        if (!image) {
            return handleResponse(res, 404, 'Image not found', null)
        }
        handleResponse(res, 200, 'Image fetched successfully', image)
    } catch (error) {
        next(error)
    }
}


export const getAllUserImages = async (req, res, next) => {
    const userId = req.user.id

    try {
        const images = await getAllUserImagesService(userId)
        handleResponse(res, 200, 'Images fetched successfully', images)
    } catch (error) {
        next(error)
    }
}

export const deleteImage = async (req, res, next) => {
    const { id } = req.params
    const userId = req.user.id

    try {
        // First get image info to delete file
        const image = await getImageByIdService(id)
        if (!image) {
            return handleResponse(res, 404, 'Image not found', null)
        }

        // Check if user owns the image
        if (image.user_id !== userId) {
            return handleResponse(res, 403, 'Access denied', null)
        }

        // Delete from database
        const deletedImage = await deleteImageService(id, userId)
        
        // Delete file from filesystem
        deleteFile(image.file_path)

        handleResponse(res, 200, 'Image deleted successfully', deletedImage)
    } catch (error) {
        next(error)
    }
}
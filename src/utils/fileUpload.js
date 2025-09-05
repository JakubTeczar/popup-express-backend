import path from 'path'
import fs from 'fs'

/**
 * Upload file to server
 * @param {Object} file - File object from req.files
 * @param {string} folder - Folder to save file (default: 'uploads')
 * @param {Array} allowedTypes - Allowed file types (default: ['image/jpeg', 'image/png', 'image/gif'])
 * @returns {Object} File info
 */
export const uploadFile = (file, folder = 'uploads', allowedTypes = ['image/webp', 'image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/svg+xml']) => {
    try {
        // Check if file exists
        if (!file) {
            throw new Error('No file uploaded')
        }

        // Check file type
        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error(`File type ${file.mimetype} not allowed. Allowed types: ${allowedTypes.join(', ')}`)
        }

        // Create folder if it doesn't exist
        const uploadPath = path.join(process.cwd(), folder)
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true })
        }

        // Generate unique filename
        const timestamp = Date.now()
        const fileExtension = path.extname(file.name)
        const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}${fileExtension}`
        const filePath = path.join(uploadPath, fileName)

        // Move file to destination
        file.mv(filePath, (err) => {
            if (err) {
                throw new Error('Error saving file')
            }
        })

        return {
            originalName: file.name,
            fileName: fileName,
            filePath: filePath,
            fileUrl: `/${folder}/${fileName}`,
            size: file.size,
            mimetype: file.mimetype
        }
    } catch (error) {
        throw error
    }
}

/**
 * Delete file from server
 * @param {string} filePath - Path to file to delete
 */
export const deleteFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
            return true
        }
        return false
    } catch (error) {
        console.error('Error deleting file:', error)
        return false
    }
}

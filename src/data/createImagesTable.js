import pool from '../config/db.js'
import { loadSQL } from '../utils/sqlLoader.js'

const createImagesTable = async () => {
    try {
        const createTablesSQL = loadSQL('createImagesTable')
        await pool.query(createTablesSQL)
        console.log('Images table created successfully')
    } catch (error) {
        console.error('Error creating images table:', error)
        throw error
    }
}

export default createImagesTable

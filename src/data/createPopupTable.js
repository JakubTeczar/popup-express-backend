import pool from '../config/db.js'
import { loadSQL } from '../utils/sqlLoader.js'

const createPopupTable = async () => {
    try {
        const createTablesSQL = loadSQL('createPopupTable')
        await pool.query(createTablesSQL)
        console.log('Popup table created successfully')
    } catch (error) {
        console.error('Error creating popup table:', error)
        throw error
    }
}

export default createPopupTable
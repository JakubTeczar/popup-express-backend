import pool from '../config/db.js'
import { loadSQL } from '../utils/sqlLoader.js'

const createUserTable = async () => {
    try {
        const createTablesSQL = loadSQL('createUserTable')
        await pool.query(createTablesSQL)
        console.log('User table created successfully')
    } catch (error) {
        console.error('Error creating user table:', error)
        throw error
    }
}

export default createUserTable
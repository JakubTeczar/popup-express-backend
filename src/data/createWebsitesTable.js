import pool from '../config/db.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const createWebsitesTable = async () => {
    try {
        const sqlPath = join(__dirname, '../sql/createWebsitesTable.sql')
        const sql = readFileSync(sqlPath, 'utf8')
        
        await pool.query(sql)
        console.log('Websites table created successfully')
    } catch (error) {
        console.error('Error creating websites table:', error)
    }
}

export default createWebsitesTable

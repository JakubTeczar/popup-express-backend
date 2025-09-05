import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Cache for loaded SQL queries
const sqlCache = new Map()

/**
 * Load SQL file and return its content
 * @param {string} filename - Name of the SQL file (without extension)
 * @param {string} folder - Folder name (default: 'sql')
 * @returns {string} SQL content
 */
export const loadSQL = (filename, folder = 'sql') => {
    const cacheKey = `${folder}/${filename}`
    
    // Return from cache if already loaded
    if (sqlCache.has(cacheKey)) {
        return sqlCache.get(cacheKey)
    }
    
    try {
        const sqlPath = path.join(__dirname, '..', folder, `${filename}.sql`)
        const sqlContent = fs.readFileSync(sqlPath, 'utf8')
        
        // Cache the content
        sqlCache.set(cacheKey, sqlContent)
        
        return sqlContent
    } catch (error) {
        throw new Error(`Failed to load SQL file: ${filename}.sql - ${error.message}`)
    }
}

/**
 * Parse SQL file with named queries
 * @param {string} filename - Name of the SQL file
 * @returns {object} Object with query names as keys
 */
export const loadNamedQueries = (filename) => {
    const sqlContent = loadSQL(filename)
    const queries = {}
    
    // Split by comments that contain "name:" 
    const queryBlocks = sqlContent.split(/-- name: (\w+)/)
    
    for (let i = 1; i < queryBlocks.length; i += 2) {
        const queryName = queryBlocks[i]
        const querySQL = queryBlocks[i + 1]?.trim()
        
        if (queryName && querySQL) {
            // Remove any trailing comments and normalize whitespace
            queries[queryName] = querySQL
                .replace(/--.*$/gm, '') // Remove line comments
                .replace(/\s+/g, ' ')   // Normalize whitespace
                .trim()
        }
    }
    
    return queries
}

/**
 * Clear SQL cache (useful for development)
 */
export const clearSQLCache = () => {
    sqlCache.clear()
}

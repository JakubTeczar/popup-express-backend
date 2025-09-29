import pool from '../config/db.js'
import { loadNamedQueries } from '../utils/sqlLoader.js'

// Load all website queries once
const queries = loadNamedQueries('websiteQueries')

export const getAllWebsitesService = async () => {
    const result = await pool.query(queries.getAllWebsites)
    return result.rows
}

export const getWebsiteByIdService = async (id) => {
    const result = await pool.query(queries.getWebsiteById, [id])
    return result.rows[0]
}

export const getWebsitesByUserIdService = async (userId) => {
    const result = await pool.query(queries.getWebsitesByUserId, [userId])
    return result.rows
}

export const getWebsiteByPageIdService = async (pageId) => {
    const result = await pool.query(queries.getWebsiteByPageId, [pageId])
    return result.rows[0]
}

export const createWebsiteService = async (website) => {
    const { user_id, url, title, page_id } = website
    const result = await pool.query(queries.createWebsite, [user_id, url, title, page_id])
    return result.rows[0]
}

export const updateWebsiteService = async (id, website) => {
    const { url, title, page_id } = website
    const result = await pool.query(queries.updateWebsite, [id, url, title, page_id])
    return result.rows[0]
}

export const deleteWebsiteService = async (id) => {
    const result = await pool.query(queries.deleteWebsite, [id])
    return result.rows[0]
}

export const deleteWebsitesByUserIdService = async (userId) => {
    const result = await pool.query(queries.deleteWebsitesByUserId, [userId])
    return result.rows
}

export const checkWebsiteExistsService = async (pageId, userId) => {
    const result = await pool.query(queries.checkWebsiteExists, [pageId, userId])
    return result.rows[0].count > 0
}

export const getWebsiteByPageIdAndUserIdService = async (pageId, userId) => {
    const result = await pool.query(queries.getWebsiteByPageIdAndUserId, [pageId, userId])
    return result.rows[0]
}

// Bulk operations for webhook - create or update
export const createMultipleWebsitesService = async (websites) => {
    const results = []
    for (const website of websites) {
        try {
            // Check if website already exists for this user and page_id
            const existingWebsite = await getWebsiteByPageIdAndUserIdService(website.page_id, website.user_id)
            
            if (existingWebsite) {
                // Update existing website using its ID
                const result = await updateWebsiteService(existingWebsite.id, {
                    url: website.url,
                    title: website.title,
                    page_id: website.page_id
                })
                console.log('Updated existing website:', result)
                results.push(result)
            } else {
                // Create new website
                const result = await createWebsiteService(website)
                console.log('Created new website:', result)
                results.push(result)
            }
        } catch (error) {
            console.error('Error processing website:', error)
            // Continue with other websites even if one fails
        }
    }
    return results
}

// Bulk delete operations for webhook
export const deleteMultipleWebsitesService = async (pages, userId) => {
    const results = []
    for (const page of pages) {
        try {
            const pageId = page.ID || page.id
            if (!pageId) continue
            
            // Find website by page_id and user_id
            const existingWebsite = await getWebsiteByPageIdAndUserIdService(pageId, userId)
            
            if (existingWebsite) {
                // Delete the website
                const result = await deleteWebsiteService(existingWebsite.id)
                console.log('Deleted website:', result)
                results.push(result)
            } else {
                console.log('Website not found for deletion:', { pageId, userId })
            }
        } catch (error) {
            console.error('Error deleting website:', error)
            // Continue with other websites even if one fails
        }
    }
    return results
}

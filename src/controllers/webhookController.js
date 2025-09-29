import crypto from 'crypto'
import { getUserByAccessKeyService } from '../models/userModel.js'
import { createMultipleWebsitesService, deleteMultipleWebsitesService } from '../models/websiteModel.js'

/**
 * Webhook controller for handling WordPress page data
 */
export const handleWordPressWebhook = async (req, res) => {
  try {
    const { body, headers } = req
    
    // Validate webhook signature for security
    const signature = headers['x-signature']
    const timestamp = headers['x-timestamp']
    const accessKey = headers['x-access-key']
    
    if (!signature || !timestamp || !accessKey) {
      return res.status(401).json({ 
        error: 'Missing required headers: X-Signature, X-Timestamp, X-Access-Key' 
      })
    }
    
    // Get user by access key
    const user = await getUserByAccessKeyService(accessKey)
    if (!user) {
      return res.status(401).json({ error: 'Invalid access key' })
    }
    
    // Validate timestamp (prevent replay attacks)
    const currentTime = Math.floor(Date.now() / 1000)
    const requestTime = parseInt(timestamp)
    const timeDiff = Math.abs(currentTime - requestTime)
    
    if (timeDiff > 300) { // 5 minutes tolerance
      return res.status(401).json({ error: 'Request timestamp too old' })
    }
    
    // Verify signature using user's secret key
    const expectedSignature = crypto.createHmac('sha256', user.secret_key)
      .update(accessKey + timestamp)
      .digest('hex')
    
    if (signature !== expectedSignature) {
      return res.status(401).json({ error: 'Invalid signature' })
    }
    
    // Process WordPress webhook data
    const webhookData = {
      action: body.action, // 'publish' or 'delete'
      post_type: body.post_type,
      post_id: body.post_id,
      status: body.action, // WordPress sends action as status
      title: body.title,
      url: body.url,
      pages: body.pages || [{ // Convert single post to pages array
        ID: body.post_id,
        title: body.title,
        url: body.url
      }]
    }
    
    console.log('Webhook authenticated for user:', user.name, '(ID:', user.id, ')')
    console.log('Status:', webhookData.status, 'Pages count:', webhookData.pages ? webhookData.pages.length : 0)
    
    // Process websites data based on status
    let processedWebsites = []
    if (webhookData.pages && webhookData.pages.length > 0) {
      try {
        if (webhookData.status === 'publish') {
          console.log('Processing PUBLISH request')
          // Transform pages data to website format
          const websitesData = webhookData.pages.map(page => ({
            user_id: user.id,
            url: page.url || '',
            title: page.title || '',
            page_id: page.ID || page.id
          }))
          
          processedWebsites = await createMultipleWebsitesService(websitesData)
          console.log('Published/Updated websites:', processedWebsites.length)
        } else if (webhookData.status === 'delete') {
          console.log('Processing DELETE request')
          console.log('Attempting to delete websites for user:', user.id)
          console.log('Pages to delete:', webhookData.pages)
          processedWebsites = await deleteMultipleWebsitesService(webhookData.pages, user.id)
          console.log('Deleted websites:', processedWebsites.length)
        } else {
          console.log('Unknown status:', webhookData.status)
        }
      } catch (error) {
        console.error('Error processing websites:', error)
        console.error('Error details:', error.message)
        console.error('Error stack:', error.stack)
      }
    } else {
      console.log('No pages data to process')
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Webhook received successfully',
      action: webhookData.action,
      status: webhookData.status,
      postType: webhookData.post_type,
      postId: webhookData.post_id,
      pagesCount: webhookData.pages ? webhookData.pages.length : 0,
      processedWebsitesCount: processedWebsites.length,
      userId: user.id,
      userName: user.name
    })
    
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
}

/**
 * Test webhook endpoint (for development)
 */
export const testWebhook = async (req, res) => {
  try {
    res.status(200).json({ 
      success: true, 
      message: 'Webhook endpoint is working',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'
import pool from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import errorHandler from './middlewares/errorHandler.js'
import createUserTable from './data/createUserTable.js'
import createPopupTable from './data/createPopupTable.js'
import createImagesTable from './data/createImagesTable.js'
import createWebsitesTable from './data/createWebsitesTable.js'
import popupRoutes from './routes/popupRoutes.js'
import imageRoutes from './routes/imageRoutes.js'
import webhookRoutes from './routes/webhookRoutes.js'
import websiteRoutes from './routes/websiteRoutes.js'

dotenv.config()
const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(cors({
    origin: ['https://popify-creator.onrender.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Access-Key', 'X-Timestamp', 'X-Signature', 'X-Page-Id']
}))

// File upload middleware
app.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max file size
    },
    abortOnLimit: true,
    responseOnLimit: "File size limit has been reached"
}))

// Serve static files
app.use('/uploads', express.static('uploads'))

//Routes
app.use('/api/users', userRoutes)
app.use('/api/popup', popupRoutes)
app.use('/api/images', imageRoutes)
app.use('/api/webhook', webhookRoutes)
app.use('/api/websites', websiteRoutes)

//Error handling
app.use(errorHandler)

//Crate tables before starting the server
createUserTable()
createPopupTable()
createImagesTable()
createWebsitesTable()

//Postgres Connection
app.get('/', async (req, res) => {
    const result = await pool.query('SELECT current_database()')
    res.send("Connected to the database: " + result.rows[0].current_database)
})

//Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
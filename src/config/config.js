import dotenv from 'dotenv'

dotenv.config()

export const config = {
    // Database
    db: {
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'your_password',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'your_database_name'
    },
    
    // Server
    port: process.env.PORT || 5000,
    
    // JWT
    jwt: {
        secret: process.env.ACCESS_TOKEN_SECRET || 'your-secret-key-change-this-in-production',
        expiresIn: '3h'
    }
}

# Backend API

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd back-end
```

### 2. Install dependencies
```bash
npm install
```

### 3. Database Setup

#### Option: Using Docker 
```bash
# Create and start PostgreSQL container
docker run -d --name popwise-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=popwise -p 5432:5432 postgres
```
### 4. Environment Configuration

Create a `.env` file in the root directory, copy env.example:

### 5. Start the development server
```bash
npm run dev
```

The server will start on `http://localhost:5000` (or the port specified in your .env file).

## API Endpoints  

- For test use file -> test.rest file
with extension REST Client 
image.PNG

## Database Schema

The application automatically creates the following tables on startup:
- `users` - User information and authentication
- `popups` - Popup configurations
- `images` - Image metadata
- `websites` - Website information


### Project Structure
```
src/
├── config/          # Database and configuration
├── controllers/     # Route controllers
├── data/           # Database initialization scripts
├── middlewares/    # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── sql/           # SQL queries and schemas
└── utils/         # Utility functions
```
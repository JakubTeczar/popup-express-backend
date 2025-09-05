//Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json(
        {
            status: res.statusCode,
            message: err.message,
            error: 'Something went wrong!' 
        }
    )
}

export default errorHandler
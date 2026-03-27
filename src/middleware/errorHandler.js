const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        path: req.originalUrl,
        errors: err.errors || [],
        ...(process.env.NODE_ENV === 'development' && {stack: err.stack}),
    });
};

module.exports = errorHandler;

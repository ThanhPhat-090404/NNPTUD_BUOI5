const { errorResponse } = require('../utils/response');

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('[Error Handler] ', err);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map((val) => val.message).join(', ');
    }

    // Mongoose cast error (bad object ID)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Resource not found / Invalid ID: ${err.value}`;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate field value entered: ${field}`;
    }

    return errorResponse(res, message, statusCode);
};

module.exports = errorHandler;

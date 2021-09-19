AppError = require('../utilities/appError')

const dbCastError = err => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const dbDuplicateError = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);
  
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
}

const dbValidationError = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const sendDevError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const sendProdError = (err, res) => {
    if(err.isOperational) {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })
} else {
    console.log('you blew it up', err)
    res.status(500).json({ //so we dont leak info to end user
        status:'error',
        message:'something went wrong'
    })
}
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if(process.env.NODE_ENV === "dev") {
        sendDevError(err, res)
    } else if(process.env.NODE_ENV == "prod") {
        let error = { ...err }

        if(error.name = 'CastError') error = dbCastError(error)
        if(error.name = 11000) error = dbDuplicateError(error)
        if(error.name = 'ValidationError') error = dbValidationError(error)
        sendProdError(err, res)
    }
    
}
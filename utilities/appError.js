class AppError extends Error {
    constructor(message, statusCode) {
        super(message)

        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
        //tagging errors for when there are programatic errors or something like that
        this.isOperational = true

        //stack trace
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError
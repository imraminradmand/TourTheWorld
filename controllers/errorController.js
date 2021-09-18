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
        sendProdError(err, res)
    }
    
}
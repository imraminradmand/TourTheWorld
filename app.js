const express = require('express')
const morgan = require('morgan')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const AppError = require('./utilities/appError')
const app = express()

// MIDDLEWARE
if(process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'))
}
app.use(express.json())

// ROUTES
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', tourRouter)

//error handling for undefined routes
app.all('*', (req, res, next) => {
    next(new AppError(`${req.originalUrl} does not exsist`, 404))
})

//error middleware
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
})

module.exports = app
 
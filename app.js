const express = require('express')
const morgan = require('morgan')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
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
    // res.status(404).json({
    //     status:'failed',
    //     message: `${req.originalUrl} does not exsist`
    // })
    const err = new Error(`${req.originalUrl} does not exsist`)
    err.status = 'fail'
    err.statusCode = 404

    next(err)
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
 
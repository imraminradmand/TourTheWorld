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
    res.status(404).json({
        status:'failed',
        message: `${req.originalUrl} does not exsist`
    })
})

module.exports = app
 
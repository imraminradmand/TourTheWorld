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

module.exports = app
 
const express = require('express')
const morgan = require('morgan')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const app = express()

// MIDDLEWARE
app.use(express.json())
app.use(morgan('dev'))

// ROUTES
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', tourRouter)

module.exports = app
 
const express = require('express')
const cors = require('cors')

// Controllers
const { globalErrorHandler } = require('./controllers/error.controller')

// Routers
const { usersRouter } = require('./routes/users.routes')
const { ProductsRouter } = require('./routes/products.routes')
const { CartsRouter } = require('./routes/carts.routes')

const app = express()

app.use(cors())

// Enable incoming JSON data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Endpoints
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/products', ProductsRouter)
app.use('/api/v1/cart', CartsRouter)

app.use(globalErrorHandler)

module.exports = { app }

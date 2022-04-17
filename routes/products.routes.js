const express = require('express')

const {
	getAllProducts,
	getProductById,
	createNewProduct,
	updateProduct,
	deleteProduct,
} = require('../controllers/products.controller')

const { validateSession } = require('../middlewares/auth.middleware')
const {
	createProductValidations,
	validateResult,
} = require('../middlewares/validators.middleware')

const router = express.Router()

router.use(validateSession)

router
	.route('/')
	.get(getAllProducts)
	.post(createProductValidations, validateResult, createNewProduct)

router
	.route('/:id')
	.get(getProductById)
	.patch(updateProduct)
	.delete(deleteProduct)

module.exports = { ProductsRouter: router }

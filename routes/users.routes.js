const express = require('express')

// Controllers
const {
	getAllUsers,
	getUserProducts,
	getUserById,
	getUserOrderById,
	getUserOrders,
	createUser,
	updateUser,
	deleteUser,
	loginUser,
} = require('../controllers/users.controller')

const { validateSession } = require('../middlewares/auth.middleware')
const {
	createUserValidations,
	validateResult,
} = require('../middlewares/validators.middleware')

const router = express.Router()

router.post('/', createUserValidations, validateResult, createUser)

router.post('/login', loginUser)

router.use(validateSession)

router.get('/', getAllUsers)

router.get('/me', getUserProducts)

router.get('/orders', getUserOrders)

router.get('/orders/:id', getUserOrderById)

router.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser)

module.exports = { usersRouter: router }

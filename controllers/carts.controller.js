const { Cart } = require('../models/cart.model')
const { Product } = require('../models/product.model')
const { ProductInCart } = require('../models/productInCart.model')
const { Order } = require('../models/order.model')

const { AppError } = require('../util/appError')
const { catchAsync } = require('../util/catchAsync')

exports.getUserCart = catchAsync(async (req, res, next) => {
	const { id } = req.currentUser

	const cart = await Cart.findOne({
		attributes: { exclude: ['userId', 'status'] },
		where: { userId: id, status: 'active' },
		include: [
			{
				model: Product,
				through: { where: { status: 'active' } },
			},
		],
	})

	if (!cart) {
		return next(new AppError(404, 'Cart not found'))
	}

	res.status(200).json({
		status: 'success',
		data: { cart },
	})
})

exports.addProductToCart = catchAsync(async (req, res, next) => {
	const { currentUser } = req
	const { productId, quantity } = req.body

	const productExists = await Product.findOne({
		where: { id: productId, status: 'active' },
	})

	if (!productExists) {
		return next(new AppError(404, 'Product not found'))
	}

	if (quantity > productExists.quantity) {
		return next(
			new AppError(
				400,
				`This product only has ${productExists.quantity} items.`
			)
		)
	}

	const cart = await Cart.findOne({
		where: { userId: currentUser.id, status: 'active' },
	})

	if (!cart) {
		const newCart = await Cart.create({ userId: currentUser.id })

		await ProductInCart.create({
			cartId: newCart.id,
			productId,
			quantity,
		})
	}

	if (cart) {
		const productInCartExists = await ProductInCart.findOne({
			where: {
				cartId: cart.id,
				productId,
			},
		})

		if (productInCartExists?.status === 'active') {
			return next(
				new AppError(400, 'This is product is already in the cart')
			)
		}

		if (productInCartExists?.status === 'disable') {
			await productInCartExists.update({
				quantity,
				status: 'active',
			})
		}

		if (!productInCartExists) {
			await ProductInCart.create({ cartId: cart.id, productId, quantity })
		}
	}

	res.sendStatus(201)
})

exports.updateProductInCart = catchAsync(async (req, res, next) => {
	const { id } = req.currentUser
	const { productId, newQty } = req.body

	const product = await Product.findOne({
		where: { id: productId, status: 'active' },
	})

	if (newQty > product.quantity) {
		return next(
			new AppError(400, `This product only has ${product.quantity} items`)
		)
	}

	const cart = await Cart.findOne({ where: { userId: id, status: 'active' } })

	if (!cart) {
		return next(new AppError(400, 'This user does not have a cart yet'))
	}

	const productExists = await ProductInCart.findOne({
		where: { status: 'active', cartId: cart.id, productId },
	})

	if (!productExists) {
		return next(
			new AppError(404, "Car't update product, is not in the cart yet")
		)
	}

	if (newQty === 0) {
		await productExists.update({ quantity: 0, status: 'disable' })
	}

	if (newQty > 0) {
		await productExists.update({ quantity: newQty })
	}

	res.sendStatus(204)
})

exports.deleteProductInCart = catchAsync(async (req, res, next) => {
	const { productId } = req.params
	const { id } = req.currentUser

	const cart = await Cart.findOne({
		where: { status: 'active', userId: id },
	})

	if (!cart) {
		return next(new AppError(404, 'This user does not have a cart yet'))
	}

	const productInCart = await ProductInCart.findOne({
		where: { status: 'active', cartId: cart.id, productId },
	})

	if (!productInCart) {
		return next(
			new AppError(404, 'This product does not exits in this cart')
		)
	}

	await productInCart.update({ status: 'disable' })

	res.sendStatus(204)
})

exports.purchaseCart = catchAsync(async (req, res, next) => {
	const { id } = req.currentUser

	const cart = await Cart.findOne({
		where: { status: 'active', userId: id },
		include: [{ model: Product, through: { where: { status: 'active' } } }],
	})

	if (!cart) {
		return next(new AppError(404, 'This user does not have a cart yet'))
	}

	let totalPrice = 0

	const cartPromises = cart.products.map(async product => {
		const price = product.price * product.productsInCart.quantity

		totalPrice += price

		await product.productsInCart.update({ status: 'purchased' })

		const newQty = product.quantity - product.productsInCart.quantity

		return await product.update({ quantity: newQty })
	})

	await Promise.all(cartPromises)

	await cart.update({ status: 'purchased' })

	const newOrder = await Order.create({
		userId: id,
		cartId: cart.id,
		issuedAt: new Date().toString(),
		totalPrice,
	})

	res.status(201).json({ status: 'success', data: { newOrder } })
})

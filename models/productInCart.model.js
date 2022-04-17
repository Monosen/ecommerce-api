const { DataTypes } = require('sequelize')

const { Product } = require('./product.model')
const { Cart } = require('./cart.model')

const { db } = require('../util/database')

const ProductInCart = db.define(
	'productsInCart',
	{
		id: {
			primaryKey: true,
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		cartId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: Cart, key: 'id' },
		},
		productId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: Product, key: 'id' },
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		status: {
			// active | disable | deleted
			type: DataTypes.STRING(10),
			allowNull: false,
			defaultValue: 'active',
		},
	},
	{ timestamps: false }
)

module.exports = { ProductInCart }

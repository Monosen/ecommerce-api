const { DataTypes } = require('sequelize')

const { db } = require('../util/database')
const { Cart } = require('./cart.model')
const { User } = require('./user.model')

const Order = db.define(
	'orders',
	{
		id: {
			primaryKey: true,
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: User, key: 'id' },
		},
		cartId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: Cart, key: 'id' },
		},
		issuedAt: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		totalPrice: {
			type: DataTypes.FLOAT,
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

module.exports = { Order }

const { DataTypes } = require('sequelize')

const { User } = require('./user.model')

const { db } = require('../util/database')

const Product = db.define(
	'products',
	{
		id: {
			primaryKey: true,
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		price: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: User, key: 'id' },
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

module.exports = { Product }

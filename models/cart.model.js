const { DataTypes } = require('sequelize');

const { User } = require('./user.model');

const { db } = require('../util/database');

const Cart = db.define(
  'carts',
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: 'id' }
    },
    status: {
      // active | disable | deleted
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'active'
    }
  },
  { timestamps: false }
);

module.exports = { Cart };

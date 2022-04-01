// Models
const { User } = require('../models/user.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productInCart.model');

const initModels = () => {
  User.hasMany(Product);
  Product.belongsTo(User);

  User.hasMany(Order);
  Order.belongsTo(User);

  User.hasOne(Cart);
  Cart.belongsTo(User);

  Cart.belongsToMany(Product, { through: ProductInCart });
  Product.belongsToMany(Cart, { through: ProductInCart });

  Cart.hasOne(Order);
  Order.belongsTo(Cart);
};

module.exports = { initModels };

const { catchAsync } = require('../util/catchAsync');

const { Product } = require('../models/product.model');

const { AppError } = require('../util/appError');

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: { status: 'active' }
  });

  res.status(200).json({ status: 'success', data: { products } });
});

exports.getProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({
    where: { id, status: 'active' }
  });

  if (!product) {
    return next(new AppError(404, 'product not fount'));
  }

  res.status(200).json({ status: 'success', data: { product } });
});

exports.createNewProduct = catchAsync(async (req, res, next) => {
  const { id } = req.currentUser;
  const { title, description, price, quantity } = req.body;

  const newProduct = await Product.create({
    title,
    description,
    price,
    quantity,
    userId: id
  });

  res.status(201).json({ status: 'success', data: { newProduct } });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { id } = req.params;
  const { title, description, price, quantity } = req.body;

  const product = await Product.findOne({
    where: { id, status: 'active', userId: currentUser.id }
  });

  if (!product) {
    return next(new AppError(404, 'Product not fount'));
  }

  await product.update({
    title,
    description,
    price,
    quantity
  });

  res.sendStatus(204);
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.currentUser;

  const product = await Product.findOne({
    where: { status: 'active', userId: id }
  });

  if (!product) {
    return next(new AppError(404, 'Product not fount'));
  }

  await product.update({
    status: 'disable'
  });

  res.sendStatus(204);
});

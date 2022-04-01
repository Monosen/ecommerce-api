const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { User } = require('../models/user.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');
const { Cart } = require('../models/cart.model');

const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');

dotenv.config({ path: './.env' });

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    where: { status: 'active' }
  });

  res.status(200).json({ status: 'success', data: { users } });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: { id, status: 'active' },
    attributes: { exclude: ['password'] }
  });

  res.status(200).json({ status: 'success', data: { user } });
});

exports.getUserProducts = catchAsync(async (req, res, next) => {
  const { id } = req.currentUser;

  const products = await Product.findAll({
    where: { userId: id, status: 'active' }
  });

  res.status(200).json({
    status: 'success',
    data: { products }
  });
});

exports.getUserOrders = catchAsync(async (req, res, next) => {
  const { id } = req.currentUser;

  const orders = await Order.findAll({
    where: { userId: id, status: 'active' },
    include: [{ model: Cart, where: { status: 'purchased' } }]
  });

  res.status(200).json({
    status: 'success',
    data: { orders }
  });
});

exports.getUserOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { currentUser } = req;

  const order = await Order.findOne({
    where: { id, userId: currentUser.id, status: 'active' },
    include: [{ model: Cart, where: { status: 'purchased' } }]
  });

  if (!order) {
    return next(new AppError(404, 'This order not exist'));
  }
  res.status(200).json({
    status: 'success',
    data: { order }
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user given an email and has status active
  const user = await User.findOne({
    where: { email, status: 'active' }
  });

  // Compare entered password vs hashed password
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError(400, 'Credentials are invalid'));
  }

  // Create JWT
  const token = await jwt.sign(
    { id: user.id }, // Token payload
    process.env.JWT_SECRET, // Secret key
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  res.status(200).json({
    status: 'success',
    data: { token }
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword
  });

  newUser.password = undefined;

  // Send mail to newly created account
  // await new Email(email).send();

  res.status(201).json({
    status: 'success',
    data: { newUser }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { id } = req.params;
  const { username, email } = req.body;

  const user = await User.findOne({
    where: { id: currentUser.id, status: 'active' },
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    return next(new AppError(400, 'User not found'));
  }

  await user.update({ username, email });

  res.sendStatus(204);
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { id } = req.params;

  const user = await User.findOne({
    where: { id: currentUser.id, status: 'active' }
  });

  if (!user) {
    return next(new AppError(400, 'User not found'));
  }

  await user.update({ status: 'disable' });

  res.sendStatus(204);
});

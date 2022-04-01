const { body, validationResult } = require('express-validator');
const { AppError } = require('../util/appError');

exports.createUserValidations = [
  body('username').isString().notEmpty().withMessage('Enter a valid name'),
  body('email').isEmail().notEmpty().withMessage('Enter a valid email'),
  body('password')
    .isAlphanumeric()
    .withMessage(`Password must include letters and numbers`)
    .isLength({ min: 8, max: 50 })
    .withMessage('Password must be 8 characters long')
];

exports.createProductValidations = [
  body('title')
    .isString()
    .withMessage('Title must be a string')
    .notEmpty()
    .withMessage('Must provide a valid title'),
  body('description')
    .isString()
    .withMessage('Description must be a string')
    .notEmpty()
    .withMessage('Must provide a valid description'),
  body('quantity')
    .isNumeric()
    .withMessage('Quantity must be a number')
    .custom((value) => value > 0)
    .withMessage('Quantity must be greater than 0'),
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .custom((value) => value > 0)
    .withMessage('Price must be greater than 0')
];

exports.addProductToCartValidations = [
  body('productId')
    .isNumeric()
    .withMessage('Product id must be a number')
    .custom((value) => value > 0)
    .withMessage('Must provide a valid id'),
  body('quantity')
    .isNumeric()
    .withMessage('Quantity must be a number')
    .custom((value) => value > 0)
    .withMessage('Quantity must be greater than 0')
];

exports.updateProductToCartValidations = [
  body('productId')
    .isNumeric()
    .withMessage('Product id must be a number')
    .custom((value) => value > 0)
    .withMessage('Must provide a valid id'),
  body('newQty')
    .isNumeric()
    .withMessage('Quantity must be a number')
    .custom((value) => value >= 0)
    .withMessage('Quantity must be greater than 0')
];

exports.validateResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map(({ msg }) => msg)
      .join('. ');

    return next(new AppError(400, message));
  }

  next();
};

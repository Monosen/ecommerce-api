const express = require('express');

const {
  getUserCart,
  addProductToCart,
  updateProductInCart,
  deleteProductInCart,
  purchaseCart
} = require('../controllers/carts.controller');

const { validateSession } = require('../middlewares/auth.middleware');
const {
  addProductToCartValidations,
  updateProductToCartValidations,
  validateResult
} = require('../middlewares/validators.middleware');

const router = express.Router();

router.use(validateSession);

router.get('/', getUserCart);

router.post(
  '/add-product',
  addProductToCartValidations,
  validateResult,
  addProductToCart
);

router.post('/purchase', purchaseCart);

router.patch(
  '/update-cart',
  updateProductToCartValidations,
  validateResult,
  updateProductInCart
);

router.delete('/:productId', deleteProductInCart);

module.exports = { CartsRouter: router };

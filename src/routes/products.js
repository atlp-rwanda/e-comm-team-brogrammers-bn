import express from 'express';
import Products from '../controllers/products.controllers';
import checkRole from '../middlewares/Checkrole';
import isAuthenticated from '../middlewares/verifyToken';
import upload from '../configs/multer';
import productVatidate from '../middlewares/productValidate';
import editProductVatidate from '../middlewares/editProductValidate';
import isOwner from '../middlewares/isowner';
import isAvailable from '../middlewares/isProductAvailable';
import catchError from '../middlewares/catchError';

const routes = express.Router();

routes.post(
  '/',
  isAuthenticated,
  checkRole(['seller']),
  upload.array('images'),
  productVatidate,
  Products.postProduct
);
routes.patch(
  '/:id',
  isAuthenticated,
  checkRole(['seller']),
  isOwner,
  upload.array('images'),
  editProductVatidate,
  Products.editProduct
);
routes.get('/', Products.getProducts);
routes.get(
  '/collection',
  isAuthenticated,
  checkRole(['seller']),
  Products.sellergetProduct
);
routes.delete(
  '/delete/:id',
  isAuthenticated,
  checkRole(['seller']),
  isOwner,
  Products.deleteProduct
);
routes.get('/:id', isAvailable, Products.getProduct);
routes.patch(
  '/:id/available',
  isAuthenticated,
  checkRole(['seller']),
  isOwner,
  Products.toggleAvailable
);

routes.get(
  '/buyer/:id',
  isAuthenticated,
  checkRole(['buyer']),
  Products.getProductById
);
routes.get(
  '/seller/:id',
  isAuthenticated,
  checkRole(['seller']),
  Products.getProductByIdAndSeller
);
routes.get('/:id/reviews', catchError(Products.getProductReviews));

export default routes;

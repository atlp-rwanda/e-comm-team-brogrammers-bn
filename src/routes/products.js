import express from 'express';
import Products from '../controllers/products.controllers';
import checkRole from '../middlewares/Checkrole';
import isAuthenticated from '../middlewares/verifyToken';
import upload from '../configs/multer';
import productVatidate from '../middlewares/productValidate';
import editProductVatidate from '../middlewares/editProductValidate';
import isOwner from '../middlewares/isowner';

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
routes.get(
  '/',
  Products.getProduct
);
routes.get(
  '/collection',
  isAuthenticated,
  checkRole(['seller']),
  Products.sellergetProduct
);

routes.get('/buyer/:id', isAuthenticated,checkRole(['buyer']),Products.getProductById);
routes.get('/seller/:id',isAuthenticated,checkRole(['seller']),Products.getProductByIdAndSeller);

export default routes;

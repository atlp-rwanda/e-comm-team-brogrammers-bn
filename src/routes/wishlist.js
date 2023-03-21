import express from 'express';
import isItemInWishlist from '../middlewares/wishlist/isItemInWishlist';
import wishlist from '../controllers/wishlist.controller';
import isAuthenticated from '../middlewares/verifyToken';
import doesProductExist from '../middlewares/wishlist/doesProductExist';
// eslint-disable-next-line import/no-unresolved, import/extensions

const routes = express.Router();

routes.post('/:id', isAuthenticated, doesProductExist, isItemInWishlist, wishlist.postwish);
routes.get('/', isAuthenticated, wishlist.getwishesofuser);
export default routes;

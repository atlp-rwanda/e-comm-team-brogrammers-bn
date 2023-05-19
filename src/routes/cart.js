import express from 'express';
import Cartcontroller from '../controllers/cart.controller';
import isAuthenticated from '../middlewares/verifyToken';
import doesProductExist from '../middlewares/wishlist/doesProductExist';
import isOwnerOfCart from '../middlewares/isOwnerOfCart';
import checkRole from '../middlewares/Checkrole';
// eslint-disable-next-line import/no-unresolved, import/extensions

const routes = express.Router();

routes.post('/:id', isAuthenticated, doesProductExist, Cartcontroller.addItemTocart);
routes.delete('/:id', isAuthenticated, doesProductExist, isOwnerOfCart, Cartcontroller.removeFromCart);

routes.delete('/', isAuthenticated, isOwnerOfCart, Cartcontroller.clearCart);
routes.get('/', isAuthenticated, isOwnerOfCart, Cartcontroller.viewCartOfUser);
routes.get('/all', isAuthenticated, checkRole(['admin']), Cartcontroller.viewAllCartOfUsers);
export default routes;

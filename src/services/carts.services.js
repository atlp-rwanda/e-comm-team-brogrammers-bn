// eslint-disable-next-line import/named, import/no-duplicates
const { carts, products } = require('../database/models');
// eslint-disable-next-line import/no-duplicates, import/named

/**
 * cart services
 */
export default class cartService {
  /**
   * adding product to cart
   * @param {Object} req the data for product
   * @param {Object} res body
   * @returns {data} for the created user
   */
  static async addItem(req) {
    const { id } = req.params;
    const quantitie = req.body.quantities || 1;
    const product = await products.findOne({ where: { id, available: true } });
    if (product) {
      if (product.quantity < quantitie) {
        return { error: { message: 'not enough product in stock' } };
      }
      const newprice = product.price * quantitie;
      const item = {
        id: product.id,
        name: product.name,
        image: product.images[0],
        quantity: quantitie,
        price: product.price,
        Ptotal: newprice,
      };
      const userid = req.user.id;
      const cart = await carts.findOne({ where: { userId: userid } });
      if (!cart) {
        const newCart = await carts.create({
          products: [item],
          userId: req.user.id,
        });
        newCart.total = newCart.products
          .map((item1) => JSON.parse(item1.Ptotal))
          .reduce((sum, next) => sum + next);
        await newCart.save();
        return {
          value: {
            message: 'added to cart successfully',
            data: newCart
            // eslint-disable-next-line object-curly-newline
          } };
      }
      const itemExists = cart.products.findIndex(
        (cartitem) => cartitem.id === item.id
      );
      if (itemExists !== -1) {
        cart.products.splice(itemExists, 1);
      }
      cart.products.push(item);
      const subtotal = cart.products
        .map((prod1) => JSON.parse(prod1.Ptotal))
        .reduce((sum, next) => sum + next);
      cart.total = subtotal;
      await carts.update(
        { products: cart.products, total: subtotal },
        { where: { id: cart.id } }
      );
      return {
        value: {
          message: 'added to cart successfully',
          data: cart
          // eslint-disable-next-line object-curly-newline
        } };
    }
  }

  /**
   * adding product to cart
   * @param {Object} req the data for product
   * @returns {data} for the created user
   */
  static async deleteItem(req) {
    const { id } = req.params;
    const cart1 = req.cart;
    const itemExists = cart1.products.findIndex(
      (cartitem) => cartitem.id === id
    );
    if (itemExists !== -1) {
      cart1.products.splice(itemExists, 1);
    }
    // eslint-disable-next-line eqeqeq
    if (cart1.products.length == 0) {
      await cart1.destroy();
      return { value: { message: 'removed product from cart  successfully' } };
    }
    const subtotal = cart1.products
      .map((prod1) => JSON.parse(prod1.Ptotal))
      .reduce((sum, next) => sum + next);
    cart1.total = subtotal;
    await cart1.save();
    return { value: { message: 'removed product from cart  successfully' } };
  }

  /**
   *  view the cart
   * @param {Object} req the data for product
   * @returns {data} for viewing product in cart
   */
  static async viewCart(req) {
    const userid = req.user.id;
    const cart = await carts.findOne({ where: { userId: userid } });
    return {
      value: {
        message: 'Hey Here is your cart!',
        data: cart
        // eslint-disable-next-line object-curly-newline
      } };
  }

  /**
 * view all carts
 * @param {Object} req the data for product
 * @returns {data} for viewing product in cart
 */
  static async viewAllCarts() {
    // eslint-disable-next-line no-use-before-define
    const allcart = await carts.findAll();
    return {
      value: {
        message: 'Here are all the carts',
        data: allcart
      // eslint-disable-next-line object-curly-newline
      }
    };
  }
}

/* eslint-disable import/named */
import {
  users, order, orderitem, products, carts
} from '../database/models';

export const getCurrentUserOrders = async (req, res) => {
  const user = await users.findOne({
    where: { email: req.user.email },
    include: { model: order, as: 'orders' },
  });
  res.json(user.orders);
};

export const createOrder = async (req, res) => {
  const user = await users.findOne({
    where: { email: req.user.email },
    include: { model: carts, as: 'cart' },
  });
  const userCart = user.cart;

  if (!userCart || userCart.products.length === 0) {
    return res
      .status(400)
      .json({ message: "You cart is empty can't checkout" });
  }

  const cartProducts = userCart.products;

  const {
    deliveryCountry, deliveryCity, deliveryStreet, paymentMethod
  } = req.body;

  const userOrder = await order.create({
    deliveryCountry,
    deliveryCity,
    deliveryStreet,
    paymentMethod,
    status: 'active',
    totalAmount: userCart.total,
    buyerId: req.user.id,
  });

  cartProducts.forEach(async (pro) => {
    const product = await products.findOne({ where: { id: pro.id } });
    product.quantity -= pro.quantity;

    await orderitem.create({
      quantity: pro.quantity,
      productId: product.id,
      orderId: userOrder.id,
      price: pro.price,
    });

    await product.save();
  });

  await userOrder.save();
  user.cart.products = [];
  user.cart.total = 0;
  await user.cart.save();

  res.json({ message: 'Order was created successfully', order: userOrder });
};

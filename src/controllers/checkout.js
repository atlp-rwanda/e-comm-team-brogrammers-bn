/* eslint-disable camelcase */
/* eslint-disable import/named */
import {
  users, order, orderitem, products, carts
} from '../database/models';

export const getCurrentUserOrders = async (req, res) => {
  const user = await users.findOne({
    where: { email: req.user.email },
    include: {
      model: order,
      as: 'orders',
      include: {
        model: products,
        as: 'products',
        attributes: ['id', 'images', 'name', 'available', 'price']
      }
    },
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
    totalAmount: userCart.total,
    buyerId: req.user.id,
  });

  cartProducts.forEach(async (pro) => {
    const product = await products.findOne({ where: { id: pro.id } });

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

export const viewOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const orders = await order.findOne({
      where: { id: order_id, buyerId: res.user.id },
      include: {
        model: order,
        as: 'orders',
        include: {
          model: products,
          as: 'products',
          attributes: ['id', 'images', 'name', 'available', 'price']
        }
      },
    });

    if (!orders) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const updatedOrder = req.body;
    const orders = await order.findOne({
      where: { id: order_id }
    });

    if (!orders) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    // Ensure that the buyer is authenticated and authorized to update the order
    if (orders.buyerId !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to update this order.' });
    }

    // Update the order with the new data
    await orders.update(updatedOrder);

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const orders = await order.findOne({
      where: { id: order_id }
    });
    if (!orders) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    // Ensure that the buyer is authenticated and authorized to update the order
    if (orders.buyerId !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this order.' });
    }

    // Delete the order from the database
    await orders.destroy();

    return res.status(201).json({ message: 'Order deleted successfully!' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};

/* eslint-disable camelcase */
/* eslint-disable import/named */
import {
  users,
  order,
  orderitem,
  products,
  carts,
  notifications,
} from '../database/models';
import { sendEmail } from '../helpers/mail';
import { emailConfig } from '../helpers/emailConfig';
import { notificationTemplate2 } from '../helpers/mailTemplate';

export const getCurrentUserOrders = async (req, res) => {
  const user = await users.findOne({
    where: { email: req.user.email },
    include: {
      model: order,
      as: 'orders',
      include: {
        model: products,
        as: 'products',
        attributes: ['id', 'images', 'name', 'available', 'price'],
      },
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
    const useremail = await users.findOne({ where: { id: product.sellerId } });
    const newNotification = {
      message: 'your product have been ordered ',
      type: 'Product sales update',
    };
    const newN = { ...newNotification };
    newN.receiverId = user.id;
    const receiver = {
      username: useremail.username,
      email: useremail.email,
    };
    const notifyEmail = notificationTemplate2(
      receiver.username,
      newN.message,
      newN.type
    );
    sendEmail(
      emailConfig({
        email: receiver.email,
        subject: 'Notification !! product sales update',
        content: notifyEmail,
      })
    );
    await notifications.create(newN);

    await product.save();
  });

  await userOrder.save();
  user.cart.products = [];
  user.cart.total = 0;
  await user.cart.save();
  const newNotification = {
    message: 'you have been assigned new role which is ',
    type: 'user role updates',
  };
  const newN = { ...newNotification };
  newN.receiverId = user.id;
  const receiver = {
    username: user.username,
    email: user.email,
  };
  const notifyEmail = notificationTemplate2(
    receiver.username,
    newN.message,
    newN.type
  );
  sendEmail(
    emailConfig({
      email: receiver.email,
      subject: 'Notification !! role updates',
      content: notifyEmail,
    })
  );
  await notifications.create(newN);
  res.json({ message: 'Order was created successfully', order: userOrder });
};

export const viewOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    let orders;
    orders = await order.findOne({
      where: { id: order_id, buyerId: req.user.id },
      include: {
        model: products,
        as: 'products',
        attributes: ['id', 'images', 'name', 'available', 'price'],
      },
    });
    if (!orders && req.user.role === 'admin') {
      orders = await order.findOne({
        where: { id: order_id },
        include: {
          model: products,
          as: 'products',
          attributes: ['id', 'images', 'name', 'available', 'price'],
        },
      });
    }

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
      where: { id: order_id },
    });

    if (!orders) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    // Ensure that the buyer is authenticated and authorized to update the order
    if (orders.buyerId !== req.user.id && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'You are not authorized to update this order.' });
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
      where: { id: order_id },
    });
    if (!orders) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    // Ensure that the buyer is authenticated and authorized to update the order
    if (orders.buyerId !== req.user.id && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'You are not authorized to delete this order.' });
    }

    // Delete the order from the database
    await orders.destroy();
    return res.status(201).json({ message: 'Order deleted successfully!' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const totalCount = await order.count();
    // eslint-disable-next-line radix
    const page = parseInt(req.query.page) || 1;
    // eslint-disable-next-line radix
    const limit = parseInt(req.query.limit) || totalCount;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    if (endIndex < totalCount) {
      results.next = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit,
      };
    }
    results.results = await order.findAll({
      limit,
      include: [
        {
          model: users,
          as: 'buyer',
          attributes: ['username', 'email'],
        },
        {
          model: products,
          as: 'products',
          attributes: ['id', 'images', 'name', 'available', 'price'],
        },
      ],
      offset: startIndex,
    });
    const orders = results;
    res
      .status(200)
      .json({ message: 'All orders retrieved successfully', orders });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
};

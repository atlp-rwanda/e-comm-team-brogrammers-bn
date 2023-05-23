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
import {
  createOrders,
  viewOrderss,
  OrderError,
  viewOrders,
  updatedOrders,
  deletedOrders,
  adminGetOrders,
} from '../loggers/checkout.logger';
import GenerateOrdersNo from '../helpers/getRandom';

export const getCurrentUserOrders = async (req, res) => {
  const orders = await order.findAll({
    where: { buyerId: req.user.id },
    order: [
      ['createdAt', 'DESC'],
    ],
    include: {
      model: products,
      as: 'products',
      attributes: ['id', 'images', 'name', 'available', 'price'],
      include: {
        model: users,
        as: 'seller',
        attributes: ['username', 'email', 'avatar'],
      },
    },
  });
  viewOrderss(req, orders);
  res.json(orders);
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

  // eslint-disable-next-line object-curly-newline
  const { deliveryCountry, deliveryCity, deliveryStreet } = req.body;

  const userOrder = await order.create({
    deliveryCountry,
    deliveryCity,
    deliveryStreet,
    orderNo: Number(GenerateOrdersNo()),
    paymentMethod: 'card',
    totalAmount: userCart.total,
    buyerId: req.user.id,
  }, {
    include: {
      model: products,
      as: 'products',
      attributes: ['id', 'images', 'name', 'available', 'price'],
      include: {
        model: users,
        as: 'seller',
        attributes: ['username', 'email', 'avatar'],
      },
    },
  });

  const orderitems = await Promise.all(cartProducts.map(async (pro) => {
    const product = await products.findOne({
      where: { id: pro.id },
      attributes: ['id', 'images', 'name', 'available', 'price', 'sellerId'],
      include: {
        model: users,
        as: 'seller',
        attributes: ['username', 'email', 'avatar'],
      }
    });

    const ordered = await orderitem.create({
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
    const {
      id, images, name, available, price, seller
    } = product;

    return {
      id, images, name, available, price, seller, orderitem: ordered
    };
  }));

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
  createOrders(req, products);
  console.log({
    ordered: { ...userOrder, orderitems }
  });
  res.json({ message: 'Order was created successfully', order: { ...userOrder.dataValues, products: orderitems } });
};

const getOrderWithAccess = async (id, user) => {
  let orders;
  if (user.role === 'admin') {
    orders = await order.findOne({
      where: { id },
      include: [
        {
          model: users,
          as: 'buyer',
          attributes: ['avatar', 'username', 'email'],
        },
        {
          model: products,
          as: 'products',
          attributes: ['id', 'images', 'name', 'available', 'price'],
          include: {
            model: users,
            as: 'seller',
            attributes: ['username', 'email', 'avatar'],
          },
        },
      ],
      attributes: {
        exclude: ['buyerId']
      }
    });
  } else {
    orders = await order.findOne({
      where: { id, buyerId: user.id },
      include: {
        model: products,
        as: 'products',
        attributes: ['id', 'images', 'name', 'available', 'price'],
        include: {
          model: users,
          as: 'seller',
          attributes: ['username', 'email', 'avatar'],
        },
      },
      attributes: {
        exclude: ['buyerId']
      }
    });
  }

  return orders;
};

export const viewOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const orders = await getOrderWithAccess(order_id, req.user);

    if (!orders) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    viewOrders(req, order_id);
    return res.status(200).json(orders);
  } catch (error) {
    OrderError(req, error);
    return res.status(500).json({ error: 'Server error.' });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const {
      id, isPaid, totalAmount, createdAt, updatedAt, buyerId,
      ...updatedOrder
    } = req.body;
    const orders = await getOrderWithAccess(order_id, req.user);

    if (!orders) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Update the order with the new data
    await orders.update(updatedOrder);
    updatedOrders(req, order_id);
    return res.status(200).json(orders);
  } catch (error) {
    OrderError(req, error);
    return res.status(500).json({ error: 'Server error.' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const orders = await getOrderWithAccess(order_id, req.user);

    if (!orders) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Delete the order from the database
    await orders.destroy();
    deletedOrders(req, order_id);
    return res.status(201).json({ message: 'Order deleted successfully!' });
  } catch (error) {
    OrderError(req, error);
    return res.status(500).json({ error: 'Server error.' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const totalCount = await order.count();
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || totalCount;
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
          attributes: ['username', 'email', 'avatar'],
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
    adminGetOrders(req, orders);
    res
      .status(200)
      .json({ message: 'All orders retrieved successfully', orders });
  } catch (error) {
    OrderError(req, error);
    res.status(500).json({ error: error.message });
  }
};

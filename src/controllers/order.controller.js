// orderController.js
// eslint-disable-next-line import/no-unresolved, import/named
import { order, users, products } from '../database/models';

const getOrderStatuses = async (req, res) => {
  try {
    const orders = await order.findAll({
      include: [
        {
          model: users,
          attributes: ['id', 'username', 'role'],
          as: 'buyer',
        },
      ],
    });

    return res.status(200).json({
      message: 'Fetch success',
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'error!!!!',
      error: error.message,
    });
  }
};

const getOrderStatusEvents = async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('connection', 'keep-alive');
  res.setHeader('Content-Type', 'text/event-stream');

  res.write('event: ping\n');

  // Set up interval to send update events to the client
  const intervalId = setInterval(async () => {
    const orders = await order.findAll({
      where: {
        statusUpdated: true,
      },
      include: [
        {
          model: users,
          attributes: ['id', 'username', 'role'],
          as: 'buyer',
        },
      ],
    });
    if (!orders.length > 0) {
      return;
    }
    const data = { orders };
    res.write('event: update\n');
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    await orders.forEach(async (item) => {
      item.statusUpdated = false;
      await item.save();
    });
  }, 3000);

  // Handle client disconnect by clearing interval
  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
};

const getOrderStatus = async (req, res) => {
  try {
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
    return res.status(200).json({
      message: `Fetched all orders of the user ${user.username}`,
      // eslint-disable-next-line no-undef
      data: { orders: user.orders },
    });
  } catch (err) {
    return res.status(500).json({
      message: 'We have an error',
      error: err.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    // eslint-disable-next-line prefer-destructuring
    const { orderId } = req.params;
    const newOrder = await order.findOne({
      where: {
        id: orderId,
      },
    });
    newOrder.status = req.body.status;
    newOrder.statusUpdated = true;
    await newOrder.save();

    return res.status(200).json({
      message: 'Updated success',
      data: newOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'We have an error',
      error: error.message,
    });
  }
};

export {
  getOrderStatus,
  updateOrderStatus,
  getOrderStatuses,
  getOrderStatusEvents,
};

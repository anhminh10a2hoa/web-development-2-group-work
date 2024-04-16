require('dotenv').config();
const User = require('../models/user.js');
const Order = require('../models/order.js');
const sendTask = require('../rabbit-utils/sendTask.js');

const getAllOrders = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ message: 'You dont have permission to access' });
  }
  res.json(await Order.find({}));
};

const getOrderUSer = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    const order = await Order.find({ customerId: user._id });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    const order = {
      ...req.body,
    };
    let totalPrice = 0;
    order.items.forEach((item) => {
      totalPrice +=
        Number.parseFloat(item.price) +
        item.toppings.reduce(
          (total, topping) => (total += Number.parseInt(topping.number) * 0.5),
          0
        );
    });
    let mongoOrder = new Order({
      ...order,
      customerId: user._id,
      customerName: user.name,
      orderPrice: totalPrice,
      status: 'received',
      time: {
        ...order.time,
        receiveOrderTime: new Date().toISOString(),
      },
    });

    const newOrder = await Order.create(mongoOrder);
    sendTask.addTask('rapid-runner-rabbit', 'received-orders', newOrder);
    return res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ email: req.user.email });
    const order = await Order.findOne({ _id: id });

    if (
      user._id.toString() !== order.customerId.toString() &&
      user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({ message: 'You dont have permission to access' });
    }

    await Order.deleteOne({ _id: id });
    return res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getAllOrders, createOrder, getOrderUSer, deleteOrder };

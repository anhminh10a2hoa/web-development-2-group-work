require('dotenv').config();
const UserModel = require('../models/user.js');
const OrderModel = require('../models/order.js');
const RabbitUtils = require('../rabbit-utils/sendTask.js');

/**
 * Retrieves all orders and sends them back as JSON. Requires admin authorization.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @returns Returns a 403 error if user does not have permission.
 */
const getAllOrders = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ message: 'You do not have permission to access' });
  }
  res.json(await OrderModel.find({}));
};

/**
 * Retrieves all orders from the logged-in user and sends them back as JSON.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 */
const getUserOrders = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });
    const orders = await OrderModel.find({ customerId: user._id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Creates a new order and sends it back as JSON.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @returns Returns the newly created order.
 */
const createOrder = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });
    const orderData = {
      ...req.body,
    };
    let totalPrice = 0;
    orderData.items.forEach((item) => {
      totalPrice +=
        Number.parseFloat(item.price) +
        item.toppings.reduce(
          (total, topping) => (total += Number.parseInt(topping.number) * 0.5),
          0
        );
    });
    const newOrder = new OrderModel({
      ...orderData,
      customerId: user._id,
      customerName: user.name,
      orderPrice: totalPrice,
      status: 'received',
      time: {
        ...orderData.time,
        receiveOrderTime: new Date().toISOString(),
      },
    });

    await newOrder.save();
    RabbitUtils.addTask('rapid-runner-rabbit', 'received-orders', newOrder);
    return res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Deletes an order based on the OrderID.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @returns Returns a 403 error if the user does not have permission to delete the order.
 */
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const user = await UserModel.findOne({ email: req.user.email });
    const order = await OrderModel.findOne({ _id: orderId });

    if (
      user._id.toString() !== order.customerId.toString() &&
      user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to access' });
    }

    await OrderModel.deleteOne({ _id: orderId });
    return res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getAllOrders, createOrder, getUserOrders, deleteOrder };
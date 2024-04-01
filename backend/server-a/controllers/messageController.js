const User = require('../models/user.js');
const Order = require('../models/order.js');
const socketController = require('../utils/socket-io.js');

/**
 * Updates order status to "InQueue" and notifies the user via WebSocket
 * @param {Object} currentOrder The current order object
 */
const acknowledgeOrder = async (currentOrder) => {
  try {
    const user = await User.findOne({ _id: currentOrder.customerId });
    const order = await Order.findOne({ _id: currentOrder._id });
    
    order.status = "InQueue";
    order.time.inQueueTime = new Date().toISOString();

    await order.save();
    socketController.updateData(user.name, await Order.find({ customerId: user._id }));
  } catch (error) {
    console.log(error);
  }
};

/**
 * Updates order status to "Failed" and notifies the user via WebSocket
 * @param {Object} currentOrder The current order object
 */
const rejectOrder = async (currentOrder) => {
  try {
    const user = await User.findOne({ _id: currentOrder.customerId });
    const order = await Order.findOne({ _id: currentOrder._id });
    
    order.status = "Failed";
    order.time.doneTime = new Date().toISOString();

    await order.save();
    socketController.updateData(user.name, await Order.find({ customerId: user._id }));
  } catch (error) {
    console.log(error);
  }
};

/**
 * Updates order status to "Ready" and notifies the user via WebSocket
 * @param {string} currentOrder The current order object as a string
 */
const fulfillOrder = async (currentOrder) => {
  currentOrder = JSON.parse(currentOrder);
  try {
    const user = await User.findOne({ _id: currentOrder.customerId });
    const order = await Order.findOne({ _id: currentOrder._id });
    
    order.status = "Ready";
    order.time.doneTime = new Date().toISOString();
    
    await order.save();
    socketController.updateData(user.name, await Order.find({ customerId: user._id }));
  } catch (error) {
    console.log(error);
  }
};

// Exporting functions
module.exports = { acknowledgeOrder, rejectOrder, fulfillOrder };
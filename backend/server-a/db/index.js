const { connectDB, disconnectDB } = require('./db');

(async () => {
  connectDB();
  try {
    const sandwich = require('../models/sandwich');
    const order = require('../models/order');
    await sandwich.deleteMany({});
    await order.deleteMany({});
    console.log('Deleted sandwich and order collections.');
  } catch (error) {
    console.log(error);
  }
  disconnectDB();
})();
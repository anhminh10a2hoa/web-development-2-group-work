const { connectDB, disconnectDB } = require('./db');
const sandwiches = require('./sandwiches.json').map((product) => ({
  ...product,
}));

(async () => {
  connectDB();
  try {
    const sandwich = require('../models/sandwich');
    const order = require('../models/order');
    await sandwich.deleteMany({});
    await order.deleteMany({});
    await sandwich.create(sandwiches);
    console.log('Deleted sandwich and order collections.');
  } catch (error) {
    console.log(error);
  }
  disconnectDB();
})();
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { addTask } = require('./rabbit-utils/sendTask');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
// Endpoint to add a new sandwich order
app.post('/orders', (req, res) => {
  const order = req.body;
  // Add order to the message queue
  addTask('localhost', 'sandwich-orders', order);
  res.status(201).json({ message: 'Order received successfully' });
});

// Endpoint to show the state of earlier orders
app.get('/orders', (req, res) => {
  // Logic to retrieve earlier orders' state (if needed)
  res.status(200).json({ message: 'Showing state of earlier orders' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server A is running on port ${PORT}`);
});
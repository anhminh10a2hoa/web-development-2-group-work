const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defining the schema for sandwiches
const sandwichSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for the sandwich'],
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please specify the price for the sandwich'],
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL for the sandwich'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for the sandwich'],
  },
  toppings: {
    type: [Object],
  },
  breadType: {
    type: String,
    required: [true, 'Please specify the type of bread for the sandwich'],
    enum: ["oat", "rye", "wheat"],
  },
});

// Creating the Sandwich model
const Sandwich = mongoose.model('Sandwich', sandwichSchema);

// Exporting the Sandwich model
module.exports = Sandwich;

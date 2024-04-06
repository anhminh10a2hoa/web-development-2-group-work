const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = () => {
  mongoose
    .connect(
      `mongodb+srv://hoanganhminh256:T5ubmcNqwtCJUZS2@cluster0.3lmvqos.mongodb.net/WebDev`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    )
    .then(() => {
      console.log('DB connected');
    })
    .catch((err) => {
      console.log('error connecting to MongoDB:', err.message);
    });
};

const disconnectDB = () => {
  mongoose.disconnect();
};

module.exports = { connectDB, disconnectDB };
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = () => {
  mongoose
    .connect(
      `mongodb+srv://test:mLsEe61e9e02aypn@cluster0.bzfpyxy.mongodb.net/webdev`,
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

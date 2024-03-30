const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Constants
const SALT_ROUNDS = 10;

// Default schema properties
const SCHEMA_DEFAULTS = {
  name: {
    minLength: 10,
    maxLength: 50,
  },
  email: {
    // Regular expression for email validation
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: {
    minLength: 10,
  },
  role: {
    // Valid role values
    values: ['admin', 'customer'],
    // Default role value
    defaultValue: 'customer',
  },
};

// Schema definition for users
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minLength: SCHEMA_DEFAULTS.name.minLength,
    maxLength: SCHEMA_DEFAULTS.name.maxLength,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: SCHEMA_DEFAULTS.email.match,
  },
  password: {
    type: String,
    required: true,
    minLength: SCHEMA_DEFAULTS.password.minLength,
    // Hashing the password before saving
    set: (password) => {
      if (!password || password === undefined || password.length < SCHEMA_DEFAULTS.password.minLength) {
        throw new Error(`Password must be at least ${SCHEMA_DEFAULTS.password.minLength} characters long`);
      }
      return bcrypt.hashSync(password, SALT_ROUNDS);
    },
  },
  role: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    enum: SCHEMA_DEFAULTS.role.values,
    default: SCHEMA_DEFAULTS.role.defaultValue,
  },
});

// Method to compare passwords
userSchema.methods.checkPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Configure toJSON options for serialization
userSchema.set('toJSON', { virtuals: false, versionKey: false });

// Creating the User model
const User = mongoose.model('User', userSchema);

// Exporting the User model
module.exports = User;
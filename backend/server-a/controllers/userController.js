require('dotenv').config();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user.js');
const jwt = require('jsonwebtoken');

/**
 * Retrieves all users and sends them back as JSON. Requires admin authorization.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @returns
 */
const getAllUsers = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ message: 'You do not have permission to access' });
  }
  res.json(await UserModel.find({}));
};

/**
 * Retrieves a user by name and sends it as JSON.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 */
const getUserByName = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Invalid username' });
  }
};

/**
 * Creates a new user and sends the created user as JSON.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @returns
 */
const createUser = async (req, res) => {
  try {
    const newUser = new UserModel({ ...req.body });

    const existingUser = await UserModel.findOne({ email: newUser.email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Updates a user and sends the updated user as JSON.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 */
const updateUser = async (req, res) => {
  try {
    const allowedFields = ['name', 'email', 'password', 'role'];

    const user = await UserModel.findOne({ email: req.user.email });

    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        user[key] = req.body[key];
      }
    });
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/**
 * Deletes a user and sends the deleted user as JSON.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 */
const deleteUser = async (req, res) => {
  try {
    await UserModel.deleteOne({ email: req.user.email });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

/**
 * Middleware to retrieve a user by name.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @param {*} next - The next middleware function.
 * @returns
 */
const getUserByNameMiddleware = async (req, res, next) => {
  let user;
  try {
    user = await UserModel.findOne({ name: req.params.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  req.user = user;
  next();
};

/**
 * Handles user login and sends back a JSON Web Token.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @returns
 */
const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await UserModel.findOne({ name });

    if (!user || !(await user.checkPassword(password))) {
      return res
        .status(400)
        .json({ message: 'Invalid username or password' });
    }

    const tokenPayload = { name: user.name, email: user.email, role: user.role };
    const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET_KEY);

    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Middleware to verify the access token and set the user data in the request.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @param {*} next - The next middleware function.
 * @returns
 */
const authTokenMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

module.exports = {
  getAllUsers,
  getUserByName,
  createUser,
  updateUser,
  deleteUser,
  getUserByNameMiddleware,
  loginUser,
  authTokenMiddleware,
};

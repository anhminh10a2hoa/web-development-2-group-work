const SandwichModel = require('../models/sandwich');
const UserModel = require('../models/user.js');

/**
 * Retrieves all sandwiches and sends them back as JSON.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 */
const getAllSandwiches = async (req, res) => {
  res.json(await SandwichModel.find({}));
};

/**
 * Retrieves a sandwich by its ID and sends it as JSON.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @returns
 */
const getSandwichById = async (req, res) => {
  try {
    const sandwich = await SandwichModel.findById(req.params.sandwichId);
    if (!sandwich) {
      return res.status(404).json({ message: 'Sandwich not found' });
    }
    res.json(sandwich);
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID' });
  }
};

/**
 * Creates a new sandwich and sends the created sandwich as JSON.
 * Requires admin authorization.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @returns
 */
const createSandwich = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });
    if (user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'You do not have permission to access' });
    }
    const newSandwich = await SandwichModel.create(req.body);
    return res.status(201).json(newSandwich);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Updates a sandwich and sends the updated sandwich as JSON.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @returns
 */
const updateSandwich = async (req, res) => {
  try {
    const updatedSandwich = await SandwichModel.findByIdAndUpdate(
      req.params.sandwichId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedSandwich) {
      return res.status(404).json({ message: 'Sandwich not found' });
    }
    res.status(200).json(updatedSandwich);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Deletes a sandwich by its ID. Requires admin authorization.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @returns
 */
const deleteSandwich = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });
    if (user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'You do not have permission to access' });
    }

    const deletedSandwich = await SandwichModel.findByIdAndDelete(req.params.sandwichId);

    if (!deletedSandwich) {
      return res.status(404).json({ message: 'Sandwich not found' });
    }

    res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getAllSandwiches,
  getSandwichById,
  createSandwich,
  updateSandwich,
  deleteSandwich,
};

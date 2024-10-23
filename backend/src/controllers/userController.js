const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Membership = require("../models/membershipModel");


/**
 * Registers a new user.
 *
 * @route POST /register
 * @param {Object} req - The request object containing user data.
 * @param {Object} res - The response object.
 * @returns {Object} - Status and message indicating success or error.
 */
exports.userRegister = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already used" });
    }

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    //find pendingInvitation and add userId to it
    const user = await newUser.save();

    const pendingInvitations = await Membership.find({
      invitedMail: req.body.email,
      isAccepted: false,
    });
    if (pendingInvitations.length > 0) {
      await Promise.all(
        pendingInvitations.map(async (invitation) => {          
          invitation.userId = user._id;
          await invitation.save();
        })
      );
    }
    res.status(201).json({ message: `User created: ${user.email}` });
  } catch (error) {
    res.status(500).json({ message: "Registration error", error });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password." });
    }

    // Mettre à jour le mot de passe de l'utilisateur
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

/**
 * Authenticates a user and generates a JWT token.
 *
 * @route POST /login
 * @param {Object} req - The request object containing user credentials.
 * @param {Object} res - The response object.
 * @returns {Object} - Status, token, and user ID if successful.
 */
exports.userLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, roles: user.roles },
      process.env.JWT_KEY,
      { expiresIn: "10h" }
    );
    res
      .status(200)
      .json({ token, id: user._id, name: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Login error", error });
  }
};

/**
 * Updates a user's data.
 *
 * @route PUT /users/:user_id
 * @param {Object} req - The request object containing updates.
 * @param {Object} res - The response object.
 * @returns {Object} - Status and updated user data.
 */
exports.modifyUser = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: "Invalid format ID" });
    }
    res.status(500).json({ message: "Error in modifying user", error });
  }
};

/**
 * Retrieves a user's data.
 *
 * @route GET /users/:user_id
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - Status and user data if found.
 */
exports.getUser = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: "Invalid format ID" });
    }
    res.status(500).json({ message: "Error in retrieving user", error });
  }
};

/**
 * Deletes a user.
 *
 * @route DELETE /users/:user_id
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - Status and message confirming deletion.
 */
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: "Invalid format ID" });
    }
    res.status(500).json({ message: "Error in deleting user", error });
  }
};

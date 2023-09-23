const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../models/user");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      users: users.map((user) => {
        return user.toObject({ getters: true });
      }),
    });
  } catch (err) {
    const error = new Error("Fetched users is failed, please try again.");
    err.code = 500;
    return next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      const error = new Error("This is no user");
      error.code = 401;
      throw error;
    }

    res.status(200).json({
      message: "Authenticated successfully.",
      user: { userId: user._id },
    });
  } catch (error) {
    return next(error);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid input, please try again.");
      error.code = 422;
      throw error;
    }
  } catch (error) {
    return next(error);
  }

  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const error = new Error("This user already exist, please try again.");
      error.code = 422;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { user: { userId: newUser.id } },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Signup successfully",
      token: token,
      user: { userId: newUser.id },
    });
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("This user is not exist, please try again.");
      error.code = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = new Error("The password is not correct, please try again.");
      error.code = 401;
      throw error;
    }

    const token = jwt.sign(
      { user: { userId: user._id } },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login successfully",
      token: token,
      user: { userId: user.id },
    });
  } catch (error) {
    next(error);
  }
};

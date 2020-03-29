const User = require("../models/userModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");
// dotenv.config({ path: `${__dirname}/config.env` });
exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    const token = await newUser.generateToken(); // await très important
    res.status(201).json({
      status: "success",
      newUser,
      token
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      error
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateToken();
    res.status(200).json({
      status: "success",
      message: "You are logged in",
      token
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      error: error.message
    });
  }
};

exports.protect = async (req, res, next) => {
  // Check if a token is provided
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({
      status: "Fail",
      error: "Please log in"
    });
  }
  //check if token is valid
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new Error("User don't exist");
  }
  req.user = user;
  next();
};

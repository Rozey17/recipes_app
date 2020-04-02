const User = require("../models/userModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  // let token;
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  //   token = req.headers.authorization.split(" ")[1];
  // }
  try {
    // Check if a token is provided
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        status: "Fail",
        error: "Please log in"
      });
    }
    //check if token is valid
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decoded.id, "tokens.token": token }); // préciser tokens.token :token sinon ça marche pas
    if (!user) {
      throw new Error("User doesn't exist");
    }

    req.token = token; // très important pour logout
    req.user = user; //important

    next();
  } catch (error) {
    res.status(401).json({
      status: "Fail",
      error: " Please log in"
    });
  }
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
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
      error: error.message
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

exports.logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send("You are logged out");
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      error: console.log(error)
    });
  }
};

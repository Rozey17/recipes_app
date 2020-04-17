const User = require("./userModel");
const jwt = require("jsonwebtoken");
exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    const token = newUser.generateAuthToken();
    res.status(201).send({ newUser, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(401).json({
      status: "Fail",
      error: error.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      throw new Error("Please log in.");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id, "tokens.token": token });

    if (!user) {
      throw new Error("Please log in.");
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).json({
      status: "Fail",
      error: error.message,
    });
  }
};

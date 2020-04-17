const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Invalid email"],
  },
  password: { type: String, required: true },
  tokens: [
    {
      token: { type: String, required: true },
    },
  ],
  passwordConfirm: {
    type: String,
    //required:true
  },
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 12);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.tokens;

  return userObj;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Incorrect email or password");
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Incorrect email or password");
  }
  return user;
};

userSchema.methods.generateAuthToken = function () {
  const user = this;
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  user.tokens.push({ token });
  user.save();
  return token;
};

const User = new mongoose.model("User", userSchema);

module.exports = User;

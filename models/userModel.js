const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/config.env` });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user needs a name"],
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, "A user needs an email"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Invalid email"]
  },
  password: {
    type: String,
    required: [true, "A user needs a password"],
    lowercase: true,
    trim: true,
    minlength: 8,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('password cant contain "password"');
      }
    }
  },
  // passwordConfirm: {
  //   type: String,
  //   required: true
  // },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

userSchema.pre("save", async function(next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 12);
  }
  //user.passwordConfirm = undefined;
  next();
});

userSchema.virtual("recipes", {
  ref: "Recipe",
  localField: "_id",
  foreignField: "owner"
});

userSchema.methods.generateToken = async function() {
  const user = this;
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token; //très important
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("incorrect email or password");
  }

  const isMatch = bcrypt.compare(password, user.password); // pas de await sinon ça marche pas

  if (!isMatch) {
    throw new Error("incorrect email or password");
  }

  return user;
};

const User = new mongoose.model("User", userSchema);

module.exports = User;

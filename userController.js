const User = require("./userModel");

exports.getAll = async (req, res) => {
  const users = await User.find({});

  res.status(200).json({
    status: "success",
    users,
  });
};

exports.getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("recipes");
    //await user.populate("recipes").execPopulate();
    console.log(user.recipes);
    if (!user) {
      throw new Error("User not found");
    }

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      throw new Error("User not found");
    }
    res.status(204).send("User deleted successfully");
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.getMe = (req, res) => {
  try {
    if (!req.user) {
      throw new Error("User not found");
    }

    res.status(200).send(req.user);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.updateMe = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    throw new Error("Invalid update input(s)");
  }
  updates.forEach((update) => (req.user[update] = req.body[update]));
  await req.user.save();
  res.status(200).send(req.user);
};

exports.logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send("You are logged out");
  } catch (e) {
    res.status(500).send(e.message);
  }
};

exports.logoutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("Logged out of all sessions");
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const User = require("../models/userModel");

exports.getAll = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const users = await User.find({ queryObj });
    res.status(200).json({
      status: "success",
      users
    });
  } catch (error) {
    res.status(500).json({});
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    await user.populate("recipes").execPopulate();
    console.log(user.recipes);
    res.status(200).json({
      status: "success",
      user
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      error
    });
  }
};

exports.update = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    allowedUpdates = ["name", "email"];
    const isValidOperation = updates.every(update =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send("Wrong update input(s)");
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json({
      status: "success",
      user
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      error
    });
  }
};

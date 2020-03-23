const mongoose = require("mongoose");
const validator = require("validator");

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  cuisine: {
    type: String,
    required: true,
    enum: [
      "african",
      "asian",
      "south-american",
      "european",
      "american",
      "indian",
      "chinese",
      "japanese"
    ]
  },
  description: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 10,
    maxlength: 255
  },
  ingredients: {
    type: [String],
    required: [true, "Ingredients are needed for a recipe"],
    trim: true
  },
  steps: {
    type: String,
    minlength: 50
  },
  duration: {
    type: Number
  },
  difficulty: {
    type: String,
    required: [true, "The level of difficulty is required"],
    enum: ["easy", "medium", "difficult"],
    lowercase: true
  }
},{
  timestamps:true
});

const Recipe = new mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;

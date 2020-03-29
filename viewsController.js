const Recipe = require("./recipeModel");

exports.getOverview = async (req, res) => {
  const recipes = await Recipe.find({});

  res.status(200).render("overview", {
    title: "All recipes",
    recipes
  });
};

exports.getRecipe = async (req, res) => {
  const recipe = await Recipe.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user"
  });

  if (!tour) {
    return next(new AppError("There is no tour with that name.", 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render("recipe", {
    title: `${recipe.name} Recipe`,
    tour
  });
};

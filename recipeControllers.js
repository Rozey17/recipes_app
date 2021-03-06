const Recipe = require("./recipeModel");

exports.createRecipe = async (req, res) => {
  try {
    //   const newRecipe = new Recipe({
    //     name: req.body.name,
    //     description: req.body.description,
    //     duration: req.body.duration,
    //     difficulty: req.body.difficulty,
    //     ingredients: req.body.ingredients,
    //     cuisine: req.body.cuisine,
    //     steps: req.body.steps
    //   });
    // await newRecipe.save()

    const newRecipe = await Recipe.create({
      name: req.body.name,
      description: req.body.description,
      duration: req.body.duration,
      difficulty: req.body.difficulty,
      ingredients: req.body.ingredients,
      cuisine: req.body.cuisine,
      steps: req.body.steps,
      owner: req.user._id, // très IMPORTANT
    });

    //   .then(result => {
    //     console.log(result);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

    res.status(201).json({
      status: "success",
      recipe: { newRecipe },
    });
  } catch (error) {
    res.status(401).json({
      result: "fail",
      data: { error },
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["sort", "page", "limit", "fields"];
    excludedFields.forEach((x) => delete queryObj[x]);
    let query;
    query = Recipe.find(queryObj);
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    recipes = await query;

    if (!recipes) {
      return res.status(404).send("Element not found");
    }
    res.status(200).json({
      status: "success",
      result: recipes.length,
      recipes: { recipes },
    });
  } catch (error) {
    res.status(401).json({
      result: "fail",
      error: { error: error.message },
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const recipe = await Recipe.findById(id).populate("owner");
    if (!recipe) {
      return res.status(404).send(`not found`);
    }
    res.status(200).json({
      status: "success",
      result: recipe.length,
      recipe: { recipe },
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.update = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    allowedUpdates = [
      "name",
      "description",
      "cuisine",
      "duration",
      "difficulty",
      "ingredients",
      "steps",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send("Wrong update input(s)");
    }
    const id = req.params.id;
    const recipe = await Recipe.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!recipe) {
      return res.status(404).send(`Element not found`);
    }
    res.status(200).json({
      status: "success",
      recipe: recipe,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

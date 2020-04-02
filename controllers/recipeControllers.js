const Recipe = require("../models/recipeModel");

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
      owner: req.user._id // important
    });
    //   .then(result => {
    //     console.log(result);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

    res.status(201).json({
      status: "success",
      recipe: { newRecipe }
    });
  } catch (error) {
    res.status(401).json({
      result: "fail",
      data: { error }
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["limit", "sort", "page", "fields"]; // on se limite qu'aux propriétés de chaque recette
    excludedFields.forEach(el => delete queryObj[el]); // parce que eux ils demandent tous les élements donc ça va pas ensemble avec queryObj qui rend un élément
    let query = Recipe.find(queryObj); // bien préciser le 'let' (souvent suivi d'un 'if')
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    }
    const recipes = await query;
    console.log(queryObj);
    if (!recipes) {
      return res.status(404).send("Element not found");
    }
    res.status(200).json({
      status: "success",
      result: recipes.length,
      recipes: { recipes }
    });
  } catch (error) {
    res.status(401).json({
      result: "fail",
      data: { error }
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).send(`not found`);
    }
    await recipe.populate("owner").execPopulate();

    res.status(200).json({
      status: "success",
      result: recipe.length,
      recipe: { recipe }
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
      "steps"
    ];
    const isValidOperation = updates.every(update =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send("Wrong update input(s)");
    }
    const id = req.params.id;
    const recipe = await Recipe.findByIdAndUpdate(id, req.body, {
      new: true, // important
      runValidators: true
    });
    if (!recipe) {
      return res.status(404).send(`Element not found`);
    }
    res.status(200).json({
      status: "success",
      recipe: recipe
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const express = require("express");
const router = require("./routes/recipeRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();
const morgan = require("morgan");
const path = require("path");
app.use(morgan("dev"));
app.use(express.json());

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "public");
const viewsPath = path.join(__dirname, "templates");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Setup handlebars engine and views location
// app.set("view engine", "hbs");
// app.set("views", viewsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("/", (req, res) => {
  res.status(200).render("base", {
    recipe: "Mafé"
  });
});

app.use("/recipes", router);
app.use("/users", userRouter);

module.exports = app;

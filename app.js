const express = require("express");
const router = require("./recipeRoutes");
const userRoutes = require('./userRoutes')
const app = express();
const morgan = require("morgan");
const path = require("path");
app.use(morgan("dev"));
app.use(express.json());

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "public");
const viewsPath = path.join(__dirname, "templates");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: `Recipes's App`,
    name: "Ferrad Rosé"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Ferrad Rosé"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "This is some helpful text."
  });
});

app.use("/recipes", router);
app.use("/users", userRoutes);

module.exports = app;

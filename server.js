const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app.js");

dotenv.config({ path: `${__dirname}/config.env` });

const DATABASE_LOCAL = process.env.DATABASE_LOCAL;

mongoose
  .connect(DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(con => {
    console.log("Connected to database");
  })
  .catch(error => {
    console.log("Failed to connect to database");
  });

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

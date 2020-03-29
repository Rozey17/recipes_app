const bcrypt = require("bcryptjs");

const password = "ferrad123";

const encryte = async function(password) {
  hashedPassword = await bcrypt.hash(password, 8);
  const isMatch = await bcrypt.compare(password, hashedPassword);

  if (isMatch) {
    return console.log("'c'est Ok");
  } else {
    return console.log("pas bon");
  }
};

encryte("paname123");

const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
  // creating a new instance of the user model
  const user = new User({
    firstName: "Dhoni",
    lastName: "M S",
    emailId: "dhonims@gmail.com",
    password: "msdhoni",
  });
  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to DB successfully");
    app.listen(7777, () => {
      console.log("server is succesfully running on port no 7777");
    });
  })
  .catch((err) => {
    console.error(err);
  });

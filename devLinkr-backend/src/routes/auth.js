const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");

const User = require("../models/user");
const { validateSignupData } = require("../utils/validation");

const authRouter = express.Router();

//signup API
authRouter.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignupData(req);

    //Encryption of password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    // creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

//login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid Email address");
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidUser = await user.validatePassword(password);
    if (!isValidUser) {
      throw new Error("Invalid credentials");
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 3600000), // 7days
    });

    res.status(200).send("Logged in successfully!!");
  } catch (err) {
    res.status(404).send("Erorr:" + err.message);
  }
});

//logout API
authRouter.post("/logout", async (req, res) => {
  try {
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .status(200)
      .send("Loggedout Successfully");
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

module.exports = authRouter;

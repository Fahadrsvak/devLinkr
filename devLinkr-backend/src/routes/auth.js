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
    if (!validateSignupData(req, res).success) return;

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
    res.status(201).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log("Error in signup controller:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

//login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ emailId }).select("+password");

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 3600000), // 7days
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log("Error in login controller", err);
    res.status(500).json({
      sucess: false,
      message: "Server error",
    });
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
      .json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.log("Error in logout controller", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = authRouter;

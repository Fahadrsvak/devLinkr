const express = require("express");

const profileRouter = express.Router();

const { userAuth } = require("./middlewares/auth");

//profile API
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).send("profile data :" + user);
  } catch (err) {
    res.status(404).send("Error: " + err.message);
  }
});

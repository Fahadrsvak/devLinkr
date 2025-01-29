const express = require("express");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const {
  validateProfileUpdateData,
  validateForgotPasswordData,
} = require("../utils/validation");

//profile view API
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).send("profile data :" + user);
  } catch (err) {
    res.status(404).send("Error: " + err.message);
  }
});

//profile Edit API
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateProfileUpdateData(req);
    const user = req.user;
    const userUpdates = req.body;
    Object.keys(userUpdates).forEach((k) => {
      user[k] = userUpdates[k];
    });
    await user.save();
    res.status(200).json({
      message: `${user.firstName}, Your Profile Updated Successfully`,
      data: user,
    });
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

// Forgot Password API
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    validateForgotPasswordData(req);

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    user.password = newPasswordHash;
    await user.save();

    res.status(200).json({
      message: `${user.firstName}, Your Password Updated Successfully`,
      data: user,
    });
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

module.exports = profileRouter;

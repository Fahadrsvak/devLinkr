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

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: "Profile data not found" });
  }
});

//profile Edit API
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileUpdateData(req, res).success) return;
    const user = req.user;
    const userUpdates = req.body;
    Object.keys(userUpdates).forEach((k) => {
      user[k] = userUpdates[k];
    });
    await user.save();
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log("Error in updateProfile : ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Forgot Password API
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    if (!validateForgotPasswordData(req, res).success) return;

    const isValidPassword = await user.validatePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Enter correct current password",
      });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    user.password = newPasswordHash;
    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log("Error in forgotPassword :", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = profileRouter;

const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 3, maxLength: 50 },
    lastName: { type: String, maxLength: 50 },
    emailId: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("ERROR: Invalid Email address " + value);
        }
      },
    },
    password: {
      type: String,
      requied: true,
      validate(value) {
        if (!validator.isStrongPassword(value, { minLength: 7 })) {
          throw new Error("ERROR: Enter a strong Password:" + value);
        }
      },
    },
    age: { type: Number, min: 10 },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://avatars.githubusercontent.com/u/7790161?v=4",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL " + value);
        }
      },
    },
    about: { type: String, default: "This is defatult value ", maxLength: 100 },
    skills: { type: [String] },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DevLinkr@123", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (PasswordInputByUser) {
  const passwordHash = this.password;

  const isPasswordValid = await bcrypt.compare(
    PasswordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

const User = mongoose.model("user", userSchema);
module.exports = User;

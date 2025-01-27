const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 3, maxLength: 20 },
    lastName: { type: String, maxLength: 20 },
    emailId: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
    },
    password: { type: String, requied: true, minLength: 6, maxLength: 20 },
    age: { type: Number, min: 10 },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photUrl: {
      type: String,
      default: "https://avatars.githubusercontent.com/u/7790161?v=4",
    },
    about: { type: String, default: "This is defatult value ", maxLength: 100 },
    skills: { type: [String] },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;

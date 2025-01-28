const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

//signup API
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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

//profile API
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).send("profile data :" + user);
  } catch (err) {
    res.status(404).send("Error: " + err.message);
  }
});

//sendConnectionReq APi
app.post("/sendConnectionReq", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.status(200).send(`${user.firstName} send a connection req`);
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

// Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.findOne({ emailId: userEmail });
    if (!users) {
      res.status(404).send("No User found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Feed API - GET/feed : get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      res.status(404).send("No registered users available");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//User by id :
app.get("/userById", async (req, res) => {
  const userId = req.body._id;
  try {
    console.log(userId);
    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      res.status(404).send("No user found ");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// deleteUser API
app.delete("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//update user data API
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  const ALLOWED_UPDTES = ["photoUrl", "about", "gender", "age", "skills"];

  const options = { returnDocument: "after", runValidators: true };
  try {
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDTES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("update not allowed");
    }
    if (data?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate(userId, data, options);
    res.send("User Updated :" + user);
  } catch (err) {
    res.status(400).send("UPDATE FAILED : " + err.message);
  }
});

//Update user with email id
app.patch("/userByEmail/:userEmail", async (req, res) => {
  const userEmail = req.params?.userEmail;
  const data = req.body;
  const options = { returnDocument: "after", runValidators: true };

  const ALLOWED_UPDTES = ["photoUrl", "about", "gender", "age", "skills"];

  try {
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDTES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not Allowd ");
    }
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("No user found : Check email");
    } else {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          data,
          options
        );
        res.send("updated user :" + updatedUser);
      } catch (err) {
        res.status(400).send("Update Failed " + err.message);
      }
    }
  } catch (err) {
    res.status(400).send("Update Failed " + err.message);
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

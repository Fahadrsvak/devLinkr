const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

//signup API
app.post("/signup", async (req, res) => {
  // creating a new instance of the user model
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
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
app.patch("/user", async (req, res) => {
  const userId = req.body._id;
  const update = req.body;
  const options = { returnDocument: "after" };
  try {
    const user = await User.findByIdAndUpdate(userId, update, options);
    res.send("User Updated :" + user);
  } catch {
    res.status(400).send("Something went wrong");
  }
});

//Update user with email id
app.patch("/userByEmail", async (req, res) => {
  const userEmail = req.body.emailId;
  const data = req.body;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("No user found : Check email");
    } else {
      try {
        const updatedUser = await User.findByIdAndUpdate(user._id, data);
        res.send("updated user :" + updatedUser);
      } catch (err) {
        res.status(400).send("Something went wrong");
      }
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
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

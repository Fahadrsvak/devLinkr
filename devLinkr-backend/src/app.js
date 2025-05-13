const express = require("express");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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

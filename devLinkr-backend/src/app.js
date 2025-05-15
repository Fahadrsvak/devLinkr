const express = require("express");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");

const app = express();

require("dotenv").config();

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
    app.listen(process.env.PORT, () => {
      console.log(
        "server is succesfully running on port no ",
        process.env.PORT
      );
    });
  })
  .catch((err) => {
    console.error(err);
  });

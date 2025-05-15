const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log(process.env.DB_CONNECTION_SECRET);
    const conn = await mongoose.connect(process.env.DB_CONNECTION_SECRET);
    console.log(`MongoDB connected : ${conn.connection.host}`);
  } catch (err) {
    console.log("Error connecting to MongoBD: ", err);
  }
};

module.exports = connectDB;

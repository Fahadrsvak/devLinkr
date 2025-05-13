const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://Fahad:VEfFSXftqRsl80Vw@node1.hdmfa.mongodb.net/devLinkr"
    );
    console.log(`MongoDB connected : ${conn.connection.host}`);
  } catch (err) {
    console.log("Error connecting to MongoBD: ", err);
  }
};

module.exports = connectDB;

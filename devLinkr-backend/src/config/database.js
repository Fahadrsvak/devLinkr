const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Fahad:VEfFSXftqRsl80Vw@node1.hdmfa.mongodb.net/devLinkr"
  );
};

module.exports = connectDB;

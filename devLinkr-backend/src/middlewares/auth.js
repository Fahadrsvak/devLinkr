const jwt = require("jsonwebtoken");

const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not aurhorised- No token provided",
      });
    }
    const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);

    if (!decodeToken) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - Invalid token",
      });
    }

    const { _id } = decodeToken;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found : Login again",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Error in auth middleware: ", err);

    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - Invalid token",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};
module.exports = { userAuth };

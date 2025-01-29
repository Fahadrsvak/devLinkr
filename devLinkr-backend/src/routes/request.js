const express = require("express");

const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

//sendConnectionReq APi
requestRouter.post("/sendConnectionReq", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.status(200).send(`${user.firstName} send a connection req`);
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

module.exports = requestRouter;

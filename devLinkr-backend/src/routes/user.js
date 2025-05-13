const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

//Get all the pending connection requests for the logged in user

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      requestReceiverId: loggedInUser._id,
      connectionStatus: "interested",
    }).populate("requestSenderId", USER_SAFE_DATA);

    res.status(200).json({
      success: true,
      connectionRequests,
    });
  } catch (err) {
    console.log("Error in pending connection request");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//Get all the connection
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { requestReceiverId: loggedInUser._id, connectionStatus: "accepted" },
        { requestSenderId: loggedInUser._id, connectionStatus: "accepted" },
      ],
    })
      .populate("requestReceiverId", USER_SAFE_DATA)
      .populate("requestSenderId", USER_SAFE_DATA);

    const allConnections = connections.map((row) => {
      if (row.requestSenderId._id.toString() === loggedInUser._id.toString()) {
        return row.requestReceiverId;
      }
      return row.requestSenderId;
    });

    res.status(200).json({ success: true, allConnections });
  } catch (err) {
    console.log("Error in get all connections");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//Feed page APi
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    //find all the related connection requests(sent and received)
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { requestReceiverId: req.user._id },
        { requestSenderId: req.user._id },
      ],
    }).select("requestReceiverId requestSenderId");

    const hidenUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hidenUsersFromFeed.add(req.requestReceiverId.toString());
      hidenUsersFromFeed.add(req.requestSenderId.toString());
    });
    // console.log(hidenUsersFromFeed);

    const visibleFeedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hidenUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).json({ success: true, visibleFeedUsers });
  } catch (err) {
    console.log("Error in Page Feed");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = userRouter;

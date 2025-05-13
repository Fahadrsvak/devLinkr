const express = require("express");

const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
// const { validateConnectionRequestData } = require("../utils/validation");

//sendConnectionReq APi
requestRouter.post(
  "/request/send/:connectionStatus/:requestReceiverId",
  userAuth,
  async (req, res) => {
    try {
      const requestSenderId = req.user._id;
      const requestReceiverId = req.params.requestReceiverId;
      const connectionStatus = req.params.connectionStatus;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(connectionStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status type: " + connectionStatus,
        });
      }

      if (requestReceiverId === requestSenderId) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid connection request" });
      }

      const isReceiverValid = await User.findById(requestReceiverId);
      if (!isReceiverValid) {
        return res.status(404).json({
          success: false,
          message: "Invalid User , User ID :" + requestReceiverId,
        });
      }

      const isRequestExist = await ConnectionRequest.findOne({
        $or: [
          { requestSenderId, requestReceiverId },
          {
            requestSenderId: requestReceiverId,
            requestReceiverId: requestSenderId,
          },
        ],
      });
      if (isRequestExist) {
        return res.status(400).json({
          success: false,
          message: "Connection request already exist",
        });
      }

      const connectionRequest = new ConnectionRequest({
        requestSenderId,
        requestReceiverId,
        connectionStatus,
      });

      const connectionData = await connectionRequest.save();

      res.status(200).json({
        success: true,
        connectionData,
      });
    } catch (err) {
      console.log("Error in sendConnectionRequest:", err);
      res
        .status(400)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

//requestReview APi
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ success: false, message: "Status not allowed " + status });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        requestReceiverId: loggedInUser._id,
        connectionStatus: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ success: false, message: "Connection request not found" });
      }
      connectionRequest.connectionStatus = status;

      const connectionData = await connectionRequest.save();

      res.status(200).json({
        success: true,
        connectionData,
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

module.exports = requestRouter;

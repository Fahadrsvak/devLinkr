const mongoose = require("mongoose");
const User = require("./user");

const connectionRequestSchema = new mongoose.Schema(
  {
    requestSenderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User, //reference to the user collection
    },
    requestReceiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User,
    },
    connectionStatus: {
      type: String,
      required: true,
      enum: ["ignored", "interested", "accepted", "rejected"],
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ requestSenderId: 1, requestReceiverId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (
    connectionRequest.requestSenderId.equals(
      connectionRequest.requestReceiverId
    )
  ) {
    throw new Error("Cannot send connection request to yourself");
  }
  next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;

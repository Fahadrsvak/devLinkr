const validator = require("validator");

const validateSignupData = (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName || !emailId || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  } else if (firstName.length < 3 || firstName.length > 20) {
    return res.status(400).json({
      success: false,
      message: "length of firstname should be between 3-20",
    });
  } else if (!validator.isEmail(emailId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email address",
    });
  } else if (!validator.isStrongPassword(password)) {
    return res.status(400).json({
      success: false,
      message: "Enter strong password",
    });
  }
  return { success: true };
};

const validateProfileUpdateData = (req, res) => {
  const updates = req.body;
  const allowedUpdates = [
    "firstName",
    "lastName",
    "photoUrl",
    "about",
    "skills",
  ];
  const isAllowed = Object.keys(updates).every((key) =>
    allowedUpdates.includes(key)
  );
  if (!isAllowed) {
    return res.status(400).json({
      success: false,
      message: "Invalid profile update request",
    });
  }
  return { success: true };
};

const validateForgotPasswordData = (req, res) => {
  const { newPassword, currentPassword } = req.body;
  const user = req.user;

  if (!validator.isStrongPassword(newPassword)) {
    return res.status(400).json({
      success: false,
      message: "Enter strong password",
    });
  }

  return { success: true };
};

// const validateConnectionRequestData = (req) => {
//   const requestSenderId = req.user._id;
//   const requestReceiverId = req.params.requestReceiverId;
//   const connectionStatus = req.params.connectionStatus;

//   const allowedStatus = ["interested", "ignored"];
//   if (!allowedStatus.includes(connectionStatus)) {
//     return res
//       .status(400)
//       .json({ message: "Invalid status type" + connectionStatus });
//   }
//   if (requestReceiverId === requestSenderId) {
//     return res.status(400).json({ message: "Invalid connection request" });
//   }
// };

module.exports = {
  validateSignupData,
  validateProfileUpdateData,
  validateForgotPasswordData,
};

const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Invalid username");
  } else if (firstName.length < 3 || firstName.length > 50) {
    throw new Error("Length of firstname should be between 3-50");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email Address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter Strong password");
  }
};

const validateProfileUpdateData = (req) => {
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
    throw new Error("Invalid Edit Request: check again");
  }
};

const validateForgotPasswordData = (req) => {
  const { newPassword, currentPassword } = req.body;
  const user = req.user;

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("Enter Strong new password");
  }

  const isValidPassword = user.validatePassword(currentPassword);
  if (!isValidPassword) {
    throw new Error("Invalid Credential");
  }
};

module.exports = {
  validateSignupData,
  validateProfileUpdateData,
  validateForgotPasswordData,
};

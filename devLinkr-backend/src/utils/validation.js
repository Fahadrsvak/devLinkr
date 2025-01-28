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

module.exports = { validateSignupData };

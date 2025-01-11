const userAuth = (req, res, next) => {
  const token = "adfadfadf";
  const isAdminAuthorized = token === "adfadfadf";
  if (!isAdminAuthorized) {
    res.status(401).send("unauthorized request");
  } else {
    console.log("autorized");
    next();
  }
};
const adminAuth = (req, res, next) => {
  const token = "adfadfadf";
  const isAdminAuthorized = token === "adfadfadf";
  if (!isAdminAuthorized) {
    res.status(401).send("unauthorized request");
  } else {
    console.log("autorized");
    next();
  }
};

module.exports = { adminAuth, userAuth };

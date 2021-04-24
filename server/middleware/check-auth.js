const jwt = require("jsonwebtoken");

const HttpError = require("../models/https-error");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(""); // Authorization: 'Bearer(Array[0]) TOKEN(Array[1])'
    if (!token) {
      throw new Error("Authentication failed!", 401);
    }
    const decodeToken = jwt.verify(token, "supersecrete_dont____SHare");
    req.userData = {userId: decodeToken.userId}; 
    next();
  } catch {
    const error = new HttpError("AAuthentication failed!", 401);
    return next(error);
  }
};

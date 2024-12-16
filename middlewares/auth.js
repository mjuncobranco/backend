const jwt = require("jwt-simple");
const moment = require("moment");
const {secret} = require("../helpers/jwt");

//middleware to auth users to access private routes
exports.auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({
      status: "error",
      message: "Auth headers are missing, impossible to process request",
    });
  }

  const token = req.headers.authorization.replace(/['"]+/g, "");
  
  try {
    const payload = jwt.decode(token, secret);
    //verifying token expiration 
    if (payload.exp <= moment().unix()) {
      return res.status(401).json({
        status: "error",
        message: "Expired token",
        error,
      });
    }

    req.user = payload;
    
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: "Invalid token error",
      error: error.message,
    });
  }
  next();
 
};

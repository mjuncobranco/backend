const jwt = require("jwt-simple");
const moment = require("moment");

//importing secret key from jwt.js
const libjwt = require("../helpers/jwt");
const secret = libjwt.secret;

//middleware to auth users to access private routes
exports.auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({
      status: "error",
      message: "Auth headers are missing, impossible to process request",
    });
  }

  let token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    let payload = jwt.decode(token, secret);
    //comprobar expiracion del token
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
      message: "Invalid token",
      error,
    });
  }
  //if auth is successfull, access to private route is granted to user
  next();
};

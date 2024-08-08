const User = require("../models/User");
const { validateData } = require("../helpers/validateData");
const bcrypt = require("bcrypt");
const jwt = require("../helpers/jwt");

//Register user
const register = async (req, res) => {
  //checking for empty required inputs
  let params = req.body;
  if (
    !params.name ||
    !params.surname ||
    !params.email ||
    !params.password ||
    !params.nick
  ) {
    return res.status(400).json({
      status: "error",
      message: "Missing data",
    });
  }

  //Checking for existing user by email o nick
  try {
    let userFound = await User.find({
      $or: [
        { email: params.email.toLowerCase() },
        { nick: params.nick.toLowerCase() },
      ],
    }).exec();
    if (userFound.length > 0) {
      return res.status(200).send({
        status: "success",
        message: "Existing user",
      });
    }

    //validate name,nick,email & password
    try {
      validateData(params);
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: "Invalid data. Please review your input.",
      });
    }
    //encrypting the password with bcrypt before saving user
    let pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;
    //Save new user in db

    const user = new User(params);
    try {
      const userSaved = await user.save();
      if (!userSaved) {
        return res.status(500).json({
          status: "error",
          message: "Unable to register user",
        });
      }
      return res.status(201).json({
        status: "success",
        message: "The new user has been registered.",
        user: userSaved,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Error: Unable to register new user. Please try again.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Unable to register new user",
    });
  }
};

//Login user
const login = async (req, res) => {
  //get req.body data
let params = req.body;
//email|pass empty = missing data
if(!params.email || !params.password){
  return res.status(400).send({
    status: "error",
    message: "missing data"
  })
}
//search user by email on db
try {
let user= await User.findOne({email: params.email})
.exec();

if(!user){
  return res.status(400).send({
    status: "error",
    message: "No user found"
  })
}

//try to match password entered with pass in db with bcrypt compareSync:
let pwd= bcrypt.compareSync(params.password, user.password);
//si el password es incorrecto lanzar error
if(!pwd){
  return res.status(400).send({
    status: "error",
    message: "Unable to login, please try again."
  })
}
//Get token
const token = jwt.createToken(user);

//if pass is correct, login user and show user data
return res.status(200).json({
  status: "success",
  message: "You've been authenticated successfully!",
  token,
  user:{
    id: user._id,
    name: user.name,
    nick: user.nick,
    role: user.role,
    
  }

})
} catch (error) {
 return res.status(500).send({
    status: "error",
    message: "Login has failed"
  })
}
}
module.exports = { register, login };

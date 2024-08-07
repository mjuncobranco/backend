const mongoose = require("mongoose");
const User = require("../models/User");
const { validateData } = require("../helpers/validateData");
const bcrypt = require("bcrypt");

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
    //cifrar password con convirtiendola en hash con bcrypt
    let pwd = await bcrypt.hash(params.password, 10);
    //guardo en password hasheado(pwd) directamente en password
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

module.exports = { register };

const User = require("../models/User");
const { validateData } = require("../helpers/validateData");
//importing fs and path for img
const path = require("path");
const fs = require("fs");
//needed for token 
const bcrypt = require("bcrypt");
const jwt = require("../helpers/jwt");

//Register user
// Register user
const register = async (req, res) => {
  // Checking for empty required inputs
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
  
  try {
    params.email = params.email.trim().toLowerCase();
    // Check if the email already exists
    let emailExists = await User.findOne({ email: params.email.toLowerCase() }).exec();
    if (emailExists) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }

    // Check if the nick already exists
    params.nick = params.nick.trim().toLowerCase();

    let nickExists = await User.findOne({ nick: params.nick.toLowerCase() }).exec();
    if (nickExists) {
      return res.status(400).json({
        status: "error",
        message: "Nick already exists",
      });
    }

    // Validate name, nick, email & password
    try {
      validateData(params);
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }

    // Encrypt the password with bcrypt before saving user
    let pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;

    // Save new user in DB
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
  if (!params.email || !params.password) {
    return res.status(400).send({
      status: "error",
      message: "missing data",
    });
  }
  //search user by email on db
  try {
    let user = await User.findOne({ email: params.email }).exec();

    if (!user) {
      return res.status(400).send({
        status: "error",
        message: "No user found",//failed to find user by Id
      });
    }

    //try to match password entered with pass in db with bcrypt compareSync:
    let pwd = bcrypt.compareSync(params.password, user.password);
    //error on incorrect password
    if (!pwd) {
      return res.status(400).send({
        status: "error",
        message: "Unable to login, please try again.",
      });
    }
    //Get token
    const token = jwt.createToken(user);

    //if pass is correct, login user and show user data
    return res.status(200).json({
      status: "success",
      message: "You've been authenticated successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        nick: user.nick,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Login has failed",
    });
  }
};

//Private access: Authorized users Only

// Add a movie to user's favoriteMovies

const addFavoriteMovie = async (req, res) => {
  try {
    const userId = req.user.id; // getting user's id from token
    const  movieId  = req.params.id; 
    
    // checking for invalid or empty movieId
    if (!movieId || movieId.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Invalid movie ID.",
      });
    }
    // checking if user exists by user's id
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }
    // checking if movieId is on user's favoriteMovies list
    
    if (user.favoriteMovies.includes(movieId)) {
      return res.status(400).json({
        status: "error",
        message: "Movie is already in your favorites.",
      });
    }

    // Add movieId to user's favorites
    user.favoriteMovies.push(movieId);
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Movie added to favorites successfully!",
      favoriteMovies: user.favoriteMovies,
    });
    //failed to add movie to favorites error 
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      status: "error",
      message: "Server error.",
    });
  }
};
    // checking if movieId is on user's favoriteMovies list
  const removeFavoriteMovie = async (req, res) => {
  const userId = req.user.id;
  const  movieId  = req.params.id;

  try {
    //checking for invalid or empty movieId
    if (!movieId || movieId.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Invalid movie ID.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",//failed to find user by id on db
      });
    }

    // checking if movieId is on user's favoriteMovies list
    if (!user.favoriteMovies.includes(movieId)) {
      return res.status(400).json({
        status: "error",
        message: "Movie not found in favorites.",
      });
    }

    // checking if movieId is on user's favoriteMovies list
    user.favoriteMovies = user.favoriteMovies.filter(
      (id) => id.toString() !== movieId.toString()
    );

    await user.save();
//movieId successfully deleted from favorites
    return res.status(200).json({
      status: "success",
      message: "Movie removed from favorites",
      favoriteMovies: user.favoriteMovies,
    });
    //failed to delete movie from favorites
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Server error: Unable to remove movie from favorites",
    });
  }
};
//get user's favorite Movies
const getFavoriteMovies = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favoriteMovies");
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",//failed to find user by id on db
      });
    }

    // on empty favorite movie list show msg
    if (user.favoriteMovies.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "Empty favoriteMovie list. Add one?",
        favoriteMovies: [],
      });
    }
//successfully found favorite movies
    return res.status(200).json({
      status: "success",
      favoriteMovies: user.favoriteMovies,
    });
    //failed to find favorite movies
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      status: "error",
      message: "Server error: Unable to retrieve favorite movies.",
    });
  }
};


//get user's data:

const getUserData = async (req, res) => {
  const userId = req.user.id; // getting user's id from token

  try {
    // find user by user id on db
    const user = await User.findById(userId);

    // checking if user exists
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",//failed to find user by id on db
      });
    }

    // successfully found user's data
    return res.status(200).json({
      status: "success",
      user: user,
    });
    //failed to find user's data
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

//update user's settings

// updating user's personal data

const updateUserSettings = async (req, res) => {
  const userId = req.user.id; // getting user's id from token
  const params = req.body; 

  // checking request field is not empty
  if (!params || Object.keys(params).length === 0) {
    return res.status(400).json({
      status: "error",
      message: "No data provided for updating user settings.",
    });
  }

  // filtering field allowed to be updated
  const allowedFields = ["name", "surname", "nick", "email", "password"];
  const updates = {};
  for (const field of allowedFields) {
    if (params[field]) {
      updates[field] = params[field];
    }
  }

  // checking at least one field is being updated
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      status: "error",
      message: "No valid fields provided for updating user settings.",
    });
  }

  try {
    // validate and trim inputs
    if (updates.name) {
      updates.name = updates.name.trim();
      validateData(updates, "name");
    }

    if (updates.surname) {
      updates.surname = updates.surname.trim();
      validateData(updates, "surname");
    }

    if (updates.nick) {
      updates.nick = updates.nick.trim().toLowerCase();
      validateData(updates, "nick");
      //checking if existing nick, nick must be unique
      const nickExists = await User.findOne({ nick: updates.nick, _id: { $ne: userId } });
      if (nickExists) {
        return res.status(409).json({
          status: "error",
          message: "Existing nick. Please enter a new nick.",
        });
      }
    }

    if (updates.email) {
      updates.email = updates.email.trim().toLowerCase();
      validateData(updates, "email");
      // checking if existing email, email must be unique
      const emailExists = await User.findOne({ email: updates.email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(409).json({
          status: "error",
          message: "Existing email. Please enter a new email.",
        });
      }
    }

    if (updates.password) {
      validateData(updates, "password");
      // encrypting password before saving
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // updating user's data 
    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true, // showing updated data
      runValidators: true, // running data validator
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",//failed to find user
      });
    }
//successfully updated data
    return res.status(200).json({
      status: "success",
      message: "User has been updated.",
      user: user,
    });
    //failed to update user's data
  } catch (error) {
    console.error("Error updating user settings:", error.message);
    return res.status(400).json({
      status: "error",
      message: error.message || "Unable to update user settings.",
    });
  }
};


//change user's avatar
const changeAvatar = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",//failed to find user
      });
    }
    // delete old avatar
    if (user.avatar && user.avatar !== "default.png") {
      const oldAvatarPath = path.join(
        __dirname,
        "..",
        "public",
        "avatars",
        user.avatar
      );
      fs.unlink(oldAvatarPath, (err) => {
        if (err) console.error("Error deleting old avatar:", err);//failed to delete avatar
      });
    }

    // Assign new avatar to user and save in db
    user.avatar = req.file.filename;
    user.save().then((user) => console.log(user)).catch((error) => {
      console.log(error);
    });
//updated new avatar successfully
    return res.status(200).json({
      status: "success",
      message: "Avatar updated successfully",
      avatar: user.avatar,
    });
    //failed to update, error msg
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Server Error",
    });
  }
};
//deleting user: FOR ADMIN ONLY
const deleteUser = async (req, res) => {
  try {
    // Admin action only
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: "error",
        message: "Access denied: You do not have permission to delete a user.",
      });
    }

    const userId = req.body.userId; // getting id from req.body

    // checkin if user's id is provided
    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required.",
      });
    }

    // find user by id and delete
    const user = await User.findByIdAndDelete(userId);

    if (user) {
      return res.status(200).json({
        status: "success",
        message: "User deleted!",//user deleted successfully
        user,
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "User not found.",//failed to find user
      });
    }
  } catch (error) {
    console.error(error.message); //showcasing error on console
    return res.status(500).json({
      status: "error",
      message: "Unable to process request.",
    });
  }
};

// getting all users
const getUsers = async (req, res) => {
  //Admin action only
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Admins only.",
      });
    }
//found users's data successfully
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: users });
    //failed to find users' data
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  getFavoriteMovies,
  getUserData,
  updateUserSettings,
  addFavoriteMovie,
  removeFavoriteMovie,
  changeAvatar,
  deleteUser,
  getUsers
};

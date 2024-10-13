const express = require("express");
const UserController = require("../controllers/user");
const router = express.Router();
const check = require("../middlewares/auth");


//register new user
router.post("/register", UserController.register);
//login new user & get token
router.post("/login", UserController.login);
//private route, access favorites with login
router.get("/auth/favorites",check.auth, UserController.getFavoriteMovies);
//add a favorite Movie to user

router.post("/auth/favorites", check.auth, UserController.addFavoriteMovie);

// Remove movie from favorites
router.delete("/auth/favorites", check.auth, UserController.removeFavoriteMovie);

//SETTINGS
//get Userdata
router.get("/auth/settings",check.auth, UserController.getUserData);
//update user's data settings:
router.patch("/auth/settings",check.auth, UserController.updateUserSettings);




module.exports = router;
const express = require("express");
const MovieController = require("../controllers/movies");
const router = express.Router();
const check = require("../middlewares/auth");

//get all movies
router.get("/home/movies", MovieController.getAllMovies);
//get movie details for a specific movie
router.get("/home/movies/:id", MovieController.getMovieDetails);
//add a movie
router.post("/home/movies/add_new_movie", check.auth, MovieController.addMovie);

//update a movie
router.patch("/home/movies/update_movie", check.auth, MovieController.updateMovieData);
//delete a movie
router.delete("/home/movies/remove_movie", check.auth, MovieController.deleteMovie);

module.exports = router;

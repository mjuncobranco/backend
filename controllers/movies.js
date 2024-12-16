const Movie = require("../models/Movie");
// /home/movies to get all movies
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json({ status: "success", movies: movies }); //movies fetched successfully
    if (!movies) {
      return res
        .status(400)
        .json({ status: "error", message: "Error: Unable to find movies." }); //failed to fetch movies sending error message
    }
  } catch (error) {
    //catching error message for request
    res.status(500).json({
      status: "error",
      message: "Server Error: Unable to find movies.",
    });
  }
};

//get movie detail  by id for movieDetails
const getMovieDetails = async (req, res) => {
  const movieId = req.params.id;

  try {
    // find movie by movieId
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res
        .status(404)
        .json({ status: "error", message: "Movie not found." });
    }

    // Sending movie data successfully
    return res.status(200).json({
      status: "success",
      movie: movie,
    });
  } catch (error) {
    console.error(error.message); //showcasing error on console
    return res.status(500).json({
      status: "error",
      message: "Server error: Unable to process request.",
    });
  }
};

//ADMIN ONLY:
// ADD a new movie
const addMovie = async (req, res) => {
  try {
    // getting authenticated user's role
    const userRole = req.user.role;

    //  Only admin role has permission to execute action
    if (userRole !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Access denied: Only admin have permission to add new movie.",
      });
    }

    //data sent on req.body
    let {
      title,
      director,
      description,
      year,
      actors,
      category,
      rating,
      trailer,
      image,
    } = req.body;
    //trimming inputs
    title = title.trim();
    director = director.trim();
    description = description.trim();
    year = year.trim();
    actors = actors.trim();
    category = category.trim();
    if (trailer) trailer = trailer.trim();
    if (image) image.trim();

    // checking if all required fields on movie model are sent
    if (
      !title ||
      !director ||
      !description ||
      !year ||
      !actors ||
      !category ||
      !rating
    ) {
      return res.status(400).json({
        status: "error",
        message: "Missing data",
      });
    }

    // Creating a new instance based on movie Model
    const movie = new Movie({
      title,
      director,
      description,
      year,
      actors,
      category,
      rating,
      trailer,
      image,
    });

    // trying to save new movie
    const movieSaved = await movie.save();
    //if saving action has failed, show error
    if (!movieSaved) {
      return res.status(500).json({
        status: "error",
        message: "Error: unable to save movie",
      });
    }

    // saving new movie on db successfully
    return res.status(201).json({
      status: "success",
      message: "The new movie has been added.",
      movie: movieSaved,
    });
  } catch (error) {
    // handling error msg
    return res.status(500).json({
      status: "error",
      message: "Error: Unable to save the new movie. Please try again.",
    });
  }
};

//update movie data
const updateMovieData = async (req, res) => {
  try {
    //  Only admin role has permission to execute action
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Access denied: You do not have permission to update a movie.",
      });
    }

    const movieId = req.body.movieId; //  movieId sent on req.body
    let updatedData = req.body; //  updated data on req.body

    // checking if movieId is provided
    if (!movieId) {
      return res.status(400).json({
        status: "error",
        message: "Movie ID is required.",
      });
    }
    // trimming inputs entered before updating
    updatedData = {
      ...updatedData,
      title: updatedData.title ? updatedData.title.trim() : updatedData.title,
      director: updatedData.director
        ? updatedData.director.trim()
        : updatedData.director,
      description: updatedData.description
        ? updatedData.description.trim()
        : updatedData.description,
      year: updatedData.year ? updatedData.year.trim() : updatedData.year,
      actors: updatedData.actors
        ? updatedData.actors.trim()
        : updatedData.actors,
      category: updatedData.category
        ? updatedData.category.trim()
        : updatedData.category,
      trailer: updatedData.trailer
        ? updatedData.trailer.trim()
        : updatedData.trailer,
      image: updatedData.image ? updatedData.image.trim() : updatedData.image,
    };

    // find by movieId and update movie's data on db
    const movie = await Movie.findByIdAndUpdate(movieId, updatedData, {
      new: true,
    });

    if (!movie) {
      return res.status(404).json({
        status: "error",
        message: "Movie not found.",
      });
    }
    //update's successfull
    return res.status(200).json({
      status: "success",
      message: "Movie updated successfully!",
      movie,
    });
  } catch (error) {
    console.error(error.message); // showcasing error on console
    return res.status(500).json({
      status: "error",
      message: "Unable to process request.",
    });
  }
};

//delete a movie by id
const deleteMovie = async (req, res) => {
  try {
    //  Only admin role has permission to execute action
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Access denied: You do not have permission to delete a movie.",
      });
    }

    const movieId = req.body.movieId; // getting movieId from req.body

    // checking if movieId is provided
    if (!movieId) {
      return res.status(400).json({
        status: "error",
        message: "Movie ID is required.",
      });
    }

    //deleting movie by ID
    const movie = await Movie.findByIdAndDelete(movieId);

    if (movie) {
      return res.status(200).json({
        status: "success",
        message: "Movie deleted!",
        movie,
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Movie not found.",
      });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      status: "error",
      message: "Unable to process request.",
    });
  }
};

module.exports = {
  getAllMovies,
  getMovieDetails,
  addMovie,
  updateMovieData,
  deleteMovie,
};

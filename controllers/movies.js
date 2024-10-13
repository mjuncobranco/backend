const Movie = require("../models/Movie");
///home/movies to get all movies
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json({ status: "success", movies: movies });
    if (!movies) {
      return res
        .status(400)
        .json({ status: "error", message: "Error: Unable to find movies." });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Server Error: Unable to find movies.",
      });
  }
};




  
//get movie detail  by id
const getMovieDetails = async (req, res) => {
  const movieId = req.body.movieId; // Obtenemos el ID de la película desde el cuerpo de la solicitud

  try {
    // Buscar la película por ID
    const movie = await Movie.findById(movieId);
    
    if (!movie) {
      return res.status(404).json({ status: "error", message: "Movie not found." });
    }
    
    // Enviar los detalles de la película
    return res.status(200).json({
      status: "success",
      movie: movie,
    });
  } catch (error) {
    console.error(error.message); // Registro del error en la consola
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
    // Obtener el rol del usuario autenticado
    const userRole = req.user.role;

    // Verificar si el rol es "admin"
    if (userRole !== 'admin') {
      return res.status(403).json({
        status: "error",
        message: "Access denied: Only admin have permission to add new mo",
      });
    }

    // Obtener los datos de la nueva película del cuerpo de la solicitud
    const newMovie = req.body;

    // Verificar que todos los campos obligatorios estén presentes
    if (
      !newMovie.title ||
      !newMovie.director ||
      !newMovie.description ||
      !newMovie.year ||
      !newMovie.actors ||
      !newMovie.category ||
      !newMovie.rating
    ) {
      return res.status(400).json({
        status: "error",
        message: "Missing data",
      });
    }

    // Crear una nueva instancia de la película
    const movie = new Movie(newMovie);

    // Intentar guardar la nueva película en la base de datos
    const movieSaved = await movie.save();
    if (!movieSaved) {
      return res.status(500).json({
        status: "error",
        message: "Error: unable to save movie",
      });
    }

    // Si la película se guarda correctamente, devolver una respuesta exitosa
    return res.status(201).json({
      status: "success",
      message: "The new movie has been added.",
      movie: movieSaved,
    });

  } catch (error) {
    // Manejo de errores
    return res.status(500).json({
      status: "error",
      message: "Error: Unable to save the new movie. Please try again.",
    });
  }
};

//update movie data
const updateMovieData = async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: "error",
        message: "Access denied: You do not have permission to update a movie.",
      });
    }

    const movieId = req.body.movieId; // Obtener el ID de la película desde el cuerpo de la solicitud
    const updatedData = req.body; // Obtener los datos actualizados

    // Verificar si se proporcionó el ID de la película
    if (!movieId) {
      return res.status(400).json({
        status: "error",
        message: "Movie ID is required.",
      });
    }

    // Intentar encontrar y actualizar la película por ID
    const movie = await Movie.findByIdAndUpdate(movieId, updatedData, { new: true });

    if (!movie) {
      return res.status(404).json({
        status: "error",
        message: "Movie not found.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Movie updated successfully!",
      movie,
    });

  } catch (error) {
    console.error(error.message); // Registrar el error en la consola
    return res.status(500).json({
      status: "error",
      message: "Unable to process request.",
    });
  }
};

//delete a movie by id
const deleteMovie = async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: "error",
        message: "Access denied: You do not have permission to delete a movie.",
      });
    }

    const movieId = req.body.movieId; // Obtener el ID de la película desde el cuerpo de la solicitud

    // Verificar si se proporcionó el ID de la película
    if (!movieId) {
      return res.status(400).json({
        status: "error",
        message: "Movie ID is required.",
      });
    }

    // Intentar eliminar la película por ID
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
    console.error(error.message); // Registrar el error en la consola
    return res.status(500).json({
      status: "error",
      message: "Unable to process request.",
    });
  }
};

  

module.exports = { getAllMovies,getMovieDetails, addMovie,updateMovieData, deleteMovie };

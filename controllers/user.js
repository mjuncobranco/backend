const User = require("../models/User");
const { validateData } = require("../helpers/validateData");
//importing fs and path
const path = require("path");
const fs = require("fs");
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
    // Check if the email already exists
    let emailExists = await User.findOne({ email: params.email.toLowerCase() }).exec();
    if (emailExists) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }

    // Check if the nick already exists
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
        message: "Invalid data. Your password must be 8-15 characters in length and include: at least one uppercase letter, one number and one special character.",
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
        message: "No user found",
      });
    }

    //try to match password entered with pass in db with bcrypt compareSync:
    let pwd = bcrypt.compareSync(params.password, user.password);
    //si el password es incorrecto lanzar error
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

// Agregar una película a favoritos

const addFavoriteMovie = async (req, res) => {
  try {
    const userId = req.user.id; // Obteniendo el ID del usuario desde el token
    const { movieId } = req.body; // Obteniendo el ID de la película desde el cuerpo de la solicitud
    // Verificar que movieId no esté vacío o inválido
    if (!movieId || movieId.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Invalid movie ID.",
      });
    }
    // Verificar si la película ya está en la lista de favoritos
    const user = await User.findById(userId);
    if (user.favoriteMovies.includes(movieId)) {
      return res.status(400).json({
        status: "error",
        message: "Movie is already in your favorites.",
      });
    }

    // Agregar la película a la lista de favoritos
    user.favoriteMovies.push(movieId);
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Movie added to favorites successfully!",
      favoriteMovies: user.favoriteMovies,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      status: "error",
      message: "Server error.",
    });
  }
};
// Eliminar una película de favoritos
const removeFavoriteMovie = async (req, res) => {
  const userId = req.user.id;
  const { movieId } = req.body;

  try {
    // Verificar que movieId no esté vacío o inválido
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
        message: "User not found",
      });
    }

    // Verificar si movieId está en la lista de favoritos
    if (!user.favoriteMovies.includes(movieId)) {
      return res.status(400).json({
        status: "error",
        message: "Movie not found in favorites.",
      });
    }

    // Eliminar la película de la lista de favoritos
    user.favoriteMovies = user.favoriteMovies.filter(
      (id) => id.toString() !== movieId.toString()
    );

    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Movie removed from favorites",
      favoriteMovies: user.favoriteMovies,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Server error: Unable to remove movie from favorites",
    });
  }
};
//get user's Favorite movies
const getFavoriteMovies = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favoriteMovies");
    // Empty favoriteMovie list error
    if (user.favoriteMovies.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "Empty favoriteMovie list. Add one?.",
      });
    }
    res
      .status(200)
      .json({ status: "success", favoriteMovies: user.favoriteMovies });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//get user's data:

const getUserData = async (req, res) => {
  const userId = req.user.id; // Obtenemos el ID del usuario desde el token de autenticación

  try {
    // Buscar al usuario por su ID en la base de datos
    const user = await User.findById(userId);

    // Verificar si el usuario existe
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Si el usuario existe, responder con sus datos
    return res.status(200).json({
      status: "success",
      user: user,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

//update user's settings

// Actualizar configuraciones del usuario

const updateUserSettings = async (req, res) => {
  const userId = req.user.id; // Obtenemos el ID del usuario autenticado
  const params = req.body; // Obtenemos los parámetros de la solicitud

  try {
    // Limpiar espacios adicionales en los campos de email y nick
    if (params.email) params.email = params.email.trim();
    if (params.nick) params.nick = params.nick.trim();
    //verificar si el email esta siendo actualizado
    if (params.email) {
      const emailExists = await User.findOne({
        email: params.email.toLowerCase(),
        _id: { $ne: userId },
      });
      if (emailExists) {
        return res.status(409).json({
          status: "error",
          message: "Existing email. Please enter a new email.",
        });
      }
    }
    // Verificar si el nick está siendo actualizado
    if (params.nick) {
      // Buscar si el nick ya existe en la base de datos para otro usuario
      const nickExists = await User.findOne({
        nick: params.nick.toLowerCase(),
        _id: { $ne: userId }, // Excluir el ID del usuario actual
      });

      if (nickExists) {
        return res.status(409).json({
          status: "error",
          message: "Existing nick. Please enter a new nick.",
        });
      }
    }

    // Validar los datos ingresados
    try {
      validateData(params);
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message:
          "Unable to update data. Please review your input and enter valid data.",
      });
    }

    // Encriptar la contraseña solo si está siendo actualizada
    if (params.password) {
      params.password = await bcrypt.hash(params.password, 10);
    }

    // Actualizar usuario en la base de datos
    const user = await User.findByIdAndUpdate(userId, params, { new: true });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User has been updated.",
      user: user,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      status: "error",
      message: "Server error.",
    });
  }
};

//change avatar
const changeAvatar = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
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
        if (err) console.error("Error deleting old avatar:", err);
      });
    }

    // Assign new avatar to user and save in db
    user.avatar = req.file.filename;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Avatar updated successfully",
      avatar: user.avatar,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Server Error",
    });
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
};

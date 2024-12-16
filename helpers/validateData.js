const validator = require("validator");
const validateData = (params, field = null) => {
  // Validar un campo específico si se pasa como argumento
  if (field) {
    if (field === "name" && params.name) {
      if (!validator.isLength(params.name, { min: 2, max: 50 }) || !validator.isAlpha(params.name)) {
        throw new Error("Invalid name: it should be between 2-50 characters and contain only letters.");
      }
    }

    if (field === "surname" && params.surname) {
      if (!validator.isLength(params.surname, { min: 2, max: 50 }) || !validator.isAlpha(params.surname)) {
        throw new Error("Invalid surname: it should be between 2-50 characters and contain only letters.");
      }
    }

    if (field === "nick" && params.nick) {
      if (!validator.isLength(params.nick, { min: 3, max: 10 }) || !validator.matches(params.nick, /^[a-zA-Z0-9]+$/)) {
        throw new Error("Invalid nick: it should be between 3-10 characters and contain only letters and numbers.");
      }
    }

    if (field === "email" && params.email) {
      if (!validator.isEmail(params.email)) {
        throw new Error("Invalid email format.");
      }
    }

    if (field === "password" && params.password) {
      if (
        !validator.isLength(params.password, { min: 8, max: 15 }) ||
        !/[A-Z]/.test(params.password) ||
        !/\d/.test(params.password) ||
        !/[!@#$%^&*]/.test(params.password) ||
        !validator.isAscii(params.password)
      ) {
        throw new Error(
          "Invalid password: it must be 8-15 characters long, include an uppercase letter, a number, and a special character (!@#$%^&*)."
        );
      }
    }
    return; // No errores para el campo específico
  }

  // Validar todos los campos (por si no se pasa un campo específico)
  if (params.name) validateData(params, "name");
  if (params.surname) validateData(params, "surname");
  if (params.nick) validateData(params, "nick");
  if (params.email) validateData(params, "email");
  if (params.password) validateData(params, "password");
};

module.exports = {
  validateData,
  };
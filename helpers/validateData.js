// const validator = require("validator");

// const validateData = (params) => {
//   let validate_name = validator.isLength(params.name, { min: 3, max: 50 }) && validator.isAlpha(params.name);
//   let validate_surname = validator.isLength(params.surname, {
//     min: 4,
//     max: 50,
//   }) && validator.isAlpha(params.surname);
//   let validate_nick = validator.isLength(params.nick, { min: 3, max: 10 });
//   let validate_password = validator.isLength(params.password, {
//     min: 8,
//     max: 15,
//   }) && validator.isAscii(params.password);

//   let validate_email = validator.isEmail(params.email);

//   if (!validate_name || !validate_surname || !validate_nick || !validate_email || !validate_password) {
//     throw new Error("Unable to validate.");
//   }
  
// };

// module.exports = {
//   validateData,
// };

const validator = require("validator");

const validateData = (params) => {
  // Validar solo los campos que están presentes en `params`
  
  // Validación del nombre (si existe)
  if (params.name) {
    if (!validator.isLength(params.name, { min: 2, max: 50 }) || !validator.isAlpha(params.name)) {
      throw new Error("Invalid name: it should be between 3-50 characters and contain only letters.");
    }
  }
 
   // Validación del apellido (si existe)
  if (params.surname) {
    if (!validator.isLength(params.surname, { min: 2, max: 50 }) || !validator.isAlpha(params.surname)) {
      throw new Error("Invalid surname: it should be between 4-50 characters and contain only letters.");
    }
  }

  // Validación del nickname (si existe)
  if (params.nick) {
    if (!validator.isLength(params.nick, { min: 3, max: 10 }) ||
    !validator.matches(params.nick, /^[a-zA-Z0-9]+$/)) {
      throw new Error("Invalid nick: it should be between 3-10 characters and contain only letters and numbers.");
    }
  }

  // Validación de la contraseña (si existe)
  if (params.password) {
    if (!validator.isLength(params.password, { min: 8, max: 15 }) || !validator.isAscii(params.password)) {
      throw new Error("Invalid password: it should be between 8-15 characters and contain only ASCII characters.");
    }
  }
  // Verificar que contiene al menos una letra mayúscula
  if (!/[A-Z]/.test(params.password)) {
    throw new Error("Invalid password: it must include at least one uppercase letter.");
  }

  // Verificar que contiene al menos un número
  if (!/\d/.test(params.password)) {
    throw new Error("Invalid password: it must include at least one number.");
  }

  // Verificar que contiene al menos un símbolo especial
  if (!/[!@#$%^&*]/.test(params.password)) {
    throw new Error("Invalid password: it must include at least one special character (!@#$%^&*).");
  }

  // Verificar que todos los caracteres son ASCII
  if (!validator.isAscii(params.password)) {
    throw new Error("Invalid password: it must only contain ASCII characters.");
  }


  // Validación del email (si existe)
  if (params.email) {
    if (!validator.isEmail(params.email)) {
      throw new Error("Invalid email format.");
    }
  };
};


module.exports = {
  validateData,
};

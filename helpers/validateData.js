const validator = require("validator");

const validateData = (params) => {
  let validate_name = validator.isLength(params.name, { min: 3, max: 50 }) && validator.isAlpha(params.name);
  let validate_surname = validator.isLength(params.surname, {
    min: 4,
    max: 50,
  }) && validator.isAlpha(params.surname);
  let validate_nick = validator.isLength(params.nick, { min: 3, max: 10 });
  let validate_password = validator.isLength(params.password, {
    min: 8,
    max: 15,
  }) && validator.isAscii(params.password);

  let validate_email = validator.isEmail(params.email);

  if (!validate_name || !validate_surname || !validate_nick || !validate_email || !validate_password) {
    throw new Error("Unable to validate.");
  }
  
};

module.exports = {
  validateData,
};

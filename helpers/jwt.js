//importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");


const secret = "CLAVE_SECRETA_DE_MOVIE_APP";

//crear funcion para generar token y exporto
const createToken = (user) => {
  const payload = {
    id: user._id,
    name: user.name,
    surname: user.surname,
    nick: user.nick,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment().unix(),
    exp: moment().add(30, "days").unix()
    //moment para crear momento de creacion y de expiracion.
  };

  //devolver el jwt token codificado
  return jwt.encode(payload, secret);
};

module.exports={
  createToken,
  secret
}
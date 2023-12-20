// importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

// Clave secreta
const secret = "CLAVE_SECRETA_del_proyecto_DE_LA_RED_SOCIAL_1234";

// Crear una funcion para gnenera tokens
const creat_token = (user) => {
    const payload = {
        id: user._id,
        surname: user.surname,
        name: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),              // hace referencia al mommento que creamos este payload        
        exp: moment().add(30, "days").unix()  // es la fecha de expiracion de este token
    };

    // Devolver JWT token codificado
    return jwt.encode(payload, secret);
    
}


module.exports = {
    secret,
    creat_token
}
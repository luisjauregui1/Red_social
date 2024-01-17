// importar modelo
const Follow = require("../models/follow");
const User = require("../models/user");

// Acciones de prueba
const pruebaFollow = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/follow.js",
    });
};

// Accion de guardar un follow ( accion seguir)
const save = (req, res) => {

    // Conseguir datos por body

    // savar id del usuraio identificado

    // Crear objeto con modelo follow

    // Guardar objeto en base de datos

    return res.status(200).send({
        status: "success",
        message: "accion save",
        idenuty: req.user
    });
}

// Acccion de borrar un follow (accion de seguir)

// Accion listado de usuarios que estoy siguiendo

// Acccion listado de usuario que me siguen

// Exportar acciones
module.exports = {
    pruebaFollow,
    save
};

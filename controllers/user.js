// Importar dependencias y modulos
const bcrypt = require("bcrypt");

// Importar modelos
const User = require("../models/user");

// Acciones de prueba
const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/user.js"
    })
}

const register = async (req, res) => {
    // recogemos datos de la peticion
    let params = req.body
    // comprobar que llegan ( + validacion )
    if (!params.name || !params.email || !params.password || !params.nick) {
        console.log("Incorrect Validation")
        return res.status(400).send({
            status: 'error',
            message: "Faltan datos por enviar"
        })
    }

    try {
        // control de usuarios duplicados
        let duplicated_user = await User.find({
            $or: [
                { email: params.email.toLowerCase() },
                { nick: params.nick.toLowerCase() }
            ]
        }).exec()

        // condicion de duplicado
        if (duplicated_user && duplicated_user.length >= 1) {
            return res.status(200).json({
                status: "success",
                message: "The user has been exist"
            })
        }
        // Cifrar contraseña
        let pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;
        // Crear objeto de usuario 
        let user_to_save = new User(params);
        // guardar en la Base de datos
        let user_saved = await user_to_save.save();
        if (!user_saved) {
            return res.status(500).send({
                status: "error",
                message: "Error saving user"
            })
        }

        return res.status(200).json({
            status: "success",
            message: "registro satisfactorio",
            user_to_save
        });

    } catch (error) {
        return res.status(400).json({
            status: "errro",
            message: "Error inesperado al intetar ingresar datos"
        })
    }
}


const login = async (req, res) => {
    // Recoger parametros body
    let params = req.body

    if (!params.email || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar"
        })
    }
    // buscar en la base de datos
    let searched_user = await User.findOne({ email: params.email })
        // .select({ "password": 0 })
        .exec()

    if (!searched_user) {
        return res.status(404).send({
            status: "error",
            message: "No existe este usuario"
        })
    }

    // Comprobar su contraseña
    const pwd = bcrypt.compareSync(params.password, searched_user.password)
    
    if (!pwd) {
        return res.status(400).send({
            status: "error",
            message: "No te haz identificado bien"
        })
    }
    // Conseguir el Token
    const token = false;

    //Eliminar password del objeto 
    

    // Datos del usuario
    return res.status(200).send({
        status: "success",
        message: "Login success",
        user: {
            id: searched_user._id,
            name: searched_user.name,
            nick: searched_user.nick
        },
        token
    })
}

// Exportar acciones
module.exports = {
    pruebaUser,
    register,
    login
}
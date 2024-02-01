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
const save = async (req, res) => {

    // Conseguir datos por body
    const params = req.body; // los datos que mandamos por el body

    // savar id del usuraio identificado
    const identity = req.user; // El usuario que esta con el login
    
    // El método estático Object.keys() devuelve un arreglo de propiedades enumerables propias de un objeto dado.

    if (Object.keys(params).length === 0){ 
        console.log("Body vacio")
        return res.status(400).send({
            status: "error",
            message: "sin datos para poder seguir!"
        })
    }

    // Crear objeto con modelo follow
    let userToFollow = new Follow({
        user: identity.id,
        followed: params.followed
    }); // El modelo o molde que usamos para follow
    
    
    // Guardar objeto en base de datos
    try {

        const existingFollow = await Follow.findOne({
            user: identity.id,
            followed: params.followed
        })

        if (existingFollow){
            return res.status(400).send({
                status: "error",
                message: "Ya sigues a este usuario"
            })
        }

        let followStored = await userToFollow.save()
        
        return res.status(200).send({
            status: "success",
            identity: req.user,
            follow: followStored
        })

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al guardar"
        })
    }
    
}

// Acccion de borrar un follow (accion de seguir)
const unfollow = async (req,res) => {
    return res.status(200).send({
        status: "success",
        message: req.user
    })
}
// Accion listado de usuarios que estoy siguiendo

// Acccion listado de usuario que me siguen

// Exportar acciones
module.exports = {
    pruebaFollow,
    save,
    unfollow
};

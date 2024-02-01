// Importar dependencias y modulos
const bcrypt = require("bcrypt");
const fs = require("fs")
const path = require("path")

// Importar modelos
const User = require("../models/user");

// Importar servicios
const jwt = require("../services/jwt");
const { error } = require("console");


const test_simple = (req, res) => {
    console.log('Usando test_simple')
    return res.status(200).send({
        status: 'Success',
        message: 'Hola mundo. User /test',
    })
}

// Acciones de prueba
const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/user.js",
        usuario: req.user
    })
}


const profile = async (req, res) => {
    // recibir paramtero de id
    try {
        const id = req.params.id
        // consulta de datos de usuario
        let user_profile = await User.findById(id).select({ password: 0, role: 0 })

        if (!user_profile) {
            return res.status(404).send({
                status: "error",
                message: "El usuario no existe!"
            })
        }
        // Devolver resultado
        // posteriormente: devolver inforamcion de follows
        return res.status(200).send({
            status: "success",
            user: user_profile
        });
    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Error al buscar user"
        })
    }



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
    let searched_user = await User.findOne({ email: params.email }).exec()
    //.select({ "password": 0 }) "Esta consulta es para sacar password de mi body y que no se mueste en la consutal"


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
    const token = jwt.creat_token(searched_user);

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

const list = async (req, res) => {

    try {
        // Controlar la pagina que estamos
        let page = 1;
        if (req.params.page) {
            page = req.params.page;
        }

        page = parseInt(page);

        // Consulta con mongoose pagonate
        let itesmPerPage = 5; // determina cuantos usuarios se mostraran en cada pagina.
        let skip = (page - 1) * itesmPerPage; // Calcula cuantos usuarios se deben omitir en la consulta.

        let count_users = await User.find('_id').count() // sacamos la cantidad de ususarios que tenemos en la base de datos

        let users = await User.find().sort('name').skip(skip).limit(itesmPerPage)


        if (!users) {
            return res.status(404).send({
                status: "error",
                message: "No hay usuarios!"
            })
        }

        // Devolver el resultado ( posteririomtent info de follows)
        return res.status(200).send({
            status: "success",
            message: "Lista de usuarios",
            count: users.length,
            pages: Math.ceil(count_users / itesmPerPage),
            users,
            page,
            itesmPerPage,

        })

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al obtener la lista de usuarios"
        })
    }
}

// Update de usuarios
const update = async (req, res) => {

    // Recoger info del usuario a actualizar
    const userIdentity = req.user;
    // UserTouPDATE son los que nos envia el cliente y los de arriba los que tenemos
    const userToUpdate = req.body;
    //Eliminar campos sobrantes que no se deban actualizar
    delete userIdentity.iat;
    delete userIdentity.exp;
    delete userIdentity.role;
    delete userIdentity.image;
    console.log(userToUpdate);

    if (Object.keys(userToUpdate).length === 0) {
        console.log("DataBody it's empty")
        return res.status(400).send({
            status: "error",
            message: "No enviaste datos para actualizar",
            userToUpdate,
            userIdentity
        })
    }


    // Comprobar si el usuario ya existe
    const duplicated_user = await User.find({
        $or: [
            { email: userToUpdate.email },
            { nick: userToUpdate.nick }
        ]
    }).exec()
    let userIsset = false;
    duplicated_user.forEach(user => {
        if (user && user._id != userIdentity.id) userIsset = true;
    });

    if (userIsset) {
        return res.status(200).send({
            status: "success",
            message: "There is already a registered user with that name or email"
        })
    }

    // Si llega la contrasena 
    if (userToUpdate.password) {
        let pwd = await bcrypt.hash(userToUpdate.password, 10)
        userToUpdate.password = pwd;
        // Si me llega la passw cifrarlo    
    }

    // Buscar y actualizar 
    let userUpdated = await User.findByIdAndUpdate({_id: userIdentity.id}, userToUpdate, { new: true })
    if (!userUpdated) {
        return res.tatus(400).send({
            status: 'error',
            message: 'Update user method has failed',
        })
    }

    return res.status(200).send({
        status: 'success',
        message: 'Update user method',
        user: userUpdated
    })
}


const upload = async (req, res) => {

    // Recoger el fichero de imagen y comprobar que existe
    if (!req.file) {
        return res.status(404).send({
            status: "error",
            message: "peticion no incluye la imagen"
        });
    };
    // consgueti el nombre del archivo
    let image = req.file.originalname;
    // sacar la extension del archivo
    const imageSplit = image.split("\.");
    const extension = imageSplit[1];
    // comprobar extension
    if (extension != 'png' && extension != 'jpg' && extension != 'jpeg') {
        // si no es correcta, borrar archivo
        let filePath = req.file.path;
        let fileDeleted = fs.unlinkSync(filePath);
        // Devolver respuesta negativa
        return res.status(400).send({
            status: "error",
            message: "Extension del fichero invalidad",
        })
    }
    // si es correcta, guardar imagen en base de datos
    let updateUser = await User.findByIdAndUpdate({_id: req.user.id}, { image: req.file.filename }, { new: true })
    if (!updateUser) {
        return res.status(500).send({
            status: "error",
            message: "Error al intentar actualizar nombre"
        })
    }
    // devolver respuesta
    return res.status(200).send({
        status: "success",
        user: updateUser,
        file: req.file,
    })
}


const avatar = async (req, res) => {
    // sacar el parametro de la url 
    const file = req.params.file;

    // montar el path real de la imagen
    const filePath = "./upload/avatars/" + file;
    // comprobar que existe
    fs.stat(filePath, (error,exist) => {
        console.log(filePath)
        if(!exist){
            return res.status(400).send({
                status: "Error",
                message: "No existe la ruta"
            })
        };

        // Devolver un file
        
        return res.sendFile(path.resolve(filePath));

    })
      
}

// Exportar acciones
module.exports = {
    test_simple,
    pruebaUser,
    list,
    register,
    login,
    profile,
    update,
    upload,
    avatar
}

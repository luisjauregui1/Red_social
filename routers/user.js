const express = require('express');
const router = express.Router();
const UserController = require("../controllers/user")
const check = require("../middlewares/auth")

// Definir rutas
router.get('/pruebas-usuario', check.auth, UserController.pruebaUser);
router.post('/register', UserController.register)
router.post('/login', UserController.login);
router.get('/profile/:id', check.auth, UserController.profile);
router.get('/list/:page?', check.auth, UserController.list);
<<<<<<< HEAD
router.put('/update', check.auth, UserController.update);

=======
router.put('/update', check.auth, UserController.update)
>>>>>>> f45123f42e5ac3d0757bb048fe7d1293b5f232f0

// Exportar router
module.exports = router;
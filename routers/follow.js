const express = require('express');
const router = express.Router();
const FollowController = require("../controllers/follow")

// Definir rutas
router.get('/pruebas-follow', FollowController.pruebaFollow);

// Exportar router
module.exports = router;
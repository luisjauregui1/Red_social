// Importar dependencias
const connection = require("./database/connection")
const express = require("express")
const cors = require("cors")

// Mensaje de bievenida
console.log("API NODE para RED SOCIAL arrancada!")

// conexion a base de datos
connection();
// Crear Servidor node
const app = express();
const port = 3900;

// Configurar cors
app.use(cors()) // Cross-Origin Resource Sharing

// Convertir los datos del body a objetos js
app.use(express.json()); // metodo json un middleware que nos decodificar los datos de body
app.use(express.urlencoded({ extended: true })) /* cualquier dato que me llegue con el 
                                                   formato urlencoded me los combiera a un objeto de js*/

// Cargar las rutas
const UserRouter = require('./routers/user');
const PublicationRouter = require('./routers/publication')
const FollowRouters = require('./routers/follow')

app.use('/api/user', UserRouter);
app.use('/api/publication', PublicationRouter);
app.use('/api/follow', FollowRouters);

// Ruta de prueba
app.get('/ruta-prueba', (req, res) => {
    return res.status(200).json(
        {
            "id": 1,
            "nombre": "Gustavo",
            "Web": "test.com"
        }
    )
}) // este ruta de prueba no funcionaria sin poner a escuchar peticiones http al server

// Poner servidor a escuchar peticiones http
app.listen(port, () => {
    console.log("Servidor de node(El Demonio) corriendo en el puerto:", + port)
})
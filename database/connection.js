const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mi_redsocial");
    // cambie localhost por la ip y se conecta, en cambio si lo dejo me manda error 
    // mongodb://localhost:27017

    console.log("Conectado correctamente a base de datos: mi_redsocial");
  } catch (error) {
    console.log("Error de conexion a la base de datos", error);
    throw new Error("No se ha podido conectar a la base de datos!");
  }
};

module.exports = connection

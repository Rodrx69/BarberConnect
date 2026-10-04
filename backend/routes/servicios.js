//Permite utilizar Express dentro de este archivo.
const express = require("express");

//Creamos un módulo independiente de rutas con Router.
const router = express.Router();

//Aquí cargamos los datos del archivo y los guardamos en una variable.
const servicios = require("../data/servicios.json");

// Ruta GET para obtener servicios
router.get("/", (req, res) => {
    res.json(servicios);
});
module.exports = router;
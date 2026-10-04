const express = require("express");
const router = express.Router();

// Importamos las funciones del controlador
const {
    crearCita,
    obtenerCitas,
    obtenerCitaPorId,
    obtenerHorariosOcupados,
    actualizarEstadoCita
} = require("../controllers/citasController");

// Consultar horarios ocupados según la fecha
router.get(
    "/ocupadas",
    obtenerHorariosOcupados
);

// Obtener todas las citas
router.get(
    "/",
    obtenerCitas
);

// Obtener una cita por ID
router.get(
    "/:id",
    obtenerCitaPorId
);

// Actualizar el estado de una cita
router.patch(
    "/:id/estado",
    actualizarEstadoCita
);

// Registrar una nueva cita
router.post(
    "/",
    crearCita
);
module.exports = router;
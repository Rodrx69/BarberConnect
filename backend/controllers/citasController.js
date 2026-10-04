const fs = require("fs"); // Permite leer y escribir archivos.
const path = require("path"); // Permite crear rutas correctas del sistema.

// Ruta del archivo citas.json
const archivoCitas = path.join(
    __dirname,
    "../data/citas.json"
);

// =========== CREAR UNA NUEVA CITA ===============
const crearCita = (req, res) => {
    const nuevaCita = req.body;

    // Validación básica
    if (
        !nuevaCita.nombre ||
        !nuevaCita.dni ||
        !nuevaCita.telefono ||
        !nuevaCita.servicio ||
        !nuevaCita.fecha ||
        !nuevaCita.hora
    ) {
        return res.status(400).json({
            mensaje: "Todos los campos son obligatorios"
        });
    }

    // Leer citas actuales
    const citas = JSON.parse(
        fs.readFileSync(
            archivoCitas,
            "utf-8"
        )
    );

    // Verificar si el horario ya está reservado
    const citaExistente = citas.some((cita) => {
        return (
            cita.fecha === nuevaCita.fecha &&
            cita.hora === nuevaCita.hora &&
            cita.estado !== "Cancelada"
        );
    });

    // Si existe una cita en la misma fecha y hora
    if (citaExistente) {
        return res.status(409).json({
            mensaje:
                "Ese horario ya se encuentra reservado. Selecciona otra hora."
        });
    }

    // Crear ID automático
    nuevaCita.id = citas.length + 1;

    // Estado inicial
    nuevaCita.estado = "Pendiente";

    // Agregar nueva cita
    citas.push(nuevaCita);

    // Guardar archivo actualizado
    fs.writeFileSync(
        archivoCitas,
        JSON.stringify(
            citas,
            null,
            2
        )
    );

    // Respuesta
    res.status(201).json({
        mensaje: "Cita registrada correctamente",
        cita: nuevaCita
    });
};

// ========== OBTENER TODAS LAS CITAS ==============
const obtenerCitas = (req, res) => {
    // Leer las citas almacenadas
    const citas = JSON.parse(
        fs.readFileSync(
            archivoCitas,
            "utf-8"
        )
    );

    // Enviar las citas al frontend
    res.json(citas);
};

// =========== OBTENER UNA CITA POR ID =============
const obtenerCitaPorId = (req, res) => {
    const id = Number(req.params.id);

    // Leer citas almacenadas
    const citas = JSON.parse(
        fs.readFileSync(
            archivoCitas,
            "utf-8"
        )
    );

    // Buscar la cita por su ID
    const cita = citas.find(
        (cita) => cita.id === id
    );

    // Si no existe
    if (!cita) {
        return res.status(404).json({
            mensaje: "Cita no encontrada"
        });
    }

    // Enviar la cita encontrada
    res.json(cita);
};

// ======== ACTUALIZAR ESTADO DE UNA CITA ===========
const actualizarEstadoCita = (req, res) => {
    const id = Number(req.params.id);
    const { estado } = req.body;

    // Estados permitidos
    const estadosPermitidos = [
        "Pendiente",
        "Confirmada",
        "Cancelada"
    ];

    // Validar estado
    if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({
            mensaje: "Estado de cita no válido"
        });
    }

    // Leer las citas
    const citas = JSON.parse(
        fs.readFileSync(
            archivoCitas,
            "utf-8"
        )
    );

    // Buscar la cita
    const cita = citas.find(
        (cita) => cita.id === id
    );

    // Si no existe
    if (!cita) {
        return res.status(404).json({
            mensaje: "Cita no encontrada"
        });
    }

    // Actualizar únicamente el estado
    cita.estado = estado;

    // Guardar archivo actualizado
    fs.writeFileSync(
        archivoCitas,
        JSON.stringify(
            citas,
            null,
            2
        )
    );

    // Respuesta
    res.json({
        mensaje: "Estado de la cita actualizado correctamente",
        cita: cita
    });
};

// ========== OBTENER HORARIOS OCUPADOS =============
const obtenerHorariosOcupados = (req, res) => {
    // Obtener la fecha enviada en la URL
    const fecha = req.query.fecha;

    // Validar fecha
    if (!fecha) {
        return res.status(400).json({
            mensaje: "La fecha es obligatoria"
        });
    }

    // Leer todas las citas
    const citas = JSON.parse(
        fs.readFileSync(
            archivoCitas,
            "utf-8"
        )
    );

    // Filtrar citas de esa fecha
    // Las canceladas no ocupan horario
    const citasDeLaFecha = citas.filter(
        (cita) =>
            cita.fecha === fecha &&
            cita.estado !== "Cancelada"
    );

    // Obtener solamente las horas
    const horasOcupadas = citasDeLaFecha.map(
        (cita) => cita.hora
    );

    // Enviar las horas al frontend
    res.json({
        fecha: fecha,
        horasOcupadas: horasOcupadas
    });
};

// ========== EXPORTAR FUNCIONES ===========
module.exports = {
    crearCita,
    obtenerCitas,
    obtenerCitaPorId,
    obtenerHorariosOcupados,
    actualizarEstadoCita
};
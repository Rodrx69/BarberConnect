//============ API ===========
const API_CITAS = "http://localhost:3000/api/citas";

//========  ELEMENTOS DEL DOM =========
const mensajeCargando =
    document.getElementById("gestionar-cargando");
const mensajeError =
    document.getElementById("gestionar-error");
const gestionarContainer =
    document.getElementById("gestionar-container");
const citaId =
    document.getElementById("cita-id");
const citaNombre =
    document.getElementById("cita-nombre");
const citaDni =
    document.getElementById("cita-dni");
const citaTelefono =
    document.getElementById("cita-telefono");
const citaServicio =
    document.getElementById("cita-servicio");
const citaFecha =
    document.getElementById("cita-fecha");
const citaHora =
    document.getElementById("cita-hora");
const citaEstadoActual =
    document.getElementById("cita-estado-actual");
const selectNuevoEstado =
    document.getElementById("nuevo-estado");
const botonGuardarEstado =
    document.getElementById("btn-guardar-estado");
const mensajeGestion =
    document.getElementById("mensaje-gestion");

//========= OBTENER ID DESDE LA URL ============
const parametros =
    new URLSearchParams(
        window.location.search
    );
const idCita =
    parametros.get("id");

//======== FORMATEAR FECHA =========
function formatearFecha(fecha) {
    const partes = fecha.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

//======== MOSTRAR ESTADO ===========
function mostrarEstado(estado) {
    citaEstadoActual.textContent = estado;
    citaEstadoActual.classList.remove(
        "admin-status-pendiente",
        "admin-status-confirmada",
        "admin-status-cancelada"
    );
    if (estado === "Pendiente") {
        citaEstadoActual.classList.add(
            "admin-status-pendiente"
        );
    } else if (estado === "Confirmada") {
        citaEstadoActual.classList.add(
            "admin-status-confirmada"
        );
    } else if (estado === "Cancelada") {
        citaEstadoActual.classList.add(
            "admin-status-cancelada"
        );
    }
}

//========= CARGAR CITA ===========
async function cargarCita() {
    // Si entramos sin un ID
    if (!idCita) {
        mensajeCargando.classList.add("d-none");
        mensajeError.classList.remove("d-none");
        mensajeError.querySelector("p").textContent =
            "No se indicó qué cita deseas gestionar.";
        return;
    }
    try {
        const respuesta =
            await fetch(
                `${API_CITAS}/${idCita}`
            );
        if (!respuesta.ok) {
            throw new Error(
                "No fue posible encontrar la cita"
            );
        }
        const cita =
            await respuesta.json();

        // ID
        citaId.textContent =
            cita.id;

        // Datos del cliente
        citaNombre.textContent =
            cita.nombre;
        citaDni.textContent =
            cita.dni;
        citaTelefono.textContent =
            cita.telefono;

        // Datos de la reserva
        citaServicio.textContent =
            cita.servicio;
        citaFecha.textContent =
            formatearFecha(cita.fecha);
        citaHora.textContent =
            cita.hora;

        // Estado actual
        mostrarEstado(
            cita.estado
        );

        // Seleccionamos también
        // el estado actual en el select
        selectNuevoEstado.value =
            cita.estado;

        // Ocultamos "Cargando..."
        mensajeCargando.classList.add(
            "d-none"
        );

        // Mostramos la tarjeta
        gestionarContainer.classList.remove(
            "d-none"
        );
    } catch (error) {
        console.error(
            "Error al cargar la cita:",
            error
        );
        mensajeCargando.classList.add(
            "d-none"
        );
        mensajeError.classList.remove(
            "d-none"
        );
    }
}

//========== MOSTRAR MENSAJE =============
function mostrarMensajeGestion(texto, tipo) {
    mensajeGestion.textContent = texto;
    mensajeGestion.classList.remove(
        "d-none",
        "mensaje-exito-reserva",
        "mensaje-error-reserva"
    );
    if (tipo === "exito") {
        mensajeGestion.classList.add(
            "mensaje-exito-reserva"
        );
    } else {
        mensajeGestion.classList.add(
            "mensaje-error-reserva"
        );
    }
}

//======= GUARDAR NUEVO ESTADO =======
botonGuardarEstado.addEventListener(
    "click",
    async () => {
        const nuevoEstado =
            selectNuevoEstado.value;
        try {
            const respuesta = await fetch(
                `${API_CITAS}/${idCita}/estado`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        estado: nuevoEstado
                    })
                }
            );
            const resultado =
                await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    resultado.mensaje
                );
            }

            // Actualizamos visualmente
            // el estado de la cita
            mostrarEstado(
                resultado.cita.estado
            );

            // Mostramos mensaje de éxito
            mostrarMensajeGestion(
                resultado.mensaje,
                "exito"
            );
        } catch (error) {
            console.error(
                "Error al actualizar el estado:",
                error
            );
            mostrarMensajeGestion(
                error.message ||
                "No fue posible actualizar el estado.",
                "error"
            );
        }
    }
);

//======== INICIAR ===========
cargarCita();
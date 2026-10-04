//==============  API ===============
const API_CITAS = "http://localhost:3000/api/citas";

//======== ELEMENTOS DEL DOM =========
const totalCitas = document.getElementById("total-citas");
const totalPendientes = document.getElementById("total-pendientes");
const totalConfirmadas = document.getElementById("total-confirmadas");
const totalCanceladas = document.getElementById("total-canceladas");
const mensajeCargando = document.getElementById("admin-cargando");
const mensajeError = document.getElementById("admin-error");
const tablaContainer = document.getElementById("admin-tabla-container");
const tablaCitasBody = document.getElementById("tabla-citas-body");
// Guardamos todas las citas obtenidas del backend
let citasCargadas = [];

//========= FORMATEAR FECHA ============
function formatearFecha(fecha) {
    const partes = fecha.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

//=========== ACTUALIZAR ESTADÍSTICAS ==============
function actualizarEstadisticas(citas) {
    // Total general
    totalCitas.textContent = citas.length;

    // Contamos según el estado de cada cita
    const pendientes = citas.filter(
        (cita) => cita.estado === "Pendiente"
    ).length;
    const confirmadas = citas.filter(
        (cita) => cita.estado === "Confirmada"
    ).length;
    const canceladas = citas.filter(
        (cita) => cita.estado === "Cancelada"
    ).length;

    // Mostramos los resultados
    totalPendientes.textContent = pendientes;
    totalConfirmadas.textContent = confirmadas;
    totalCanceladas.textContent = canceladas;
}

//========== MOSTRAR CITAS EN LA TABLA ==========
function mostrarCitas(citas) {
    // Limpiamos contenido anterior
    tablaCitasBody.innerHTML = "";

    // Si todavía no existen citas
    if (citas.length === 0) {
        tablaContainer.classList.add("d-none");
        mensajeCargando.textContent =
            "No hay citas en esta categoría.";
        mensajeCargando.classList.remove("d-none");
        return;
    }

    // Ocultamos mensaje de carga
    mensajeCargando.classList.add("d-none");
    // Mostramos la tabla
    tablaContainer.classList.remove("d-none");
    // Recorremos todas las citas
    citas.forEach((cita) => {
        // Creamos una fila
        const fila = document.createElement("tr");

//=========== ID ==============
        const celdaId = document.createElement("td");
        celdaId.textContent = cita.id;

//========= CLIENTE =============
        const celdaCliente = document.createElement("td");
        celdaCliente.textContent = cita.nombre;

//========== TELÉFONO ==============
        const celdaTelefono = document.createElement("td");
        celdaTelefono.textContent = cita.telefono;

//========= SERVICIO ============
        const celdaServicio = document.createElement("td");
        celdaServicio.textContent = cita.servicio;

//========== FECHA ==============
        const celdaFecha = document.createElement("td");
        celdaFecha.textContent =
            formatearFecha(cita.fecha);

// ========= HORA ============
        const celdaHora = document.createElement("td");
        celdaHora.textContent = cita.hora;

//========= ESTADO =============
        const celdaEstado = document.createElement("td");
        const estado = document.createElement("span");
        estado.classList.add("admin-status");
        estado.textContent = cita.estado;
        // Agregamos una clase según el estado
        if (cita.estado === "Pendiente") {
            estado.classList.add(
                "admin-status-pendiente"
            );
        } else if (cita.estado === "Confirmada") {
            estado.classList.add(
                "admin-status-confirmada"
            );
        } else if (cita.estado === "Cancelada") {
            estado.classList.add(
                "admin-status-cancelada"
            );
        }
celdaEstado.appendChild(estado);

        // Agregamos una clase según el estado
        if (cita.estado === "Pendiente") {
            estado.classList.add(
                "admin-status-pendiente"
            );
        } else if (cita.estado === "Confirmada") {
            estado.classList.add(
                "admin-status-confirmada"
            );
        } else if (cita.estado === "Cancelada") {
            estado.classList.add(
                "admin-status-cancelada"
            );
        }
        celdaEstado.appendChild(estado);

//========== ACCIÓN =============
        const celdaAccion = document.createElement("td");
        const botonGestionar = document.createElement("a");
        botonGestionar.href =
            `gestionar.html?id=${encodeURIComponent(cita.id)}`;
        botonGestionar.classList.add(
            "btn",
            "btn-reserva",
            "btn-sm"
        );
        botonGestionar.textContent = "Gestionar";
        celdaAccion.appendChild(botonGestionar);

//========== AGREGAR CELDAS A LA FILA ============
        fila.appendChild(celdaId);
        fila.appendChild(celdaCliente);
        fila.appendChild(celdaTelefono);
        fila.appendChild(celdaServicio);
        fila.appendChild(celdaFecha);
        fila.appendChild(celdaHora);
        fila.appendChild(celdaEstado);
        fila.appendChild(celdaAccion);

        // Agregamos la fila a la tabla
        tablaCitasBody.appendChild(fila);
    });
}

//======= FILTRAR CITAS POR ESTADO =========
function filtrarCitas(estado) {

    // Mostrar todas las citas
    if (estado === "Todos") {
        mostrarCitas(citasCargadas);
        return;
    }

    // Filtrar según el estado seleccionado
    const citasFiltradas = citasCargadas.filter(
        (cita) => cita.estado === estado
    );
    mostrarCitas(citasFiltradas);
}

// =========== OBTENER CITAS DEL BACKEND ==============
async function cargarCitas() {
    try {
        const respuesta = await fetch(API_CITAS);
        if (!respuesta.ok) {
            throw new Error(
                "No se pudieron obtener las citas"
            )
        }
        const citas = await respuesta.json();
        // Guardamos todas las citas para poder filtrarlas
        citasCargadas = citas;

        // Actualizamos estadísticas
        actualizarEstadisticas(citas);

        // Mostramos las citas
        mostrarCitas(citas);
    } catch (error) {
        console.error(
            "Error al cargar las citas:",
            error
        );

        // Ocultamos el mensaje de carga
        mensajeCargando.classList.add("d-none");

        // Mostramos mensaje de error
        mensajeError.classList.remove("d-none");
    }
}

//======= EVENTOS DE LOS FILTROS ============
const tarjetasFiltro =
    document.querySelectorAll(".admin-stat-card");
tarjetasFiltro.forEach((tarjeta) => {
    tarjeta.addEventListener("click", () => {
        // Obtenemos el valor del data-filtro
        const filtro =
            tarjeta.dataset.filtro;

        // Aplicamos el filtro
        filtrarCitas(filtro);

        // Quitamos el estilo activo
        tarjetasFiltro.forEach((item) => {
            item.classList.remove(
                "admin-stat-card-active"
            );
        });

        // Marcamos la tarjeta seleccionada
        tarjeta.classList.add(
            "admin-stat-card-active"
        );
    });
});

//========  INICIAR PANEL ==========
cargarCitas();
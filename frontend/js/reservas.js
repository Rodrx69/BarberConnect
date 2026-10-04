//======= APIs ==========
const API_SERVICIOS = "http://localhost:3000/api/servicios";
const API_CITAS = "http://localhost:3000/api/citas";
//======== ELEMENTOS DEL DOM =========
const selectServicio = document.getElementById("servicio");
const formularioReserva = document.getElementById("form-reserva");
const mensajeReserva = document.getElementById("mensaje-reserva");
const inputFecha = document.getElementById("fecha");
const inputHora = document.getElementById("hora");
//======== FECHA MÍNIMA =========
// Obtenemos la fecha actual
const hoy = new Date();
const anioActual = hoy.getFullYear();
const mesActual = String(
    hoy.getMonth() + 1
).padStart(2, "0");
const diaActual = String(
    hoy.getDate()
).padStart(2, "0");
const fechaActual =
    `${anioActual}-${mesActual}-${diaActual}`;
// No permitimos seleccionar fechas anteriores a hoy
inputFecha.min = fechaActual;
//======= CARGAR HORARIOS =========
async function cargarHorarios() {
    // Limpiamos los horarios anteriores
    inputHora.innerHTML = "";
    // Si todavía no se seleccionó una fecha
    if (!inputFecha.value) {
        const opcion =
            document.createElement("option");
        opcion.value = "";
        opcion.textContent =
            "Primero selecciona una fecha";
        inputHora.appendChild(opcion);
        inputHora.disabled = true;
        return;
    }
    try {
        // Consultamos al backend qué horas
        // ya están ocupadas para esa fecha
        const respuesta = await fetch(
            `${API_CITAS}/ocupadas?fecha=${encodeURIComponent(inputFecha.value)}`
        );
        if (!respuesta.ok) {
            throw new Error(
                "No se pudieron consultar los horarios ocupados"
            );
        }
        const datos = await respuesta.json();
        // Array recibido desde el backend
        const horasOcupadas =
            datos.horasOcupadas;
        // Activamos el selector
        inputHora.disabled = false;
        // Opción inicial
        const opcionInicial =
            document.createElement("option");
        opcionInicial.value = "";
        opcionInicial.textContent =
            "Selecciona una hora";
        inputHora.appendChild(opcionInicial);
        // Horario de BarberConnect
        const horaInicio = 9 * 60;
        const horaFin = 21 * 60;
        // Hora actual expresada en minutos
        const ahora = new Date();
        const minutosActuales =
            ahora.getHours() * 60 +
            ahora.getMinutes();
        let horariosDisponibles = 0;
        // Creamos horarios cada 30 minutos
        for (
            let minutos = horaInicio;
            minutos <= horaFin;
            minutos += 30
        ) {
            const horas =
                Math.floor(minutos / 60);
            const minutosRestantes =
                minutos % 60;
            const horaFormateada =
                String(horas).padStart(2, "0")
                +
                ":"
                +
                String(minutosRestantes).padStart(2, "0");
            // Si la reserva es para hoy,
            // ocultamos las horas que ya pasaron
            if (
                inputFecha.value === fechaActual &&
                minutos <= minutosActuales
            ) {
                continue;
            }
            // Si la hora ya está reservada,
            // tampoco la mostramos
            if (
                horasOcupadas.includes(
                    horaFormateada
                )
            ) {
                continue;
            }
            // Creamos la opción disponible
            const opcion =
                document.createElement("option");
            opcion.value = horaFormateada;
            opcion.textContent = horaFormateada;
            inputHora.appendChild(opcion);
            horariosDisponibles++;
        }
        // Si no queda ninguna hora disponible
        if (horariosDisponibles === 0) {
            inputHora.innerHTML = "";
            const opcionSinHorario =
                document.createElement("option");
            opcionSinHorario.value = "";
            opcionSinHorario.textContent =
                "No hay horarios disponibles para esta fecha";
            inputHora.appendChild(
                opcionSinHorario
            );
            inputHora.disabled = true;
        }
    } catch (error) {
        console.error(
            "Error al cargar horarios:",
            error
        );
        inputHora.innerHTML = "";
        const opcionError =
            document.createElement("option");
        opcionError.value = "";
        opcionError.textContent =
            "No se pudieron cargar los horarios";
        inputHora.appendChild(opcionError);
        inputHora.disabled = true;
        mostrarMensaje(
            "No fue posible consultar los horarios disponibles.",
            "error"
        );
    }
}
//======== CARGAR SERVICIOS ============
async function cargarServicios() {
    try {
        const respuesta = await fetch(API_SERVICIOS);
        if (!respuesta.ok) {
            throw new Error(
                "No se pudieron obtener los servicios"
            );
        }
        const servicios = await respuesta.json();
        servicios.forEach((servicio) => {
            const opcion =
                document.createElement("option");
            opcion.value = servicio.nombre;
            opcion.textContent =
                `${servicio.nombre} - S/ ${servicio.precio}`;
            selectServicio.appendChild(opcion);
        });
//========= SERVICIO RECIBIDO POR URL ==========
        const parametros =
            new URLSearchParams(
                window.location.search
            );
        const servicioSeleccionado =
            parametros.get("servicio");
        if (servicioSeleccionado) {
            const existeServicio =
                servicios.some(
                    (servicio) =>
                        servicio.nombre ===
                        servicioSeleccionado
                );
            if (existeServicio) {
                selectServicio.value =
                    servicioSeleccionado;
            }
        }
    } catch (error) {
        console.error(
            "Error al cargar los servicios:",
            error
        );
        const opcionError =
            document.createElement("option");
        opcionError.textContent =
            "No se pudieron cargar los servicios";
        opcionError.disabled = true;
        selectServicio.appendChild(
            opcionError
        );
    }
}
//========= MOSTRAR MENSAJES =========
function mostrarMensaje(
    texto,
    tipo
) {
    mensajeReserva.textContent = texto;
    mensajeReserva.classList.remove(
        "d-none",
        "mensaje-exito-reserva",
        "mensaje-error-reserva"
    );
    if (tipo === "exito") {
        mensajeReserva.classList.add(
            "mensaje-exito-reserva"
        );
    } else {
        mensajeReserva.classList.add(
            "mensaje-error-reserva"
        );
    }
}
//======== VALIDAR FECHA Y HORA ============
// Ocultamos el mensaje de reserva
function ocultarMensaje() {
    mensajeReserva.classList.add("d-none");
    mensajeReserva.classList.remove(
        "mensaje-exito-reserva",
        "mensaje-error-reserva"
    );
}
// Validamos que la fecha y hora seleccionadas
function validarFechaHora() {
    const fechaSeleccionada =
        inputFecha.value;
    const horaSeleccionada =
        inputHora.value;
    // No permitir fechas anteriores
    if (fechaSeleccionada < fechaActual) {
        mostrarMensaje(
            "No puedes reservar una fecha pasada.",
            "error"
        );
        return false;
    }
    // Convertimos la fecha para conocer
    // el día de la semana
    const partes =
        fechaSeleccionada
            .split("-")
            .map(Number);
    const fecha =
        new Date(
            partes[0],
            partes[1] - 1,
            partes[2]
        );
    // getDay() devuelve:
    // 0 = domingo
    // 1 = lunes
    // ...
    // 6 = sábado
    if (fecha.getDay() === 0) {
        mostrarMensaje(
            "BarberConnect no atiende los domingos.",
            "error"
        );
        return false;
    }
    // Validamos horario
    if (
        horaSeleccionada < "09:00" ||
        horaSeleccionada > "21:00"
    ) {
        mostrarMensaje(
            "El horario de atención es de 9:00 a.m. a 9:00 p.m.",
            "error"
        );
        return false;
    }
    // Si la cita es para hoy,
    // no permitimos seleccionar una hora pasada
    if (fechaSeleccionada === fechaActual) {
        const horaActual =
            String(
                hoy.getHours()
            ).padStart(2, "0")
            +
            ":"
            +
            String(
                hoy.getMinutes()
            ).padStart(2, "0");
        if (horaSeleccionada <= horaActual) {
            mostrarMensaje(
                "Selecciona una hora posterior a la actual.",
                "error"
            );
            return false;
        }
    }
    return true;
}
//============ VALIDAR FECHA AL SELECCIONARLA =============
inputFecha.addEventListener("change", () => {
    const fechaSeleccionada = inputFecha.value;
    // Si no hay fecha seleccionada, no hacemos nada
    if (!fechaSeleccionada) {
        return;
    }
    // Verificamos que no sea una fecha pasada
    if (fechaSeleccionada < fechaActual) {
        mostrarMensaje(
            "No puedes reservar una fecha pasada.",
            "error"
        );
        inputFecha.value = "";
        return;
    }
    // Separamos año, mes y día
    const partes =
        fechaSeleccionada
            .split("-")
            .map(Number);
    const fecha =
        new Date(
            partes[0],
            partes[1] - 1,
            partes[2]
        );
    // Domingo = 0
    if (fecha.getDay() === 0) {
        mostrarMensaje(
            "BarberConnect no atiende los domingos. Selecciona otra fecha.",
            "error"
        );
        inputFecha.value = "";
        return;
    }
    // Si la fecha es válida, ocultamos mensajes anteriores
    ocultarMensaje();
    // Actualizamos los horarios disponibles
    cargarHorarios();
});
//========= ENVIAR RESERVA ==================
formularioReserva.addEventListener(
    "submit",
    async (evento) => {
        // Evitamos la recarga de la página
        evento.preventDefault();
        // Validamos fecha y horario
        if (!validarFechaHora()) {
            return;
        }
        const nuevaCita = {
            nombre:
                document
                    .getElementById("nombre")
                    .value
                    .trim(),
            dni:
                document
                    .getElementById("dni")
                    .value
                    .trim(),
            telefono:
                document
                    .getElementById("telefono")
                    .value
                    .trim(),
            servicio:
                selectServicio.value,
            fecha:
                inputFecha.value,
            hora:
                inputHora.value
        };
        try {
            const respuesta =
                await fetch(
                    API_CITAS,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body:
                            JSON.stringify(
                                nuevaCita
                            )
                    }
                );
            const resultado =
                await respuesta.json();
            if (!respuesta.ok) {
                throw new Error(
                    resultado.mensaje
                );
            }
            mostrarMensaje(
                resultado.mensaje,
                "exito"
            );
            // Limpiamos el formulario
            formularioReserva.reset();
            // Eliminamos parámetros antiguos
            // de la URL sin recargar la página
            window.history.replaceState(
                {},
                document.title,
                "reservas.html"
            );
        } catch (error) {
            console.error(
                "Error al registrar la cita:",
                error
            );
            mostrarMensaje(
                error.message ||
                "No fue posible registrar la cita.",
                "error"
            );
        }
    }
);
//======== INICIAR =========
cargarServicios();
cargarHorarios();
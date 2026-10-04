// URL de la API de servicios
const API_SERVICIOS = "http://localhost:3000/api/servicios";
// Elementos del DOM
const contenedorServicios = document.getElementById("servicios-container");
const mensajeCarga = document.getElementById("mensaje-carga");
const mensajeError = document.getElementById("mensaje-error");
// Función para obtener los servicios del backend
async function obtenerServicios() {
    try {
        // Realizamos la petición GET
        const respuesta = await fetch(API_SERVICIOS);
        // Verificamos que la respuesta sea correcta
        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los servicios");
        }
        // Convertimos la respuesta a JSON
        const servicios = await respuesta.json();
        // Ocultamos el mensaje de carga
        mensajeCarga.classList.add("d-none");
        // Mostramos los servicios en la página
        mostrarServicios(servicios);
    } catch (error) {
        console.error("Error al obtener los servicios:", error);
        // Ocultamos el mensaje de carga
        mensajeCarga.classList.add("d-none");
        // Mostramos el mensaje de error
        mensajeError.classList.remove("d-none");
    }
}
// Función para crear las tarjetas de servicios
function mostrarServicios(servicios) {
    // Limpiamos el contenedor antes de agregar contenido
    contenedorServicios.innerHTML = "";
    servicios.forEach((servicio) => {
        // Columna Bootstrap
        const columna = document.createElement("div");
        columna.classList.add("col-12", "col-md-6", "col-lg-4", "col-xl-3");
        // Tarjeta
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("service-api-card");
        // Nombre del servicio
        const nombre = document.createElement("h2");
        nombre.textContent = servicio.nombre;
        // Descripción
        const descripcion = document.createElement("p");
        descripcion.textContent = servicio.descripcion;
        // Precio
        const precio = document.createElement("span");
        precio.classList.add("service-api-price");
        precio.textContent = `S/ ${servicio.precio}`;
        // Botón para reservar
        const boton = document.createElement("a");
        boton.href = `reservas.html?servicio=${encodeURIComponent(servicio.nombre)}`;
        boton.classList.add("btn", "btn-reserva");
        boton.textContent = "Reservar cita";
        // Agregamos los elementos dentro de la tarjeta
        tarjeta.appendChild(nombre);
        tarjeta.appendChild(descripcion);
        tarjeta.appendChild(precio);
        tarjeta.appendChild(boton);
        // Agregamos la tarjeta dentro de la columna
        columna.appendChild(tarjeta);
        // Agregamos la columna al contenedor principal
        contenedorServicios.appendChild(columna);
    });
}
// Ejecutamos la función al cargar la página
obtenerServicios();
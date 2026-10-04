# BarberConnect
BarberConnect es una aplicación web desarrollada como proyecto académico para la gestión de servicios y reservas de una barbería.

El sistema permite a los clientes consultar los servicios disponibles, registrar una cita y seleccionar horarios disponibles. También incluye un panel administrativo para consultar las reservas y actualizar su estado.

## Tecnologías utilizadas

### Frontend

- HTML5 semántico
- CSS3
- Bootstrap 5
- Bootstrap Icons
- JavaScript
- Manipulación del DOM
- Fetch API
- Diseño responsive

### Backend

- Node.js
- Express.js
- CORS
- API REST
- Archivos JSON como almacenamiento local

## Estructura del proyecto

```text
BarberConnect/
│
├── backend/
│   ├── controllers/
│   │   └── citasController.js
│   │
│   ├── data/
│   │   ├── citas.json
│   │   └── servicios.json
│   │
│   ├── routes/
│   │   ├── citas.js
│   │   └── servicios.js
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── assets/
│   │   └── img/
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── admin.js
│   │   ├── gestionar.js
│   │   ├── reservas.js
│   │   └── servicios.js
│   │
│   ├── admin.html
│   ├── gestionar.html
│   ├── index.html
│   ├── reservas.html
│   └── servicios.html
│
└── README.md

Requisitos
Para ejecutar el proyecto se necesita:
- Node.js instalado.
- npm instalado.
- Navegador web moderno.
El proyecto fue probado utilizando Node.js 24.
Instalación
1. Abrir una terminal.
2. Ingresar a la carpeta del backend:
cd backend

3. Instalar las dependencias:
npm install

Ejecución
Desde la carpeta backend, ejecutar:
npm run dev

El servidor se ejecutará en:
http://localhost:3000

La página principal puede abrirse desde:
http://localhost:3000/index.html

Páginas principales
Sitio público
http://localhost:3000/index.html
http://localhost:3000/servicios.html
http://localhost:3000/reservas.html

Panel administrativo
http://localhost:3000/admin.html
http://localhost:3000/gestionar.html

El panel administrativo corresponde a una implementación académica y no incluye autenticación.
API REST
La API utiliza como dirección base:
http://localhost:3000/api

Obtener servicios
Método:
GET

Ruta:
/api/servicios

Ejemplo de respuesta:
[
    {
        "id": 1,
        "nombre": "Corte de cabello",
        "descripcion": "Corte masculino personalizado según tu estilo y tipo de cabello.",
        "precio": 25
    }
]

Obtener todas las citas
Método:
GET

Ruta:
/api/citas

Ejemplo de respuesta:
[
    {
        "nombre": "Cliente Ficticio",
        "dni": "12345678",
        "telefono": "999888777",
        "servicio": "Corte de cabello",
        "fecha": "2026-10-10",
        "hora": "15:00",
        "id": 1,
        "estado": "Pendiente"
    }
]

Obtener una cita por ID
Método:
GET

Ruta:
/api/citas/:id

Ejemplo:
/api/citas/1

Consultar horarios ocupados
Método:
GET

Ruta:
/api/citas/ocupadas?fecha=2026-10-10

Ejemplo de respuesta:
{
    "fecha": "2026-10-10",
    "horasOcupadas": [
        "15:00",
        "15:30"
    ]
}

Registrar una cita
Método:
POST

Ruta:
/api/citas

Ejemplo del cuerpo enviado:
{
    "nombre": "Cliente Ficticio",
    "dni": "12345678",
    "telefono": "999888777",
    "servicio": "Corte Fade",
    "fecha": "2026-10-20",
    "hora": "16:30"
}

Ejemplo de respuesta exitosa:
{
    "mensaje": "Cita registrada correctamente",
    "cita": {
        "nombre": "Cliente Ficticio",
        "dni": "12345678",
        "telefono": "999888777",
        "servicio": "Corte Fade",
        "fecha": "2026-10-20",
        "hora": "16:30",
        "id": 1,
        "estado": "Pendiente"
    }
}

Actualizar el estado de una cita
Método:
PATCH

Ruta:
/api/citas/:id/estado

Ejemplo del cuerpo enviado:
{
    "estado": "Confirmada"
}

Los estados permitidos son:
Pendiente
Confirmada
Cancelada

Validaciones implementadas
BarberConnect incluye las siguientes validaciones:
- Todos los campos de reserva son obligatorios.
- DNI de 8 dígitos.
- Teléfono de 9 dígitos.
- No se permiten fechas anteriores al día actual.
- No se permiten reservas los domingos.
- El horario de atención es de 9:00 a.m. a 9:00 p.m.
- Los horarios se generan en intervalos de 30 minutos.
- No se muestran horarios ya reservados.
- El backend evita registrar dos citas activas en la misma fecha y hora.
- Las citas canceladas liberan nuevamente el horario.
- El formulario requiere aceptación del aviso de privacidad.
Privacidad
BarberConnect fue desarrollado utilizando únicamente datos ficticios o anonimizados.
Los datos solicitados en el formulario se utilizan únicamente para demostrar el registro y gestión de reservas dentro del proyecto académico.
No deben utilizarse datos personales reales durante las pruebas o demostraciones.
Autor
Proyecto académico desarrollado para el curso de Programación Web.
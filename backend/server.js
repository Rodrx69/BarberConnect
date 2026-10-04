// Importamos las dependencias necesarias
const express = require("express");
const cors = require("cors");

// Creamos una instancia de la aplicación Express
const app = express();

// Importamos las rutas
const serviciosRoutes = require("./routes/servicios");
const citasRoutes = require("./routes/citas");

// Middlewares
app.use(cors());
app.use(express.json());

// Frontendnpm run dev
app.use(express.static("../frontend"));

// APIs
app.use("/api/servicios", serviciosRoutes);
app.use("/api/citas", citasRoutes);

// Puerto
const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Servidor BarberConnect funcionando en puerto ${PORT}`);
});
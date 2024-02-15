import express from "express";
import cors from "cors";
import profesionalesRouter from "./routes/profesionalesRoute.js";
import establecimientoRouer from "./routes/establecimientosRoute.js";
// import usuariosRouter from "./routes/usuariosRoute.js";
import connect from "./config/db.js";
import { config } from "dotenv";
config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/profesionales", profesionalesRouter);
app.use("/establecimientos", establecimientoRouer);
// app.use("/usuarios", usuariosRouter);

// CONEXION A LA BASE DE DATOS
connect();

// SERVIDOR
const port = process.env.PORT || 3000;
app.listen(process.env.PORT, () => {
	console.log(`Servidor corriendo en el puerto ${port}!`);
});

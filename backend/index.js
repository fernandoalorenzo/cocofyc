import express from "express";
import cors from "cors";
import profesionalesRouter from "./routes/profesionalesRoute.js";
// import usersRouter from "./routes/usersRoute.js";
import connect from "./config/db.js";
import { config } from "dotenv";
config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/profesionales", profesionalesRouter);
// app.use("/users", usersRouter);

// CONEXION A LA BASE DE DATOS
connect();

// SERVIDOR
app.listen(process.env.PORT, () => {
	console.log(`Servidor corriendo en el puerto ${process.env.PORT}!`);
});

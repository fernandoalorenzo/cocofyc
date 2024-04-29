import express from "express";
import cors from "cors";
import multer from "multer";// Middleware para manejar archivos multipart/form-data
import fs, { exists } from "fs";

import profesionalesRouter from "./routes/profesionalesRoute.js";
import establecimientosRouter from "./routes/establecimientosRoute.js";
import estadosRouter from "./routes/estadosMatriculaRoute.js";
import usuariosRouter from "./routes/usuariosRoute.js";
import parametrosRoutes from "./routes/parametrosRoute.js";
import cuotasRoutes from "./routes/cuotasRoute.js";
import movimientosRoutes from "./routes/movimientosRoute.js";
import medios_de_pagoRoutes from "./routes/medios_de_pagoRoute.js";
import denunciasRouter from "./routes/denunciasRoute.js";

import connect from "./config/db.js";

import { config } from "dotenv";
config();

const app = express();
app.use(express.json());
app.use(cors());

// RUTAS
app.use("/api/profesionales", profesionalesRouter);
app.use("/api/establecimientos", establecimientosRouter);
app.use("/api/estados", estadosRouter);
app.use("/api/usuarios", usuariosRouter);
app.use("/api/usuarios/login", usuariosRouter);
app.use("/api/parametros", parametrosRoutes);
app.use("/api/cuotas", cuotasRoutes);
app.use("/api/movimientos", movimientosRoutes);
app.use("/api/mediosdepago", medios_de_pagoRoutes)
app.use("/api/denuncias", denunciasRouter);

// FUNCIONES AUTOMÁTICAS DE COMUNICACIÓN
import "./functions/birthdayEmailScript.js";
import "./functions/vencimientoCuotaEmailScript.js";
import "./functions/birthdayWspScript.js";

// FUNCION PARA RENOMBRAR EL ARCHIVO
// function saveFile(file) {
// 	const newPath = `./../frontend/public/uploads/${file.originalname}`;
// 	fs.renameSync(file.path, newPath);
// 	return newPath;
// }

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		return cb(null, "./../frontend/public/uploads");
	},
	filename: function (req, file, cb) {
		// return cb(null, `${Date.now()}_${file.originalname}`);
		return cb(null, `${file.originalname}`);
	},
});

const upload = multer({ storage });

// Ruta para subir una imagen
app.post("/api/loadimage/", upload.single("file"), (req, res) => {
	return res.send("Archivo subido");
});

// Ruta para eliminar una imagen
app.delete("/api/deleteimage/:filename", (req, res) => {
	const filename = req.params.filename;

	// Lógica para eliminar el archivo
	fs.unlink(`./../frontend/public/uploads/${filename}`, (err) => {
		if (err) {
			console.error("Error al eliminar el archivo:", err);
			return res
				.status(500)
				.json({ error: "Error al eliminar el archivo" });
		}

		console.log("Archivo eliminado correctamente");
		return res
			.status(200)
			.json({ message: "Archivo eliminado correctamente" });
	});
});

// Ruta para verificar la existencia de una imagen
app.get("/api/checkimage/:filename", (req, res) => {
    const filename = req.params.filename;

	// Verificar si el archivo existe en el sistema de archivos
	console.log("Ruta para verificar la existencia de una imagen: ", `./../frontend/public/uploads/${filename}`);
    fs.access(`./../frontend/public/uploads/${filename}`, fs.constants.F_OK, (err) => {
        if (err) {
			console.error("El archivo no existe:", err);
			return res.status(200).json({ exists: false });
        }
        console.log("El archivo existe");
        return res.status(200).json({ exists: true }); // El archivo existe
    });
});

// CONEXION A LA BASE DE DATOS
connect();

// SERVIDOR
const port = process.env.PORT || 5000;
app.listen(process.env.PORT, () => {
	console.log(`Servidor corriendo en el puerto ${port}!`);
});

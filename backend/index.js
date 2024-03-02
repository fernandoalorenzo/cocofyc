import express from "express";
import cors from "cors";
import multer from "multer";// Middleware para manejar archivos multipart/form-data
import fs from "fs";

import profesionalesRouter from "./routes/profesionalesRoute.js";
import establecimientoRouer from "./routes/establecimientosRoute.js";
import estadosRouter from "./routes/estadosMatriculaRoute.js";
import usuariosRouter from "./routes/usuariosRoute.js";

import connect from "./config/db.js";

import { config } from "dotenv";
config();

const app = express();
app.use(express.json());
app.use(cors());

// RUTAS
app.use("/api/profesionales", profesionalesRouter);
app.use("/api/establecimientos", establecimientoRouer);
app.use("/api/estados", estadosRouter);
app.use("/api/usuarios", usuariosRouter);
app.use("/api/usuarios/login", usuariosRouter);

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
	console.log(req.body);
	console.log(req.file);
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

// CONEXION A LA BASE DE DATOS
connect();

// SERVIDOR
const port = process.env.PORT || 5000;
app.listen(process.env.PORT, () => {
	console.log(`Servidor corriendo en el puerto ${port}!`);
});

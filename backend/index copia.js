import express from "express";
import cors from "cors";
import multer from "multer"; // Middleware para manejar archivos multipart/form-data
import fs, { exists } from "fs";
import path from "path"; // Importa la librería path para trabajar con rutas de archivos

import profesionalesRouter from "./routes/profesionalesRoute.js";
import establecimientosRouter from "./routes/establecimientosRoute.js";
import titularesRouter from "./routes/titularesRoute.js";
import estadosRouter from "./routes/estadosMatriculaRoute.js";
import usuariosRouter from "./routes/usuariosRoute.js";
import denunciasRouter from "./routes/denunciasRoute.js";
import archivosSeguimientosRouter from "./routes/archivosSeguimientosRoute.js";
import parametrosRouter from "./routes/parametrosRoute.js";
import cuotasRouter from "./routes/cuotasRoute.js";
import movimientosRouter from "./routes/movimientosRoute.js";
import medios_de_pagoRouter from "./routes/medios_de_pagoRoute.js";
import arancelesRouter from "./routes/arancelesRoute.js";

import connect from "./config/db.js";

// VARIABLES DE ENTORNO
import { config } from "dotenv";
config();

process.env.TZ = "America/Argentina/Buenos_Aires";

const app = express();
app.use(express.json());
app.use(cors());

// RUTAS
app.use("/api/profesionales/asignados", profesionalesRouter);
app.use("/api/profesionales", profesionalesRouter);
app.use("/api/establecimientos", establecimientosRouter);
app.use("/api/titulares", titularesRouter);
app.use("/api/estados", estadosRouter);
app.use("/api/usuarios", usuariosRouter);
app.use("/api/usuarios/login", usuariosRouter);
app.use("/api/denuncias", denunciasRouter);
app.use("/api/archivos-seguimientos", archivosSeguimientosRouter);
app.use("/api/cuotas", cuotasRouter);
app.use("/api/parametros", parametrosRouter);
app.use("/api/movimientos", movimientosRouter);
app.use("/api/mediosdepago", medios_de_pagoRouter);
app.use("/api/aranceles", arancelesRouter);


// FUNCIONES AUTOMÁTICAS DE COMUNICACIÓN
//import "./functions/birthdayEmailScript.js";
//import "./functions/vencimientoCuotaEmailScript.js";
//import "./functions/birthdayWspScript.js";

// ESTABLECE PATH PARA SUBIR ARCHIVOS
let pathUploads = null;
process.env.NODE_ENV === "production"
	? pathUploads = process.env.PROD_UPLOAD_PATH
	: pathUploads = process.env.DEV_UPLOAD_PATH,
	{ encoding: "base64" };

// FUNCION PARA RENOMBRAR EL ARCHIVO
function saveFile(file) {
	const newPath = `${pathUploads}/${file.originalname}`;
	fs.renameSync(file.path, newPath);
	return newPath;
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		return cb(null, `${pathUploads}`);
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

	fs.unlink(`${pathUploads}/${filename}`, (err) => {
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

	fs.access(
		`${pathUploads}/${filename}`,
		fs.constants.F_OK,
		(err) => {
			if (err) {
				console.error("El archivo no existe:", err);
				return res.status(200).json({ exists: false });
			}
			console.log("El archivo existe");
			return res.status(200).json({ exists: true }); // El archivo existe
		}
	);
});

// SERVE STATIC FILES
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
	// Servir archivos estáticos desde el directorio build
	app.use(express.static(path.join(__dirname, "frontend/build")));

	// Manejar todas las demás rutas
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
	});
} else {
	app.use(express.static(path.join(__dirname, "frontend")));

	// En desarrollo, manejar rutas no encontradas
	app.use((req, res, next) => {
		res.status(404).send("Sorry, can't find that!");
	});
}

// SERVIDOR
const PORT = process.env.PORT || 5000;

// CONEXION A LA BASE DE DATOS
connect();

app.listen(process.env.PORT, () => {
	console.log(`Servidor corriendo en el puerto ${PORT}!`);
});
import express from "express";
import cors from "cors";
import multer from "multer";// Middleware para manejar archivos multipart/form-data
import fs from "node:fs";

import profesionalesRouter from "./routes/profesionalesRoute.js";
import establecimientoRouer from "./routes/establecimientosRoute.js";
import estadosRouter from "./routes/estadosMatriculaRoute.js";
// import usuariosRouter from "./routes/usuariosRoute.js";

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
// app.use("/usuarios", usuariosRouter);

// Configuración de multer para manejar la carga de archivos
// const upload = multer({
// 	dest: "./../frontend/public/uploads", // Carpeta donde se guardarán los archivos subidos
// 	// dest: "uploads/", // Carpeta donde se guardarán los archivos subidos
// });

// Ruta para subir una imagen
// app.post("/api/loadimage", upload.single("image"), (req, res) => {
// 	// res.json({ filename: req.file.filename });
// 	// console.log(req.file);
// 	saveFile(req.file);
// 	res.send("ok");
// });

// Ruta para subir varias imagenes (3 en este caso)
// app.post("/api/loadimages", upload.array("images", 3), (req, res) => {
// 	// res.json({ filename: req.file.filename });
// 	// console.log(req.file);
// 	req.files.map(saveFile);
// 	res.send("ok");
// });

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
		return cb(null, `${Date.now()}_${file.originalname}`);
	},
});

const upload = multer({ storage });

app.post("/api/loadimage/", upload.single("file"), (req, res) => {
	console.log(req.body);
	console.log(req.file);
	return res.send("ok");
});

// CONEXION A LA BASE DE DATOS
connect();

// SERVIDOR
const port = process.env.PORT || 5000;
app.listen(process.env.PORT, () => {
	console.log(`Servidor corriendo en el puerto ${port}!`);
});

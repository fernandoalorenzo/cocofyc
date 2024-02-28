import express from "express";
import multer from "multer";// Middleware para manejar archivos multipart/form-data

const app = express();
const PORT = 3000;

// Configuración de multer para manejar la carga de archivos
const upload = multer({
	dest: "uploads/", // Carpeta donde se guardarán los archivos subidos
});

// Ruta para manejar la carga de archivos
app.post("/api/subir-imagen", upload.single("file"), (req, res) => {
	// req.file contiene la información del archivo subido
	// Procesa el archivo según tus necesidades aquí

	// Por ejemplo, puedes devolver una respuesta con el nombre del archivo subido
	res.json({ filename: req.file.filename });
});

app.listen(PORT, () => {
	console.log(`Servidor corriendo en el puerto ${PORT}`);
});

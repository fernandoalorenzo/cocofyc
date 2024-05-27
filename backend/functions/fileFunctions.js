import fs from "fs";

// FUNCION PARA RENOMBRAR EL ARCHIVO
export function saveFile(file) {
	const newPath = `./../../frontend/public/uploads/${file.originalname}`;
	fs.renameSync(file.path, newPath);
	return newPath;
}

// FUNCION PARA ELIMINAR EL ARCHIVO
export function deleteFile(filename) {
	fs.unlink(`./../../frontend/public/uploads/${filename}`, (err) => {
		if (err) {
			console.error("Error al eliminar el archivo:", err);
			return false;
		}
		console.log("Archivo eliminado correctamente");
		return true;
	});
}

// FUNCION PARA VERIFICAR SI EL ARCHIVO EXISTE
export function checkFile(filename, callback) {
	fs.access(
		`./../../frontend/public/uploads/${filename}`,
		fs.constants.F_OK,
		(err) => {
			if (err) {
				console.error("El archivo no existe:", err);
				callback(false);
			} else {
				console.log("El archivo existe");
				callback(true);
			}
		}
	);
}

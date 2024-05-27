import express from "express";
import {
	getArchivoById,
	getArchivosBySeguimientoId,
	agregarArchivo,
	eliminarArchivo
} from "../controllers/archivosSeguimientosController.js";
import authenticateToken from "../functions/tokenVerify.js";

const archivosSeguimientosRouter = express.Router();

// DEFINIMOS LAS RUTAS DE ARCHIVOS
archivosSeguimientosRouter.get(
	"/file/:id",
	authenticateToken,
	getArchivoById
);
archivosSeguimientosRouter.get(
	"/:id",
	authenticateToken,
	getArchivosBySeguimientoId
);
archivosSeguimientosRouter.post(
	"/",
	// authenticateToken,
	agregarArchivo
);
archivosSeguimientosRouter.delete(
	"/:id",
	authenticateToken,
	eliminarArchivo
);

export default archivosSeguimientosRouter;
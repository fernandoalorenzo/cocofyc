import express from "express";
import {
	createEstablecimiento,
	deleteEstablecimiento,
	getEstablecimientoById,
	getEstablecimientos,
	updateEstablecimiento,
	getEstablecimientosAsignados,
	asignarEstablecimiento,
	desvincularEstablecimiento
} from "../controllers/establecimientosController.js";
import authenticateToken from "../functions/tokenVerify.js";

const establecimientosRouter = express.Router();

// DEFINIMOS LAS RUTAS
establecimientosRouter.get("/", authenticateToken, getEstablecimientos);
establecimientosRouter.get("/:id", authenticateToken, getEstablecimientoById);
establecimientosRouter.post("/", authenticateToken, createEstablecimiento);
establecimientosRouter.put("/:id", authenticateToken, updateEstablecimiento);
establecimientosRouter.delete("/:id", authenticateToken, deleteEstablecimiento);

// Ruta para obtener los establecimientos asignados a un profesional específico
establecimientosRouter.get("/asignados/:id", getEstablecimientosAsignados);

// Ruta para asignar un establecimiento a un profesional
establecimientosRouter.post(
	"/asignar-establecimiento",
	authenticateToken,
	asignarEstablecimiento
);

// Ruta para desvincular un establecimiento de un profesional
establecimientosRouter.delete(
	"/desvincular-establecimiento/:profesionalId/:establecimientoId",
	authenticateToken,
	desvincularEstablecimiento
);

export default establecimientosRouter;

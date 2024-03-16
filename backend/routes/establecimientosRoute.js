import express from "express";
import {
	createEstablecimiento,
	deleteEstablecimiento,
	getEstablecimientoById,
	getEstablecimientos,
	updateEstablecimiento,
	getEstablecimientosAsignados,
} from "../controllers/establecimientosController.js";
// import { getEstablecimientosAsignados } from "../controllers/establecimientosAsignadosController.js";
import authenticateToken from "../functions/tokenVerify.js";

const establecimientosRouter = express.Router();

// DEFINIMOS LAS RUTAS
establecimientosRouter.get("/", authenticateToken, getEstablecimientos);
// establecimientosRouter.get("/", getEstablecimientos);
establecimientosRouter.get("/:id", authenticateToken, getEstablecimientoById);
// establecimientosRouter.get("/:id", getEstablecimientoById);
establecimientosRouter.post("/", authenticateToken, createEstablecimiento);
// establecimientosRouter.post("/", createEstablecimiento);
establecimientosRouter.put("/:id", authenticateToken, updateEstablecimiento);
// establecimientosRouter.put("/:id", updateEstablecimiento);
establecimientosRouter.delete("/:id", authenticateToken, deleteEstablecimiento);
// establecimientosRouter.delete("/:id", deleteEstablecimiento);

// Ruta para obtener los establecimientos asignados a un profesional específico
// establecimientosRouter.get("/asignados/:id", authenticateToken, getEstablecimientosAsignados);
establecimientosRouter.get("/asignados/:id", getEstablecimientosAsignados);

export default establecimientosRouter;

import express from "express";
import {
	createEstablecimiento,
	deleteEstablecimiento,
	getEstablecimientoById,
	getEstablecimientos,
	updateEstablecimiento,
} from "../controllers/establecimientosController.js";
import authenticateToken from "../functions/tokenVerify.js";

const establecimientosRouter = express.Router();

// DEFINIMOS LAS RUTAS
// establecimientosRouter.get("/", authenticateToken, getEstablecimientos);
establecimientosRouter.get("/", getEstablecimientos);
// establecimientosRouter.get("/:id", authenticateToken, getEstablecimientoById);
establecimientosRouter.get("/:id", getEstablecimientoById);
// establecimientosRouter.post("/", authenticateToken, createEstablecimiento);
establecimientosRouter.post("/", createEstablecimiento);
// establecimientosRouter.put("/:id", authenticateToken, updateEstablecimiento);
establecimientosRouter.put("/:id", updateEstablecimiento);
// establecimientosRouter.delete("/:id", authenticateToken, deleteEstablecimiento);
establecimientosRouter.delete("/:id", deleteEstablecimiento);

export default establecimientosRouter;

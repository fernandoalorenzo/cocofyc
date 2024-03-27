import express from "express";
import {
	createEstado,
	deleteEstado,
	getEstadoById,
	getEstados,
	updateEstado,
} from "../controllers/estadosMatriculaController.js";
import authenticateToken from "../functions/tokenVerify.js";

const estadosRouter = express.Router();

// DEFINIMOS LAS RUTAS
estadosRouter.get("/", authenticateToken, getEstados);
estadosRouter.get("/:id", authenticateToken, getEstadoById);
estadosRouter.post("/", authenticateToken, createEstado);
estadosRouter.put("/:id", authenticateToken, updateEstado);
estadosRouter.delete("/:id", authenticateToken, deleteEstado);

// estadosRouter.get("/", getEstados);
// estadosRouter.get("/:id", getEstadoById);
// estadosRouter.post("/", createEstado);
// estadosRouter.put("/:id", updateEstado);
// estadosRouter.delete("/:id", deleteEstado);

export default estadosRouter;

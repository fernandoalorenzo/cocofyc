import express from "express";
import {
	createTitular,
	deleteTitular,
	getTitularById,
	getTitularByDNI,
	getTitulares,
	updateTitular,
} from "../controllers/titularesController.js";

import authenticateToken from "../functions/tokenVerify.js";

const titularesRouter = express.Router();

///////////////////// RUTAS ESPECIFICAS /////////////////////
// Ruta para titulares
	titularesRouter.get("/:id", authenticateToken, getTitularById);
// Ruta para obtener un titular por DNI
	titularesRouter.get("/dni/:dni", authenticateToken, getTitularByDNI);
// Ruta para obtener todos los titulares
	titularesRouter.get("/", authenticateToken, getTitulares);
// Ruta para crear titulares
	titularesRouter.post("/", authenticateToken, createTitular);
// Ruta para actualizar un titular
	titularesRouter.patch("/:id", authenticateToken, updateTitular);
// Ruta para eliminar un titular
	titularesRouter.delete("/:id", authenticateToken, deleteTitular);

export default titularesRouter;
import express from "express";
import {
	createProfesional,
	deleteProfesional,
	getProfesionalById,
	getProfesionales,
	updateProfesional,
} from "../controllers/profesionalController.js";
import authenticateToken from "../functions/tokenVerify.js";

const profesionalesRouter = express.Router();

// DEFINIMOS LAS RUTAS
// profesionalesRouter.get("/", authenticateToken, getProfesionales);
profesionalesRouter.get("/", getProfesionales);
// profesionalesRouter.get("/:id", authenticateToken, getProfesionalById);
profesionalesRouter.get("/:id", getProfesionalById);
// profesionalesRouter.post("/", authenticateToken, createProfesional);
profesionalesRouter.post("/", createProfesional);
// profesionalesRouter.put("/:id", authenticateToken, updateProfesional);
profesionalesRouter.put("/:id", updateProfesional);
// profesionalesRouter.delete("/:id", authenticateToken, deleteProfesional);
profesionalesRouter.delete("/:id", deleteProfesional);

export default profesionalesRouter;

import express from "express";
import {
	createProfesional,
	deleteProfesional,
	getProfesionalById,
	getProfesionals,
	updateProfesional,
} from "../controllers/profesionalController.js";
import authenticateToken from "../functions/tokenVerify.js";

const profesionalesRouter = express.Router();

// DEFINIMOS LAS RUTAS
profesionalesRouter.get("/", authenticateToken, getProfesionals);
profesionalesRouter.get("/:id", authenticateToken, getProfesionalById);
profesionalesRouter.post("/", authenticateToken, createProfesional);
profesionalesRouter.put("/:id", authenticateToken, updateProfesional);
profesionalesRouter.delete("/:id", authenticateToken, deleteProfesional);

export default profesionalesRouter;

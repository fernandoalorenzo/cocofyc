import express from "express";
import {
	createMatricula,
	deleteMatricula,
	getMatriculaById,
	getMatriculaByMatricula,
	getMatriculas,
	patchMatricula,
} from "../controllers/matriculasController.js";
import { getMatriculasGeneradasById, getMatriculasGeneradasByProfesional } from "../controllers/profesionalesMatriculasController.js";
import authenticateToken from "../functions/tokenVerify.js";

const matriculasRouter = express.Router();

// DEFINIMOS LAS RUTAS
matriculasRouter.get("/matriculas-generadas/:id", authenticateToken, getMatriculasGeneradasById);
matriculasRouter.get("/matriculas-generadas-profesional/:id",authenticateToken, getMatriculasGeneradasByProfesional);
matriculasRouter.get("/:matricula",authenticateToken, getMatriculaByMatricula);
matriculasRouter.post("/", authenticateToken, createMatricula);
matriculasRouter.delete("/:id", authenticateToken, deleteMatricula);
matriculasRouter.get("/:id", authenticateToken, getMatriculaById);
matriculasRouter.get("/", authenticateToken, getMatriculas);
matriculasRouter.patch("/:id", authenticateToken, patchMatricula);

// matriculasRouter.get("/matriculas-generadas/:id", getMatriculasGeneradasById);
// matriculasRouter.get("/matriculas-generadas-profesional/:id", getMatriculasGeneradasByProfesional);
// matriculasRouter.get("/:matricula", getMatriculaByMatricula);
// matriculasRouter.post("/", createMatricula);
// matriculasRouter.delete("/:id", deleteMatricula);
// matriculasRouter.get("/:id", getMatriculaById);
// matriculasRouter.get("/", getMatriculas);
// matriculasRouter.patch("/:id", patchMatricula);

export default matriculasRouter;

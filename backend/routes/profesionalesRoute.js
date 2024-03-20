import express from "express";
import {
	createProfesional,
	deleteProfesional,
	getProfesionalById,
	getProfesionalByDNI,
	getProfesionales,
	updateProfesional,
	patchProfesional,
	getProfesionalesAsignados,
	asignarProfesional,
	desvincularProfesional,
	getProfesionalesActivos,
} from "../controllers/profesionalesController.js";
import { generarProfesionalesMatriculas } from "../controllers/profesionalesMatriculasController.js";
import authenticateToken from "../functions/tokenVerify.js";

const profesionalesRouter = express.Router();

// DEFINIMOS LAS RUTAS
profesionalesRouter.get("/activos", authenticateToken, getProfesionalesActivos);
profesionalesRouter.get("/:id", authenticateToken, getProfesionalById);
profesionalesRouter.get("/dni/:dni", authenticateToken, getProfesionalByDNI);
profesionalesRouter.get("/", authenticateToken, getProfesionales);
profesionalesRouter.post("/", authenticateToken, createProfesional);
profesionalesRouter.put("/:id", authenticateToken, updateProfesional);
profesionalesRouter.delete("/:id", authenticateToken, deleteProfesional);
profesionalesRouter.patch("/:id", authenticateToken, patchProfesional);

// profesionalesRouter.get("/activos/", getProfesionalesActivos);
// profesionalesRouter.get("/:id", getProfesionalById);
// profesionalesRouter.get("/dni/:dni", getProfesionalByDNI);
// profesionalesRouter.get("/", getProfesionales);
// profesionalesRouter.post("/", createProfesional);
// profesionalesRouter.put("/:id", updateProfesional);
// profesionalesRouter.delete("/:id", deleteProfesional);
// profesionalesRouter.patch("/:id", patchProfesional);

// Ruta para obtener los profesionales asignados a un establecimiento específico
profesionalesRouter.get("/asignados/:id", authenticateToken, 			getProfesionalesAsignados);

// Ruta para asignar un profesional a un establecimiento
profesionalesRouter.post(
	"/asignar-profesional",
	authenticateToken,
	asignarProfesional
	);
	
// Ruta para desvincular un profesional de un establecimiento
profesionalesRouter.delete(
	"/desvincular-profesional/:profesionalId/:establecimientoId",
	authenticateToken,
	desvincularProfesional
);
	
profesionalesRouter.post(
	"/generar-matriculas/",
	authenticateToken,
	generarProfesionalesMatriculas
);
		
export default profesionalesRouter;		
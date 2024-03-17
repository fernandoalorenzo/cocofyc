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
} from "../controllers/profesionalesController.js";
import authenticateToken from "../functions/tokenVerify.js";

const profesionalesRouter = express.Router();

// DEFINIMOS LAS RUTAS
profesionalesRouter.get("/", authenticateToken, getProfesionales);
// profesionalesRouter.get("/", getProfesionales);
profesionalesRouter.get("/:id", authenticateToken, getProfesionalById);
// profesionalesRouter.get("/:id", getProfesionalById);
profesionalesRouter.get("/dni/:dni", authenticateToken, getProfesionalByDNI);
// profesionalesRouter.get("/dni/:dni", getProfesionalByDNI);
profesionalesRouter.post("/", authenticateToken, createProfesional);
// profesionalesRouter.post("/", createProfesional);
profesionalesRouter.put("/:id", authenticateToken, updateProfesional);
// profesionalesRouter.put("/:id", updateProfesional);
profesionalesRouter.delete("/:id", authenticateToken, deleteProfesional);
// profesionalesRouter.delete("/:id", deleteProfesional);
profesionalesRouter.patch("/:id", authenticateToken, patchProfesional);
// profesionalesRouter.patch("/:id", patchProfesional);

// Ruta para obtener los profesionales asignados a un establecimiento específico
profesionalesRouter.get("/asignados/:id", getProfesionalesAsignados);

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

export default profesionalesRouter;

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
	getProfesionalesBirthDay,
} from "../controllers/profesionalesController.js";

import {
	generarProfesionalesCuotas,
	getCuotasGeneradasById,
	getCuotasGeneradasByProfesional,
	generarProfesionalesCuota,
	asignarMovimientoACuota,
	getProfesionalesMorosos,
	getProfesionalesAlDia,
} from "../controllers/profesionalesCuotasController.js";

import authenticateToken from "../functions/tokenVerify.js";

const profesionalesRouter = express.Router();

// DEFINIMOS LAS RUTAS

// Ruta para obtener profesionales que estan activos 
profesionalesRouter.get("/activos", authenticateToken, getProfesionalesActivos);

// Ruta para obtener profesionales que adeudan cuotas
profesionalesRouter.get(
	"/profesionales-morosos/",
	authenticateToken,
	getProfesionalesMorosos
);

// Ruta para obtener profesionales que estan al dia con cuotas
profesionalesRouter.get(
	"/profesionales-aldia/",
	authenticateToken,
	getProfesionalesAlDia
);

// Ruta para obtener un profesional por cumpleaños
profesionalesRouter.get("/:mes/:dia", getProfesionalesBirthDay);

// Ruta para profesionales
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
profesionalesRouter.get(
	"/asignados/:id",
	authenticateToken,
	getProfesionalesAsignados
);

// Ruta para asignar un profesional a un establecimiento
profesionalesRouter.post(
	"/asignar-profesional",
	authenticateToken,
	asignarProfesional
);

// Ruta para asignar un movimiento a una cuota
profesionalesRouter.patch(
	"/asignar-movimiento-a-cuota/:id_cuota/:id_movimiento",
	authenticateToken,
	asignarMovimientoACuota
);

// Ruta para desvincular un profesional de un establecimiento
profesionalesRouter.delete(
	"/desvincular-profesional/:profesionalId/:establecimientoId",
	authenticateToken,
	desvincularProfesional
);

// Ruta para generar cuotas a todos los profesionales activos
profesionalesRouter.post(
	"/generar-cuotas/",
	authenticateToken,
	generarProfesionalesCuotas
);

// Ruta para generar una cuota a un profesional
profesionalesRouter.post(
	"/generar-cuota/",
	authenticateToken,
	generarProfesionalesCuota
);

// Ruta para obtener las cuotas generadas por un id de una cuota
profesionalesRouter.get(
	"/cuotas-generadas/:id",
	authenticateToken,
	getCuotasGeneradasById
);

// Ruta para obtener las cuotas generadas por un id de un profesional
profesionalesRouter.get(
	"/cuotas-generadas-profesional/:id",
	authenticateToken,
	getCuotasGeneradasByProfesional
);

export default profesionalesRouter;

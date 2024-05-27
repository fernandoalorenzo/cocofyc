import express from "express";
import {
	createCuota,
	deleteCuota,
	getCuotaById,
	getCuotaByCuota,
	getCuotas,
	patchCuota,
} from "../controllers/cuotasController.js";
import { getCuotasGeneradasById, getCuotasGeneradasByProfesional } from "../controllers/profesionalesCuotasController.js";
import authenticateToken from "../functions/tokenVerify.js";

const cuotasRouter = express.Router();

// DEFINIMOS LAS RUTAS
cuotasRouter.get("/cuotas-generadas/:id", authenticateToken, getCuotasGeneradasById);
cuotasRouter.get("/cuotas-generadas-profesional/:id",authenticateToken, getCuotasGeneradasByProfesional);
cuotasRouter.get("/cuota/:cuota",authenticateToken, getCuotaByCuota);
cuotasRouter.post("/", authenticateToken, createCuota);
cuotasRouter.delete("/:id", authenticateToken, deleteCuota);
cuotasRouter.get("/:id", authenticateToken, getCuotaById);
cuotasRouter.get("/", authenticateToken, getCuotas);
cuotasRouter.patch("/:id", authenticateToken, patchCuota);

// cuotasRouter.get("/cuotas-generadas/:id", getCuotasGeneradasById);
// cuotasRouter.get("/cuotas-generadas-profesional/:id", getCuotasGeneradasByProfesional);
// cuotasRouter.get("/cuota/:cuota", getCuotaByCuota);
// cuotasRouter.post("/", createCuota);
// cuotasRouter.delete("/:id", deleteCuota);
// cuotasRouter.get("/:id", getCuotaById);
// cuotasRouter.get("/", getCuotas);
// cuotasRouter.patch("/:id", patchCuota);

export default cuotasRouter;
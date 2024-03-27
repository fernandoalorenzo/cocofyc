import express from "express";
import {
	createMovimiento,
	deleteMovimiento,
	getMovimientoById,
	getMovimientos,
	updateMovimiento,
	patchMovimiento,
	getMovimientosByProfesionalId,
} from "../controllers/movimientosController.js";
import authenticateToken from "../functions/tokenVerify.js";

const movimientosRouter = express.Router();

// DEFINIMOS LAS RUTAS
movimientosRouter.get("/:id", authenticateToken, getMovimientoById);
movimientosRouter.get("/", authenticateToken, getMovimientos);
movimientosRouter.post("/", authenticateToken, createMovimiento);
movimientosRouter.put("/:id", authenticateToken, updateMovimiento);
movimientosRouter.delete("/:id", authenticateToken, deleteMovimiento);
movimientosRouter.patch("/:id", authenticateToken, patchMovimiento);
movimientosRouter.get("/profesional/:idProfesional",authenticateToken, getMovimientosByProfesionalId);

// movimientosRouter.get("/:id", getMovimientoById);
// movimientosRouter.get("/", getMovimientos);
// movimientosRouter.post("/", createMovimiento);
// movimientosRouter.put("/:id", updateMovimiento);
// movimientosRouter.delete("/:id", deleteMovimiento);
// movimientosRouter.patch("/:id", patchMovimiento);
// movimientosRouter.get("/profesional/:idProfesional", getMovimientosByProfesionalId);

export default movimientosRouter;
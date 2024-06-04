import express from "express";
import {
	createMovimiento,
	deleteMovimiento,
	getMovimientoById,
	getMovimientoByArancel,
	getMovimientos,
	updateMovimiento,
	patchMovimiento,
	getMovimientosByProfesionalId,
} from "../controllers/movimientosController.js";
import authenticateToken from "../functions/tokenVerify.js";

const movimientosRouter = express.Router();

// DEFINIMOS LAS RUTAS
movimientosRouter.get("/arancel/:id", authenticateToken, getMovimientoByArancel);
movimientosRouter.get("/:id", authenticateToken, getMovimientoById);
movimientosRouter.get("/", authenticateToken, getMovimientos);
movimientosRouter.post("/", authenticateToken, createMovimiento);
movimientosRouter.put("/:id", authenticateToken, updateMovimiento);
movimientosRouter.delete("/:id", authenticateToken, deleteMovimiento);
movimientosRouter.patch("/:id", authenticateToken, patchMovimiento);
movimientosRouter.get("/profesional/:idProfesional",authenticateToken, getMovimientosByProfesionalId);

export default movimientosRouter;
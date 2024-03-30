import express from "express";
import {
	createDenuncia,
	deleteDenuncia,
	getDenunciaById,
	getDenuncias,
	updateDenuncia,
	getSeguimientosByDenunciaId,
	getSeguimientoById,
	agregarSeguimiento,
	modificarSeguimiento,
	eliminarSeguimiento
} from "../controllers/denunciasController.js";
import authenticateToken from "../functions/tokenVerify.js";

const denunciasRouter = express.Router();

// DEFINIMOS LAS RUTAS DE DENUNCIA
denunciasRouter.post("/", authenticateToken, createDenuncia);
denunciasRouter.get("/", authenticateToken, getDenuncias);
denunciasRouter.get("/:id", authenticateToken, getDenunciaById);
denunciasRouter.put("/:id", authenticateToken, updateDenuncia);
denunciasRouter.delete("/:id", authenticateToken, deleteDenuncia);

// RUTAS DE SEGUIMIENTOS
denunciasRouter.get("/seguimientos/:id", authenticateToken, getSeguimientosByDenunciaId);
denunciasRouter.get("/seguimiento/:id", authenticateToken, getSeguimientoById);
denunciasRouter.post("/seguimiento/:id", authenticateToken, agregarSeguimiento);
denunciasRouter.put("/seguimiento/:id", authenticateToken, modificarSeguimiento);
denunciasRouter.delete("/seguimiento/:id", authenticateToken, eliminarSeguimiento);

// denunciasRouter.delete("/:id", deleteDenuncia);
// denunciasRouter.get("/", getDenuncias);
// denunciasRouter.get("/:id", getDenunciaById);
// denunciasRouter.post("/", createDenuncia);
// denunciasRouter.put("/:id", updateDenuncia);

// denunciasRouter.get("/seguimientos/:id", getSeguimientosByDenunciaId);
// denunciasRouter.get("/seguimiento/:id", getSeguimientoById);
// denunciasRouter.post("/seguimiento/:id", agregarSeguimiento);
// denunciasRouter.put("/seguimiento/:id", modificarSeguimiento);
// denunciasRouter.delete("/seguimiento/:id", eliminarSeguimiento);

export default denunciasRouter;

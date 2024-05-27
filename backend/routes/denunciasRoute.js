import express from "express";
import {
	createDenuncia,
	deleteDenuncia,
	getDenunciaById,
	getDenunciaByIdProfesional,
	getDenuncias,
	updateDenuncia,
	getSeguimientosByDenunciaId,
	getSeguimientoById,
	agregarSeguimiento,
	modificarSeguimiento,
	eliminarSeguimiento,
} from "../controllers/denunciasController.js";
import authenticateToken from "../functions/tokenVerify.js";

const denunciasRouter = express.Router();

// DEFINIMOS LAS RUTAS DE DENUNCIA
denunciasRouter.post("/", authenticateToken, createDenuncia);
denunciasRouter.get("/", authenticateToken, getDenuncias);
denunciasRouter.get("/:id", authenticateToken, getDenunciaById);
denunciasRouter.get("/profesional/:profesional_id", authenticateToken, getDenunciaByIdProfesional);
denunciasRouter.put("/:id", authenticateToken, updateDenuncia);
denunciasRouter.delete("/:id", authenticateToken, deleteDenuncia);

// DEFINIMOS LAS RUTAS DE SEGUIMIENTOS
denunciasRouter.get("/seguimientos/:id", authenticateToken, getSeguimientosByDenunciaId);
denunciasRouter.get("/seguimiento/:id", authenticateToken, getSeguimientoById);
denunciasRouter.post("/seguimiento/:id", authenticateToken, agregarSeguimiento);
denunciasRouter.put("/seguimiento/:id", authenticateToken, modificarSeguimiento);
denunciasRouter.delete("/seguimiento/:id", authenticateToken, eliminarSeguimiento);

export default denunciasRouter;
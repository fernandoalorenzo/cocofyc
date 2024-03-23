import express from "express";
import {
	createMedio,
	deleteMedio,
	getMedioById,
	getMedios,
	patchMedio,
} from "../controllers/medios_de_pagoController.js";
import authenticateToken from "../functions/tokenVerify.js";

const medios_de_pagoRouter = express.Router();

// DEFINIMOS LAS RUTAS
medios_de_pagoRouter.post("/", authenticateToken, createMedio);
medios_de_pagoRouter.delete("/:id", authenticateToken, deleteMedio);
medios_de_pagoRouter.get("/:id", authenticateToken, getMedioById);
medios_de_pagoRouter.get("/", authenticateToken, getMedios);
medios_de_pagoRouter.patch("/:id", authenticateToken, patchMedio);

// medios_de_pagoRouter.post("/", createMedio);
// medios_de_pagoRouter.delete("/:id", deleteMedio);
// medios_de_pagoRouter.get("/:id", getMedioById);
// medios_de_pagoRouter.get("/", getMedios);
// medios_de_pagoRouter.patch("/:id", patchMedio);

export default medios_de_pagoRouter;

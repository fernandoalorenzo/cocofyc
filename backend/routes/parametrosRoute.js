import express from "express";
import {
	createParametro,
	getParametroById,
	getParametros,
	patchParametro,
	getParametroSinToken,
} from "../controllers/parametrosController.js";
import authenticateToken from "../functions/tokenVerify.js";

const parametrosRouter = express.Router();

// DEFINIMOS LAS RUTAS
// parametrosRouter.get("/", authenticateToken, getParametros);
// parametrosRouter.get("/:id", authenticateToken, getParametroById);
// parametrosRouter.post("/", authenticateToken, createParametro);
// parametrosRouter.patch("/:id", authenticateToken, patchParametro);

parametrosRouter.get("/", getParametros);
parametrosRouter.get("/:id", getParametroById);
parametrosRouter.get("/sinToken/:id", getParametroSinToken);
parametrosRouter.post("/", createParametro);
parametrosRouter.patch("/:id", patchParametro);

export default parametrosRouter;

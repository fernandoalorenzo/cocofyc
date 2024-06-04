import express from "express";
import {
	createArancel,
	deleteArancel,
	getArancelById,
	getAranceles,
	patchArancel,
} from "../controllers/arancelesController.js";
import authenticateToken from "../functions/tokenVerify.js";

const arancelesRouter = express.Router();

// DEFINIMOS LAS RUTAS
arancelesRouter.post("/", authenticateToken, createArancel);
arancelesRouter.delete("/:id", authenticateToken, deleteArancel);
arancelesRouter.get("/:id", authenticateToken, getArancelById);
arancelesRouter.get("/", authenticateToken, getAranceles);
arancelesRouter.patch("/:id", authenticateToken, patchArancel);

export default arancelesRouter;

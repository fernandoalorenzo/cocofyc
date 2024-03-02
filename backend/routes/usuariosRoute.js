import express from "express";
import {
	createUsuario,
	deleteUsuario,
	getUsuarioById,
	getUsuarios,
	updateUsuario,
	loginUsuario,
	validatePassword,
	updatePassword,
} from "../controllers/usuariosController.js";
import authenticateToken from "../functions/tokenVerify.js";

const usuariosRouter = express.Router();

usuariosRouter.get("/", getUsuarios);
usuariosRouter.get("/:id", getUsuarioById);
usuariosRouter.post("/", createUsuario);
usuariosRouter.put("/:id", updateUsuario);
usuariosRouter.delete("/:id", deleteUsuario);
usuariosRouter.post("/login", loginUsuario);
usuariosRouter.post("/validate-password/:id", validatePassword);
usuariosRouter.put("/update-password/:id", updatePassword);

export default usuariosRouter;

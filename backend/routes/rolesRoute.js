import express from "express";
import {
	createRol,
	deleteRol,
	getRolById,
	getRoles,
	updateRol,
} from "../controllers/rolesController.js";
import authenticateToken from "../functions/tokenVerify.js";

const rolesRouter = express.Router();

rolesRouter.get("/", getRoles);
rolesRouter.get("/:id", getRolById);
rolesRouter.post("/", createRol);
rolesRouter.put("/:id", updateRol);
rolesRouter.delete("/:id", deleteRol);

export default rolesRouter;

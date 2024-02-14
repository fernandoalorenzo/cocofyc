import express from "express";

import {
	createUser,
	deleteUser,
	getUserById,
	getUsers,
	updateUser,
	loginUser,
	validatePassword,
	updatePassword,
} from "../controllers/userController.js";

const usersRouter = express.Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:id", getUserById);
usersRouter.post("/", createUser);
usersRouter.put("/:id", updateUser);
usersRouter.delete("/:id", deleteUser);
usersRouter.post("/login", loginUser);
usersRouter.post("/validate-password/:id", validatePassword);
usersRouter.put("/update-password/:id", updatePassword);

export default usersRouter;

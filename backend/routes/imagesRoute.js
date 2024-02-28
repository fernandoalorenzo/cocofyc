import express from "express";
import {
	createImage,
	deleteImage,
	getImageById,
	getImages,
	updateImage,
} from "../controllers/imagesController.js";
import authenticateToken from "../functions/tokenVerify.js";

const imagesRouter = express.Router();

// DEFINIMOS LAS RUTAS
// imagesRouter.get("/", authenticateToken, getImages);
imagesRouter.get("/", getImages);
// imagesRouter.get("/:id", authenticateToken, getImageById);
imagesRouter.get("/:id", getImageById);
// imagesRouter.post("/", authenticateToken, createImage);
imagesRouter.post("/", createImage);
// imagesRouter.put("/:id", authenticateToken, updateImage);
imagesRouter.put("/:id", updateImage);
// imagesRouter.delete("/:id", authenticateToken, deleteImage);
imagesRouter.delete("/:id", deleteImage);

export default imagesRouter;

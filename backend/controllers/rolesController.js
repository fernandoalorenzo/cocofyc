import Rol from "../models/rolesModel.js";
import authenticateToken from "../functions/tokenVerify.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "dotenv";
config();

// Crear un nuevo rol
const createRol = async (request, response) => {
	authenticateToken(request, response, async () => {
		console.log(request.body);
		try {
			const rol = await Rol.create({
				...request.body,
			});
			response.status(201).json({
				message: "El rol fue creado exitosamente!",
				data: rol,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener todos los roles
const getRoles = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const roles = await Rol.findAll(request.body);

			response.status(201).json({
				message: "El listado de roles fue creado exitosamente!",
				data: roles,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener un rol por Id
const getRolById = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const id = request.params.id;
			const user = await Rol.findOne({ where: { id: id } });

			response.status(201).json({
				message: "Los datos del rol fueron obtenidos exitosamente!",
				data: user,
			});
		} catch (error) {
			console.log(error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Actualizar roles
const updateRol = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const { id } = request.params;
			const updateData = request.body; 

			const result = await Rol.update(updateData, {
				where: { id: id },
			});

			if (!result) {
				return response
					.status(404)
					.json({ message: "El rol no fue encontrado!" });
			}
			return response
				.status(200)
				.json({ message: "El rol fue actualizado exitosamente!" });
		} catch (error) {
			console.log(error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Eliminar un rol
const deleteRol = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const { id } = request.params;
			const result = await Rol.destroy({
				where: { id: id },
			});

			if (!result) {
				return response
					.status(404)
					.json({ message: "El rol no fue encontrado!" });
			}
			return response
				.status(200)
				.json({ message: "El rol fue eliminado exitosamente!" });
		} catch (error) {
			console.log(error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Exportamos todas las rutas
export {
	createRol,
	getRoles,
	getRolById,
	updateRol,
	deleteRol
};

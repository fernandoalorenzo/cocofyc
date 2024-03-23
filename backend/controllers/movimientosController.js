import Movimiento from "../models/movimientosModel.js";
import authenticateToken from "../functions/tokenVerify.js";
import { config } from "dotenv";
config();

// Crear un nuevo movimiento
const createMovimiento = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const nuevoMovimiento = await Movimiento.create(request.body);

			response.status(201).json({
				message: "El movimiento fue creado exitosamente!",
				data: nuevoMovimiento,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener todos los movimientos
const getMovimientos = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const movimientos = await Movimiento.findAll(request.body);

			response.status(201).json({
				message: "El listado de movimientos fue creado exitosamente!",
				data: movimientos,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener un movimiento por Id
const getMovimientoById = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const movimiento = await Movimiento.findOne({
				where: { id: id },
			});

			response.status(201).json({
				message:
					"Los datos del movimiento fueron obtenidos exitosamente!",
				data: movimiento,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Actualizar movimientos
const updateMovimiento = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const movimientoUpdate = await Movimiento.update(request.body, {
				where: { id: id },
			});

			response.status(201).json({
				message: "El movimiento fue actualizado exitosamente!",
				data: movimientoUpdate,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Eliminar un movimiento
const deleteMovimiento = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const movimientoDelete = await Movimiento.destroy({
				where: { id: id },
			});

			response.status(201).json({
				message: "El movimiento fue eliminado exitosamente!",
				data: movimientoDelete,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Actualizar un movimiento
const patchMovimiento = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		const fieldsToUpdate = request.body;
		try {
			const movimiento = await Movimiento.findByPk(id);

			if (!movimiento) {
				return response
					.status(404)
					.json({ message: "Movimiento no encontrado." });
			}

			// Actualizar solo el campo 'nombre'
			await movimiento.update(fieldsToUpdate);

			response.status(201).json({
				message: "El movimiento fue actualizado exitosamente!",
				data: movimiento,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

export {
	createMovimiento,
	getMovimientos,
	getMovimientoById,
	updateMovimiento,
	deleteMovimiento,
	patchMovimiento,
};

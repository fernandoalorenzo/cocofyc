import Cuota from "../models/cuotasModel.js";
import authenticateToken from "../functions/tokenVerify.js";
import { config } from "dotenv";
config();

// Crear un nueva cuota
const createCuota = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const nuevaCuota = await Cuota.create(request.body);

			response.status(201).json({
				message: "La cuota fue creada exitosamente!",
				data: nuevaCuota,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener todas los cuotas
const getCuotas = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const cuotas = await Cuota.findAll(request.body);

			response.status(201).json({
				message: "El listado de cuotas fue creado exitosamente!",
				data: cuotas,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener cuota por Id
const getCuotaById = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const cuota = await Cuota.findOne({ where: { id: id } });

			response.status(201).json({
				message:
					"Los datos de la cuota fueron obtenidos exitosamente!",
				data: cuota,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

const getCuotaByCuota = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const cuota = request.params.cuota;
			const cuotasGeneradas = await Cuota.findAll({
				where: { cuota: cuota },
			});
			response.status(200).json({ data: cuotasGeneradas });
		} catch (error) {
			console.error(
				"Error al obtener las cuotas:",
				error.message
			);
			response.status(500).json({
				message:
					"Error al obtener las cuotas.",
			});
		}
	});
};

// Actualizar cuotas
const updateCuota = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const cuotaUpdate = await Cuota.update(request.body, {
				where: { id: id },
			});

			response.status(201).json({
				message: "La cuota fue actualizada exitosamente!",
				data: cuotaUpdate,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Eliminar una cuota
const deleteCuota = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const cuotaDelete = await Cuota.destroy({
				where: { id: id },
			});

			response.status(201).json({
				message: "La cuota fue eliminada exitosamente!",
				data: cuotaDelete,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Actualizar cuota
const patchCuota = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		const fieldsToUpdate = request.body;
		try {
			const cuota = await Cuota.findByPk(id);

			if (!cuota) {
				return response
					.status(404)
					.json({ message: "Cuota no encontrada." });
			}

			// Actualizar solo el campo 'nombre'
			await cuota.update(fieldsToUpdate);

			response.status(201).json({
				message: "La cuota fue actualizada exitosamente!",
				data: cuota,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Exportamos todas las rutas
export {
	createCuota,
	getCuotas,
	getCuotaById,
	getCuotaByCuota,
	updateCuota,
	deleteCuota,
	patchCuota,
};

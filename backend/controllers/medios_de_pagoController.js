import MedioDePago from "../models/medios_de_pagoModel.js";
import authenticateToken from "../functions/tokenVerify.js";
import { config } from "dotenv";
config();

// Crear un nueva medio
const createMedio = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const nuevaMedio = await MedioDePago.create(request.body);

			response.status(201).json({
				message: "La medio fue creada exitosamente!",
				data: nuevaMedio,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener todas los medios
const getMedios = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const medios = await MedioDePago.findAll(request.body);

			response.status(201).json({
				message: "El listado de medios fue creado exitosamente!",
				data: medios,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener medio por Id
const getMedioById = async (request, response) => {
	console.log("ID: " + request.params.id);
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const medio = await MedioDePago.findOne({ where: { id: id } });

			response.status(201).json({
				message:
					"Los datos de la medio fueron obtenidos exitosamente!",
				data: medio,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Actualizar medios
const updateMedio = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const medioUpdate = await MedioDePago.update(request.body, {
				where: { id: id },
			});

			response.status(201).json({
				message: "La medio fue actualizada exitosamente!",
				data: medioUpdate,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Eliminar una medio
const deleteMedio = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const medioDelete = await MedioDePago.destroy({
				where: { id: id },
			});

			response.status(201).json({
				message: "La medio fue eliminada exitosamente!",
				data: medioDelete,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Actualizar medio
const patchMedio = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		const fieldsToUpdate = request.body;
		try {
			const medio = await MedioDePago.findByPk(id);

			if (!medio) {
				return response
					.status(404)
					.json({ message: "Medio no encontrada." });
			}

			// Actualizar solo el campo 'nombre'
			await medio.update(fieldsToUpdate);

			response.status(201).json({
				message: "La medio fue actualizada exitosamente!",
				data: medio,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Exportamos todas las rutas
export {
	createMedio,
	getMedios,
	getMedioById,
	updateMedio,
	deleteMedio,
	patchMedio,
};

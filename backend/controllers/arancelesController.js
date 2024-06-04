import Aranceles from "../models/arancelesModel.js";
import authenticateToken from "../functions/tokenVerify.js";
import { config } from "dotenv";
config();

// Crear un nuevo arancel
const createArancel = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const nuevoArancel = await Aranceles.create(request.body);

			response.status(201).json({
				message: "El arancel fue creado exitosamente!",
				data: nuevoArancel,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener todos los aranceles
const getAranceles = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const aranceles = await Aranceles.findAll(request.body);

			response.status(201).json({
				message: "El listado de aranceles fue creado exitosamente!",
				data: aranceles,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener arancel por Id
const getArancelById = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const arancel = await Aranceles.findOne({ where: { id: id } });

			response.status(201).json({
				message:
					"Los datos del arancel fueron obtenidos exitosamente!",
				data: arancel,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Actualizar arancel	
const updateArancel = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const arancelUpdate = await Aranceles.update(request.body, {
				where: { id: id },
			});

			response.status(201).json({
				message: "El arancel fue actualizado exitosamente!",
				data: arancelUpdate,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Eliminar un arancel
const deleteArancel = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const arancelDelete = await Aranceles.destroy({
				where: { id: id },
			});

			response.status(201).json({
				message: "El arancel fue eliminado exitosamente!",
				data: arancelDelete,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Actualizar arancel
const patchArancel = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		const fieldsToUpdate = request.body;
		try {
			const arancel = await Aranceles.findByPk(id);

			if (!arancel) {
				return response
					.status(404)
					.json({ message: "Arancel no encontrado." });
			}

			// Actualizar solo el campo 'nombre'
			await arancel.update(fieldsToUpdate);

			response.status(201).json({
				message: "El arancel fue actualizado exitosamente!",
				data: arancel,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Exportamos todas las rutas
export {
	createArancel,
	getAranceles,
	getArancelById,
	updateArancel,
	deleteArancel,
	patchArancel,
};

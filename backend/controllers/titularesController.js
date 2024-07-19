import Titular from "../models/titularesModel.js";
import authenticateToken from "../functions/tokenVerify.js";
import { config } from "dotenv";
config();

// Crear un nuevo titular
const createTitular = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const nuevoTitular = await Titular.create(request.body);

			response.status(201).json({
				message: "El titular fue creado exitosamente!",
				data: nuevoTitular,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener todos los titulares
const getTitulares = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const titulares = await Titular.findAll(request.body);

			response.status(201).json({
				message: "El listado de titulares fue creado exitosamente!",
				data: titulares,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener un titular por Id
const getTitularById = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const titular = await Titular.findOne({
				where: { id: id },
			});

			response.status(201).json({
				message:
					"Los datos del titular fueron obtenidos exitosamente!",
				data: titular,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener un titular por DNI
const getTitularByDNI = async (request, response) => {
	authenticateToken(request, response, async () => {
		const dni = request.params.dni;
		try {
			const titular = await Titular.findOne({
				where: { dni: dni },
			});

			if (titular) {
				// Devolver los datos del titular si se encontró
				response.status(200).json({
					success: true,
					data: titular,
				});
			} else {
				// Devolver un mensaje de error si el titular no se encontró
				response.status(404).json({
					success: false,
					error: "Titular no encontrado",
				});
			}
		} catch (error) {
			// Manejar cualquier error que ocurra durante la búsqueda
			console.error("Error: " + error.message);
			response.status(500).json({
				success: false,
				error: "Error interno del servidor",
				message: error.message,
			});
		}
	});
};


// Eliminar un titular
const deleteTitular = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const titularDelete = await Titular.destroy({
				where: { id: id },
			});

			response.status(201).json({
				message: "El titular fue eliminado exitosamente!",
				data: titularDelete,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Actualizar un titular
const updateTitular = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		const fieldsToUpdate = request.body;
		try {
			const titular = await Titular.findByPk(id);

			if (!titular) {
				return response
					.status(404)
					.json({ message: "Titular no encontrado." });
			}

			// Actualizar solo el campo 'nombre'
			await titular.update(fieldsToUpdate);

			response.status(201).json({
				message: "El titular fue actualizado exitosamente!",
				data: titular,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

export {
	createTitular,
	getTitulares,
	getTitularById,
	getTitularByDNI,
	updateTitular,
	deleteTitular,
};
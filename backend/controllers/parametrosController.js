import Parametros from "../models/parametrosModel.js";
import authenticateToken from "../functions/tokenVerify.js";
import { config } from "dotenv";
config();

// Crear parámetro
const createParametro = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const nuevoParametro = await Parametros.create(request.body);

			response.status(201).json({
				message: "Parámetro creado exitosamente!",
				data: nuevoParametro,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener parametros
const getParametros = async (request, response) => {
	authenticateToken(request, response, async () => {
	try {
		const parametros = await Parametros.findAll(request.body);
		response.status(201).json({
			message: "Parámetros obtenidos exitosamente!",
			data: parametros,
		});
	} catch (error) {
		console.error("Error: " + error.message);
		response.status(500).send({ message: error.message });
	}
	});
};

// Obtener un parametro por Id
const getParametroById = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const parametro = await Parametros.findOne({ where: { id: id } });

			response.status(201).json({
				message: "Los parámetros fueron obtenidos exitosamente!",
				data: parametro,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Actualizar parametros
const patchParametro = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		const fieldsToUpdate = request.body;
		try {
			const parametro = await Parametros.findByPk(id);

			if (!parametro) {
				return response
					.status(404)
					.json({ message: "Parametro no encontrado." });
			}

			await parametro.update(fieldsToUpdate);

			response.status(201).json({
				message: "Parámetros actualizados exitosamente!",
				data: parametro,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener un parametro por Id sin autenticación
const getParametroSinToken = async (request, response) => {
	const id = request.params.id;
	try {
		const parametro = await Parametros.findOne({ where: { id: id } });

		response.status(201).json({
			message: "Los parámetros fueron obtenidos exitosamente!",
			data: parametro,
		});
	} catch (error) {
		console.error("Error: " + error.message);
		response.status(500).send({ message: error.message });
	}
};

// Exportamos todas las rutas
export { createParametro, getParametros, getParametroById, patchParametro, getParametroSinToken };

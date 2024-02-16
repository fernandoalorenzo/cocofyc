import Estado from "../models/estadosMatriculaModel.js";
import authenticateToken from "../functions/tokenVerify.js";

// Crear un nuevo estado
const createEstado = async (request, response) => {
	// authenticateToken(request, response, async () => {
	try {
		const nuevoEstado = await Estado.create(request.body);

		response.status(201).json({
			message: "El estado fue creado exitosamente!",
			data: nuevoEstado,
		});
	} catch (error) {
		console.error("Error: " + error.message);
		response.status(500).send({ message: error.message });
	}
	// });
};

// Obtener todos los estados
const getEstados = async (request, response) => {
	// authenticateToken(request, response, async () => {
		try {
			const estados = await Estado.findAll(request.body);

			response.status(201).json({
				message: "El listado de estados fue creado exitosamente!",
				data: estados,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	// }

};

// Obtener un estado por Id
const getEstadoById = async (request, response) => {
	// 	authenticateToken(request, response, async () => {
	const id = request.params.id;
		try {
			const estado = await Estado.findOne({ where: { id: id } });

			response.status(201).json({
				message: "Los datos del estado fueron obtenidos exitosamente!",
				data: estado,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	// 	});
};

// Actualizar estados
const updateEstado = async (request, response) => {
	// 	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const estadoUpdate = await Estado.update(
				request.body,
				{ where: { id: id } }
			)

			response.status(201).json({
				message: "El estado fue actualizado exitosamente!",
				data: estadoUpdate,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	// 	});
};

// Eliminar un estado
const deleteEstado = async (request, response) => {
	// 	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const estadoDelete = await Estado.destroy({
				where: { id: id },
			});

			response.status(201).json({
				message: "El estado fue eliminado exitosamente!",
				data: estadoDelete,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	// 	});
};

// Exportamos todas las rutas
export {
	createEstado,
	getEstados,
	getEstadoById,
	updateEstado,
	deleteEstado,
};

import Establecimiento from "../models/establecimientosModel.js";
import authenticateToken from "../functions/tokenVerify.js";

// Crear un nuevo establecimiento
const createEstablecimiento = async (request, response) => {
	// authenticateToken(request, response, async () => {
	try {
		const nuevoEstablecimiento = await Establecimiento.create(request.body);

		response.status(201).json({
			message: "El establecimiento fue creado exitosamente!",
			data: nuevoEstablecimiento,
		});
	} catch (error) {
		console.error("Error: " + error.message);
		response.status(500).send({ message: error.message });
	}
	// });
};

// Obtener todos los establecimientos
const getEstablecimientos = async (request, response) => {
	// authenticateToken(request, response, async () => {
		try {
			const establecimientos = await Establecimiento.findAll(request.body);

			response.status(201).json({
				message: "El listado de establecimientos fue creado exitosamente!",
				data: establecimientos,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	// }

};

// Obtener un establecimiento por Id
const getEstablecimientoById = async (request, response) => {
	// 	authenticateToken(request, response, async () => {
	const id = request.params.id;
		try {
			const establecimiento = await Establecimiento.findOne({ where: { id: id } });

			response.status(201).json({
				message: "Los datos del establecimiento fueron obtenidos exitosamente!",
				data: establecimiento,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	// 	});
};

// Actualizar establecimientos
const updateEstablecimiento = async (request, response) => {
	// 	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const establecimientoUpdate = await Establecimiento.update(
				request.body,
				{ where: { id: id } }
			)

			response.status(201).json({
				message: "El establecimiento fue actualizado exitosamente!",
				data: establecimientoUpdate,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	// 	});
};

// Eliminar un establecimiento
const deleteEstablecimiento = async (request, response) => {
	// 	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const establecimientoDelete = await Establecimiento.destroy({
				where: { id: id },
			});

			response.status(201).json({
				message: "El establecimiento fue eliminado exitosamente!",
				data: establecimientoDelete,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	// 	});
};

// Exportamos todas las rutas
export {
	createEstablecimiento,
	getEstablecimientos,
	getEstablecimientoById,
	updateEstablecimiento,
	deleteEstablecimiento,
};

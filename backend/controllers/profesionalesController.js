import Profesional from "../models/profesionalesModel.js";
import authenticateToken from "../functions/tokenVerify.js";

// Crear un nuevo profesional
const createProfesional = async (request, response) => {
	// authenticateToken(request, response, async () => {
	try {
		const nuevoProfesional = await Profesional.create(request.body);

		response.status(201).json({
			message: "El profesional fue creado exitosamente!",
			data: nuevoProfesional,
		});
	} catch (error) {
		console.error("Error: " + error.message);
		response.status(500).send({ message: error.message });
	}
	// });
};

// Obtener todos los profesionales
const getProfesionales = async (request, response) => {
	// authenticateToken(request, response, async () => {
		try {
			const profesionales = await Profesional.findAll(request.body);

			response.status(201).json({
				message: "El listado de profesionales fue creado exitosamente!",
				data: profesionales,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	// }

};

// Obtener un profesional por Id
const getProfesionalById = async (request, response) => {
	// 	authenticateToken(request, response, async () => {
	const id = request.params.id;
		try {
			const profesional = await Profesional.findOne({ where: { id: id } });

			response.status(201).json({
				message: "Los datos del profesional fueron obtenidos exitosamente!",
				data: profesional,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	// 	});
};

// Obtener un profesional por DNI
const getProfesionalByDNI = async (request, response) => {
	// 	authenticateToken(request, response, async () => {
		const dni = request.params.dni;
		try {
			const profesional = await Profesional.findOne({ where: { dni: dni } });

			if (profesional) {
				// Devolver los datos del profesional si se encontró
				response.status(200).json({
					success: true,
					data: profesional,
				});
			} else {
				// Devolver un mensaje de error si el profesional no se encontró
				response.status(404).json({
					success: false,
					error: "Profesional no encontrado",
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
	// 	});
};

// Actualizar profesionales
const updateProfesional = async (request, response) => {
	// 	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const profesionalUpdate = await Profesional.update(
				request.body,
				{ where: { id: id } }
			)

			console.log("request body controller:", request.body)

			console.log("Profesional actualizado:", profesionalUpdate)

			response.status(201).json({
				message: "El profesional fue actualizado exitosamente!",
				data: profesionalUpdate,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	// 	});
};

// Eliminar un profesional
const deleteProfesional = async (request, response) => {
	// 	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const profesionalDelete = await Profesional.destroy({
				where: { id: id },
			});

			response.status(201).json({
				message: "El profesional fue eliminado exitosamente!",
				data: profesionalDelete,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	// 	});
};

// Exportamos todas las rutas
export {
	createProfesional,
	getProfesionales,
	getProfesionalById,
	getProfesionalByDNI,
	updateProfesional,
	deleteProfesional,
};

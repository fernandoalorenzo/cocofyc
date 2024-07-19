import Profesional from "../models/profesionalesModel.js";
import Profesionales_Establecimientos from "./../models/profesionales_establecimientosModel.js";
import authenticateToken from "../functions/tokenVerify.js";
import moment from "moment-timezone";
import { config } from "dotenv";
config();

// Crear un nuevo profesional
const createProfesional = async (request, response) => {
	authenticateToken(request, response, async () => {
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
	});
};

// Obtener todos los profesionales
const getProfesionales = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const profesionales = await Profesional.findAll({
				order: [["nombre", "ASC"]],
			});

			response.status(201).json({
				message: "El listado de profesionales fue creado exitosamente!",
				data: profesionales,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener un profesional por Id
const getProfesionalById = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const profesional = await Profesional.findOne({
				where: { id: id },
			});

			response.status(201).json({
				message:
					"Los datos del profesional fueron obtenidos exitosamente!",
				data: profesional,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener un profesional por DNI
const getProfesionalByDNI = async (request, response) => {
	authenticateToken(request, response, async () => {
		const dni = request.params.dni;
		try {
			const profesional = await Profesional.findOne({
				where: { dni: dni },
			});

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
	});
};

// Obtener todos los profesionales activos
const getProfesionalesActivos = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			// Encuentra todos los profesionales con el atributo 'activo' establecido como true
			const profesionales = await Profesional.findAll({
				where: { activo: true },
			});

			response.status(200).json({
				message:
					"Lista de profesionales activos obtenida correctamente",
				registros: profesionales.length,
				data: profesionales,
				
			});
		} catch (error) {
			console.error(
				"Error al obtener los profesionales activos:",
				error.message
			);
			response
				.status(500)
				.json({
					message: "Error al obtener los profesionales activos",
				});
		}
	});
};

// Actualizar profesionales
const updateProfesional = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const profesionalUpdate = await Profesional.update(request.body, {
				where: { id: id },
			});

			response.status(201).json({
				message: "El profesional fue actualizado exitosamente!",
				data: profesionalUpdate,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Eliminar un profesional
const deleteProfesional = async (request, response) => {
	authenticateToken(request, response, async () => {
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
	});
};

// Actualizar un profesional
const patchProfesional = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		const fieldsToUpdate = request.body;
		try {
			const profesional = await Profesional.findByPk(id);

			if (!profesional) {
				return response
					.status(404)
					.json({ message: "Profesional no encontrado." });
			}

			// Actualizar solo el campo 'nombre'
			await profesional.update(fieldsToUpdate);

			response.status(201).json({
				message: "El profesional fue actualizado exitosamente!",
				data: profesional,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener los profesionales asignados a un establecimiento
const getProfesionalesAsignados = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const { id } = request.params; // ID del establecimiento

			// Buscar los profesionales asignados al profesional en la tabla pivote
			const asignaciones = await Profesionales_Establecimientos.findAll({
				where: { establecimiento_id: id },
			});
			// Obtener los datos de los profesionales asignados
			const profesionalesIds = asignaciones.map(
				(asignacion) => asignacion.profesional_id
			);
			const profesionalesAsignados = await Profesional.findAll({
				where: { id: profesionalesIds },
			});
			response.status(200).json(profesionalesAsignados);
		} catch (error) {
			console.error(
				"Error al obtener los profesionales asignados:",
				error
			);
			response.status(500).json({
				message: "Error al obtener los profesionales asignados",
			});
		}
	});
};

// Función para asignar un profesional a un establecimiento
const asignarProfesional = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const { establecimientoId, profesionalId } = request.body;

			// Verificar si el profesional ya está asignado al profesional
			const asignacionExistente =
				await Profesionales_Establecimientos.findOne({
					where: {
						profesional_id: profesionalId,
						establecimiento_id: establecimientoId,
					},
				});

			if (asignacionExistente) {
				console.log("El profesional ya está asignado al establecimiento.");
				return response.status(400).json({
					message:
						"El profesional ya está asignado al establecimiento.",
				});
			}

			// Crear la nueva asignación
			await Profesionales_Establecimientos.create({
				profesional_id: profesionalId,
				establecimiento_id: establecimientoId,
			});

			response
				.status(201)
				.json({ message: "Profesional asignado correctamente." });
		} catch (error) {
			console.error("Error al asignar profesional:", error);
			response
				.status(500)
				.json({ message: "Error interno del servidor." });
		}
	});
};

// Función para desvincular un profesional de un establecimiento
const desvincularProfesional = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const { profesionalId, establecimientoId } = request.params; // ID del profesional y del profesional pasados en la URL

			// Buscar y eliminar la asignación
			const asignacion = await Profesionales_Establecimientos.findOne({
				where: {
					profesional_id: profesionalId,
					establecimiento_id: establecimientoId,
				},
			});

			if (!asignacion) {
				return response
					.status(404)
					.json({ message: "La asignación no existe." });
			}

			await asignacion.destroy();

			response.status(200).json({
				message: "Profesional desvinculado correctamente.",
			});
		} catch (error) {
			console.error("Error al desvincular profesional:", error);
			response
				.status(500)
				.json({ message: "Error interno del servidor." });
		}
	});
};

// Obtener los profesionales por cumpleaños
const getProfesionalesBirthDay = async (request, response) => {
	try {
		// Obtener el día y el mes de los parámetros de la URL
		const { mes, dia } = request.params;

		// Obtener todos los profesionales de la base de datos
		const profesionales = await Profesional.findAll();

		// Filtrar los profesionales cuya fecha de nacimiento no sea "0000-00-00"
		const profesionalesFiltrados = profesionales.filter((profesional) => {
			return profesional.fecha_nacimiento !== "0000-00-00";
		});

		// Filtrar los profesionales por día y mes de fecha de nacimiento
		const profesionalesPorFecha = profesionalesFiltrados.filter(
			(profesional) => {
				const fechaNacimiento = moment(profesional.fecha_nacimiento);
				const diaNacimiento = fechaNacimiento.format("DD");
				const mesNacimiento = fechaNacimiento.format("MM");
				return diaNacimiento === dia && mesNacimiento === mes;
			}
		);

		response.status(200).json({
			message:
				"Profesionales cuyo cumpleaños coincide con el día y el mes proporcionados:",
			Registros: profesionalesPorFecha.length,
			data: profesionalesPorFecha,
		});
	} catch (error) {
		console.error("Error:", error.message);
		response
			.status(500)
			.json({ error: "Error al obtener los profesionales" });
	}
};

export {
	createProfesional,
	getProfesionales,
	getProfesionalById,
	getProfesionalByDNI,
	updateProfesional,
	deleteProfesional,
	patchProfesional,
	getProfesionalesAsignados,
	asignarProfesional,
	desvincularProfesional,
	getProfesionalesActivos,
	getProfesionalesBirthDay,
};
import Matricula from "../models/matriculasModel.js";
import authenticateToken from "../functions/tokenVerify.js";
import { config } from "dotenv";
config();

// Crear un nuevo matricula
const createMatricula = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const nuevoMatricula = await Matricula.create(request.body);

			response.status(201).json({
				message: "El matricula fue creado exitosamente!",
				data: nuevoMatricula,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener todos los matriculas
const getMatriculas = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const matriculas = await Matricula.findAll(request.body);

			response.status(201).json({
				message: "El listado de matriculas fue creado exitosamente!",
				data: matriculas,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener un matricula por Id
const getMatriculaById = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const matricula = await Matricula.findOne({ where: { id: id } });

			response.status(201).json({
				message:
					"Los datos del matricula fueron obtenidos exitosamente!",
				data: matricula,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

const getMatriculaByMatricula = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const matricula = request.params.matricula;
			const matriculasGeneradas = await Matricula.findAll({
				where: { matricula: matricula },
			});
			response.status(200).json({ data: matriculasGeneradas });
		} catch (error) {
			console.error(
				"Error al obtener las matriculas generadas por una matricula:",
				error.message
			);
			response.status(500).json({
				message:
					"Error al obtener las matriculas generadas por una matricula",
			});
		}
	});
};

// Actualizar matriculas
const updateMatricula = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const matriculaUpdate = await Matricula.update(request.body, {
				where: { id: id },
			});

			response.status(201).json({
				message: "El matricula fue actualizado exitosamente!",
				data: matriculaUpdate,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Eliminar un matricula
const deleteMatricula = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const matriculaDelete = await Matricula.destroy({
				where: { id: id },
			});

			response.status(201).json({
				message: "El matricula fue eliminado exitosamente!",
				data: matriculaDelete,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Actualizar un matricula
const patchMatricula = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		const fieldsToUpdate = request.body;
		try {
			const matricula = await Matricula.findByPk(id);

			if (!matricula) {
				return response
					.status(404)
					.json({ message: "Matricula no encontrado." });
			}

			// Actualizar solo el campo 'nombre'
			await matricula.update(fieldsToUpdate);

			response.status(201).json({
				message: "El matricula fue actualizado exitosamente!",
				data: matricula,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

const getMatriculasAsignados = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const { id } = request.params; // ID del establecimiento

			// Buscar los matriculas asignados al matricula en la tabla pivote
			const asignaciones = await Matriculas_Establecimientos.findAll({
				where: { establecimiento_id: id },
			});
			// Obtener los datos de los matriculas asignados
			const matriculasIds = asignaciones.map(
				(asignacion) => asignacion.matricula_id
			);
			const matriculasAsignados = await Matricula.findAll({
				where: { id: matriculasIds },
			});
			response.status(200).json(matriculasAsignados);
		} catch (error) {
			console.error("Error al obtener los matriculas asignados:", error);
			response.status(500).json({
				message: "Error al obtener los matriculas asignados",
			});
		}
	});
};

// Función para asignar un matricula a un establecimiento
const asignarMatricula = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const { establecimientoId, matriculaId } = request.body;

			// Verificar si el matricula ya está asignado al matricula
			const asignacionExistente =
				await Matriculas_Establecimientos.findOne({
					where: {
						matricula_id: matriculaId,
						establecimiento_id: establecimientoId,
					},
				});

			if (asignacionExistente) {
				return response.status(400).json({
					message:
						"El matricula ya está asignado al establecimiento.",
				});
			}

			// Crear la nueva asignación
			await Matriculas_Establecimientos.create({
				matricula_id: matriculaId,
				establecimiento_id: establecimientoId,
			});

			response
				.status(201)
				.json({ message: "Matricula asignado correctamente." });
		} catch (error) {
			console.error("Error al asignar matricula:", error);
			response
				.status(500)
				.json({ message: "Error interno del servidor." });
		}
	});
};

// Función para desvincular un matricula de un matricula
const desvincularMatricula = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const { matriculaId, establecimientoId } = request.params; // ID del matricula y del matricula pasados en la URL

			// Buscar y eliminar la asignación
			const asignacion = await Matriculas_Establecimientos.findOne({
				where: {
					matricula_id: matriculaId,
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
				message: "Matricula desvinculado correctamente.",
			});
		} catch (error) {
			console.error("Error al desvincular matricula:", error);
			response
				.status(500)
				.json({ message: "Error interno del servidor." });
		}
	});
};

// Exportamos todas las rutas
export {
	createMatricula,
	getMatriculas,
	getMatriculaById,
	getMatriculaByMatricula,
	updateMatricula,
	deleteMatricula,
	patchMatricula,
	getMatriculasAsignados,
	asignarMatricula,
	desvincularMatricula,
};

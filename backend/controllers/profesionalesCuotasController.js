import Profesional from "../models/profesionalesModel.js";
import Cuota from "../models/cuotasModel.js";
import Profesionales_Cuotas from "../models/profesionales_cuotasModel.js";
// import { Profesional, Cuota, Profesionales_Cuotas } from "../models/index.js";
import authenticateToken from "../functions/tokenVerify.js";
import { config } from "dotenv";
config();

// import { Profesional, Cuota, ProfesionalesCuotas } from "../models/index.js";

// Genera cuotas para los profesionales activos
const generarProfesionalesCuotas = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			// Extrae el ID de la cuota seleccionada de la solicitud
			const { cuotaId } = request.body;

			// Busca todos los profesionales activos
			const profesionalesActivos = await Profesional.findAll({
				where: { activo: true },
			});

			// Itera sobre cada profesional activo y agrega un registro en profesionales_cuotas
			for (const profesional of profesionalesActivos) {
				await Profesionales_Cuotas.create({
					profesional_id: profesional.id,
					cuota_id: cuotaId,
				});
			}

			response.status(201).json({
				message:
					"Registros agregados correctamente en profesionales_cuotas",
			});
		} catch (error) {
			console.error(
				"Error al agregar registros en profesionales_cuotas:",
				error.message
			);
			response.status(500).json({
				message: "Error al agregar registros en profesionales_cuotas",
			});
		}
	});
};

// Obtiene las cuotas generadas por un id de cuota
const getCuotasGeneradasById = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const cuotaId = request.params.id;
			const cuotasGeneradas = await Profesionales_Cuotas.findAll({
				where: { cuota_id: cuotaId },
			});
			response.status(200).json({ data: cuotasGeneradas });
		} catch (error) {
			console.error(
				"Error al obtener las cuotas generadas por una cuota:",
				error.message
			);
			response.status(500).json({
				message: "Error al obtener las cuotas generadas por una cuota",
			});
		}
	});
};

// Obtiene las cuotas generadas a traves de un id de profesional
const getCuotasGeneradasByProfesional = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const parametro = request.params;
			const cuotasGeneradas = await Profesionales_Cuotas.findAll({
				where: { profesional_id: parametro.id },
			});
			response.status(200).json({ data: cuotasGeneradas });
		} catch (error) {
			console.error(
				"Error al obtener las cuotas generadas por un profesional:",
				error.message
			);
			response.status(500).json({
				message:
					"Error al obtener las cuotas generadas por un profesional",
			});
		}
	});
};

// Genera una nueva cuota individual para un id de profesional
const generarProfesionalesCuota = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const { user_id, profesional_id, cuota_id } = request.body;

			// Verificar si la combinación ya existe
			const existingRecord = await Profesionales_Cuotas.findOne({
				where: { profesional_id, cuota_id },
			});

			if (existingRecord) {
				console.log("La combinación ya existe en la base de datos.");
				return response.status(400).json({
					message: "La combinación ya existe en la base de datos.",
					data: "existingRecord",
				});
			}

			// Crear el nuevo registro
			const nuevaCuotaGenerada = await Profesionales_Cuotas.create({
				user_id,
				profesional_id,
				cuota_id,
			});

			response.status(201).json({ data: nuevaCuotaGenerada });
		} catch (error) {
			console.error("Error al generar la cuota:", error.message);
			response.status(500).json({ message: "Error al generar la cuota" });
		}
	});
};

// Asignar un pago a una cuota abonada por un profesional
const asignarMovimientoACuota = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const { id, movimiento_id } = request.body;

			// Buscar el registro por su ID
			const registro = await Profesionales_Cuotas.findOne({
				where: { id: id },
			});

			// Verificar si el registro existe
			if (!registro) {
				console.log("El registro no se encontró en la base de datos.");
				return response.status(404).json({
					message: "El registro no se encontró en la base de datos.",
				});
			}

			// Asignar el movimiento al registro
			registro.movimiento_id = movimiento_id;
			await registro.save();

			response.status(200).json({
				message: "Movimiento asignado correctamente al registro.",
			});
		} catch (error) {
			console.error(
				"Error al asignar el movimiento al registro:",
				error.message
			);
			response.status(500).json({
				message: "Error al asignar el movimiento al registro.",
			});
		}
	});
};

// Obtener profesionales morosos
const getProfesionalesMorosos = async (request, response) => {
	// console.log("*****************************************************************");
	// console.log("******************** getProfesionalesMorosos ********************");
	// console.log("*****************************************************************");
	// authenticateToken(request, response, async () => {
		try {
			// Obtener todos los profesionales
			const profesionales = await Profesional.findAll(request.body);

			// Obtener los IDs de los profesionales
			const idsProfesionales = profesionales.map(
				(profesional) => profesional.id
			);

			// Obtener los profesionales que tienen cuotas asignadas en profesionales_cuotas
			const profesionalesConCuotas = await Profesionales_Cuotas.findAll({
				where: {
					profesional_id: idsProfesionales,
					movimiento_id: null, // Agregar la condición de que movimiento_id sea null
				},
				attributes: { include: ["cuota_id"] }, // Agregar cuota_id a los campos devueltos
			});


			// Obtener los IDs de los profesionales que tienen cuotas asignadas
			const idsProfesionalesConCuotas = profesionalesConCuotas.map(
				(pc) => pc.profesional_id
			);

			// Filtrar el array de profesionales para dejar solo aquellos que tienen cuotas asignadas
			const profesionalesFiltrados = profesionales.filter((profesional) =>
				idsProfesionalesConCuotas.includes(profesional.id)
			);

			// Mapear profesionalesFiltrados para agregar cuota_id
			const profesionalesConCuotasAsignadas = profesionalesFiltrados.map(
				(profesional) => {
					const cuotaAsignada = profesionalesConCuotas.find(
						(pc) => pc.profesional_id === profesional.id
					);
					const profesionalPlain = profesional.get({ plain: true }); // Obteniendo solo los datos planos
					return {
						...profesionalPlain,
						cuota_id: cuotaAsignada ? cuotaAsignada.cuota_id : null,
					};
				}
			);

			response.status(201).json({
				message: "El listado de profesionales fue creado exitosamente!",
				total: profesionalesConCuotasAsignadas.length,
				data: profesionalesConCuotasAsignadas,
			});
		} catch (error) {
			console.error("Error al obtener profesionales morosos:", error);
			throw error;
		}
	// });
};

export {
	generarProfesionalesCuotas,
	getCuotasGeneradasById,
	getCuotasGeneradasByProfesional,
	generarProfesionalesCuota,
	asignarMovimientoACuota,
	getProfesionalesMorosos,
};

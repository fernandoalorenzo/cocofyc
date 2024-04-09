import Profesional from "../models/profesionalesModel.js";
import Cuota from "../models/cuotasModel.js";
import Profesionales_Cuotas from "../models/profesionales_cuotasModel.js";
import authenticateToken from "../functions/tokenVerify.js";
import { config } from "dotenv";
config();

import sequelize from "./../config/sequelizeConfig.js";
import { Op } from "sequelize";
import { literal } from "sequelize";

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
	authenticateToken(request, response, async () => {
		try {
			// Obtener un array (cuotasPendientes) con las cuotas movimiento_id null del modelo Profesionales_Cuotas
			const cuotasPendientes = await Profesionales_Cuotas.findAll({
				where: {
					movimiento_id: null,
				},
			});

			// Recorrer el array cuotasPendientes y mediante el campo cuota_id obtener IMPORTE, VENCIMIENTO, CUOTA del modelo Cuota y agregar esos campos al array cuotasPendientes
			// Mediante el campo profesional_id obtener los campos NOMBRE, DNI, MATRICULA, E-MAIL, TELEFONO del modelo Profesional y agregar esos campos al array cuotasPendientes

			const morososConDetalles = await Promise.all(
				cuotasPendientes.map(async (cuota) => {
					const cuotaDetail = await Cuota.findByPk(cuota.cuota_id);
					const profesionalDetail = await Profesional.findByPk(
						cuota.profesional_id
					);

					return {
						...cuota.toJSON(),
						importe: cuotaDetail.importe,
						vencimiento: cuotaDetail.vencimiento,
						cuota: cuotaDetail.cuota,
						nombre: profesionalDetail.nombre,
						dni: profesionalDetail.dni,
						cuit: profesionalDetail.cuit,
						matricula: profesionalDetail.matricula,
						email: profesionalDetail.email,
						telefono: profesionalDetail.telefono,
						activo: profesionalDetail.activo,
					};
				})
			);

			// Ordenar morososConDetalles alfabéticamente por nombre
			// morososConDetalles.sort((a, b) => {
			// 	if (a.nombre < b.nombre) return -1;
			// 	if (a.nombre > b.nombre) return 1;
			// 	return 0;
			// });

			response.status(201).json({
				message: "El listado de profesionales fue creado exitosamente!",
				total: morososConDetalles.length,
				data: morososConDetalles,
			});
		} catch (error) {
			console.error("Error al obtener profesionales:", error);
			throw error;
		}
	});
};

// Obtener profesionales al día
const getProfesionalesAlDia = async (request, response) => {
	authenticateToken(request, response, async () => {
	try {
		// Paso 1: Obtener profesionales sin deudas pendientes
		const profesionalesConMovimiento = await Profesionales_Cuotas.findAll({
			where: {
				movimiento_id: {
					[Op.not]: null,
				},
			},
		});

		// Array para almacenar los resultados finales con la información adicional
		const resultadoFinal = [];

		// Iterar sobre los profesionales con movimiento
		for (const profesional of profesionalesConMovimiento) {
			// Buscar el profesional en el modelo Profesional
			const infoProfesional = await Profesional.findOne({
				where: {
					id: profesional.profesional_id,
				},
				attributes: ["nombre", "matricula", "telefono", "email", "activo"],
			});

			// Agregar la información adicional al resultado final
			resultadoFinal.push({
				...profesional.toJSON(),
				...infoProfesional.toJSON(),
			});
		}

		// Convertir el array de resultadoFinal en un Set para mantener solo los IDs únicos
		const idUnicos = new Set();
		const resultadosFiltrados = [];

		for (const resultado of resultadoFinal) {
			// Verificar si el profesional_id ya está en el Set
			if (!idUnicos.has(resultado.profesional_id)) {
				// Si no está, agregar el ID al Set y el resultado al array de resultados filtrados
				idUnicos.add(resultado.profesional_id);
				resultadosFiltrados.push(resultado);
			}
		}

		response.status(200).json({
			message: "Profesionales sin deudas pendientes",
			total: resultadosFiltrados.length,
			data: resultadosFiltrados,
		});
	} catch (error) {
		console.error("Error al obtener profesionales:", error);
		throw error;
	}
	});
};

export {
	generarProfesionalesCuotas,
	getCuotasGeneradasById,
	getCuotasGeneradasByProfesional,
	generarProfesionalesCuota,
	asignarMovimientoACuota,
	getProfesionalesMorosos,
	getProfesionalesAlDia,
};

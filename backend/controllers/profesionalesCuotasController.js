import Profesional from "../models/profesionalesModel.js";
import Cuota from "../models/cuotasModel.js";
import Profesionales_Cuotas from "../models/profesionales_cuotasModel.js";
import authenticateToken from "../functions/tokenVerify.js";
import { config } from "dotenv";
config();
import moment from "moment-timezone";

import sequelize from "./../config/sequelizeConfig.js";

// Genera cuotas para los profesionales activos
const generarProfesionalesCuotas = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const { id } = request.body;
			
			// Obtener la lista de profesionales activos
			const profesionalesActivos = await Profesional.findAll({
				where: { activo: true },
			});

			// Generar cuotas para cada profesional activo
			for (const profesional of profesionalesActivos) {
				await Profesionales_Cuotas.create({
					profesional_id: profesional.id,
					cuota_id: id,
				});
			}

			response.status(200).json({
				message:
					"Cuotas generadas correctamente para todos los profesionales activos",
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

// Eliminar una cuota generada por id de profesionales_cuotas
const deleteCuotaGeneradaById = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const id_profesionales_cuotas = request.params.id;

			const profesionales_cuotasDelete =
				await Profesionales_Cuotas.destroy({
					where: { id: id_profesionales_cuotas },
				});

			response.status(201).json({
				message:
					"La cuota generada al profesional fue eliminada exitosamente!",
				data: profesionales_cuotasDelete,
				result: true,
			});
		} catch (error) {
			console.error(
				"Error al eliminar la cuota generada al profesional:",
				error.message
			);
			response.status(500).json({
				message: "Error al eliminar la cuota generada al profesional",
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
			// Realiza la consulta utilizando el método findAll de Sequelize
			const profesionales = await Profesionales_Cuotas.findAll({
				attributes: [
					[
						sequelize.fn(
							"DISTINCT",
							sequelize.col("profesional_id")
						),
						"profesional_id",
					],
				], // Selecciona valores únicos de profesional_id
				raw: true, // Obtiene resultados como objetos planos
			});

			// Extrae los valores de profesional_id de los resultados
			const listaProfesionalesId = profesionales.map(
				(item) => item.profesional_id
			);

			// Obtener todos los registros de Profesionales_Cuotas
			let profesionalesCuotas = await Profesionales_Cuotas.findAll({
				raw: true,
			});

			// Iterar sobre cada registro de profesionalesCuotas
			for (let i = 0; i < profesionalesCuotas.length; i++) {
				const cuota_id = profesionalesCuotas[i].cuota_id;

				// Buscar la cuota correspondiente en el modelo Cuota
				const cuota = await Cuota.findOne({
					where: { id: cuota_id },
					raw: true,
				});

				// Agregar el campo "vencimiento" al objeto profesionalesCuotas
				if (cuota) {
					profesionalesCuotas[i].vencimiento = cuota.vencimiento;
				}
			}

			// Obtén la fecha actual
			const fechaActual = moment()
				.tz("America/Buenos_Aires")
				.startOf("day")
				.toDate();

			fechaActual.setHours(0, 0, 0, 0);

			const profesionalesConDatos = [];

			// Iterar sobre cada profesional_id en listaProfesionalesId
			for (let i = 0; i < listaProfesionalesId.length; i++) {
				const profesional_id = listaProfesionalesId[i];

				// Filtrar profesionalesCuotas para obtener solo los registros correspondientes a este profesional_id
				const registrosProfesional = profesionalesCuotas.filter(
					(item) => item.profesional_id === profesional_id
				);

				// Iterar sobre cada registro de este profesional
				for (let j = 0; j < registrosProfesional.length; j++) {
					const registro = registrosProfesional[j];

					// Convertir la fecha de vencimiento a un objeto Date en formato UTC
					const vencimiento = moment(registro.vencimiento)
						.tz("America/Buenos_Aires")
						.startOf("day")
						.toDate();

					// Verificar las condiciones: movimiento_id === null y vencimiento <= fecha actual
					if (
						registro.movimiento_id === null &&
						vencimiento <= fechaActual - 1
					) {
						// Eliminar el profesional_id del array listaProfesionalesId
						listaProfesionalesId.splice(i, 1);
						// Reiniciar el índice i ya que el array ha cambiado de longitud
						i--;
						// Romper el bucle for, ya que hemos encontrado un registro que cumple las condiciones
						break;
					}
				}
			}

			// Obtener los campos del modelo Profesional para los IDs restantes en listaProfesionalesId
			const profesionalesInfo = await Profesional.findAll({
				where: { id: listaProfesionalesId },
				attributes: [
					"id",
					"nombre",
					"dni",
					"cuit",
					"telefono",
					"email",
					"matricula",
					"activo",
				],
				raw: true,
			});

			// Agregar los campos del modelo Profesional al array listaProfesionalesId
			listaProfesionalesId.forEach((profesional_id, index) => {
				const info = profesionalesInfo.find(
					(profesional) => profesional.id === profesional_id
				);

				// Si se encuentra la información, combinarla con el ID del profesional y agregarla al nuevo array
				if (info) {
					profesionalesConDatos.push({
						id: profesional_id,
						...info,
					});
				}
			});

			// Devuelve la lista de profesional_id con la información adicional de Profesional
			response.status(201).json({
				message: "El listado de profesionales fue creado exitosamente!",
				total: profesionalesConDatos.length,
				data: profesionalesConDatos,
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
	deleteCuotaGeneradaById,
	generarProfesionalesCuota,
	asignarMovimientoACuota,
	getProfesionalesMorosos,
	getProfesionalesAlDia,
};

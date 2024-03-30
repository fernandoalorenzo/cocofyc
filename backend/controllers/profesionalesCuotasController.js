import Profesional from "../models/profesionalesModel.js";
import Profesionales_Cuotas from "../models/profesionales_cuotasModel.js";
import authenticateToken from "../functions/tokenVerify.js";
import { config } from "dotenv";
config();

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
				message:
					"Error al agregar registros en profesionales_cuotas",
			});
		}
	});
};

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
				message:
					"Error al obtener las cuotas generadas por una cuota",
			});
		}
	});
};

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

const generarProfesionalesCuota = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const { user_id, profesional_id, cuota_id } = request.body;

			// Verificar si la combinación ya existe
            const existingRecord = await Profesionales_Cuotas.findOne({
                where: { profesional_id, cuota_id }
            });

			if (existingRecord) {
				console.log("La combinación ya existe en la base de datos.");
                return response.status(400).json({ message: "La combinación ya existe en la base de datos.", data: "existingRecord" });
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

const asignarMovimientoACuota = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			console.log(
				"************************* request.body en CONTROLLER: *************************",
				request.body
			);
			const { id, movimiento_id } = request.body;

			// Buscar el registro por su ID
			const registro = await Profesionales_Cuotas.findOne({
				where: { id: id },
			});

			// Verificar si el registro existe
			if (!registro) {
				console.log("El registro no se encontró en la base de datos.");
				return response
					.status(404)
					.json({
						message:
							"El registro no se encontró en la base de datos.",
					});
			}

			// Asignar el movimiento al registro
			registro.movimiento_id = movimiento_id;
			await registro.save();

			response
				.status(200)
				.json({
					message: "Movimiento asignado correctamente al registro.",
				});
		} catch (error) {
			console.error(
				"Error al asignar el movimiento al registro:",
				error.message
			);
			response
				.status(500)
				.json({
					message: "Error al asignar el movimiento al registro.",
				});
		}
	});
};

export { generarProfesionalesCuotas, getCuotasGeneradasById, getCuotasGeneradasByProfesional, generarProfesionalesCuota, asignarMovimientoACuota };
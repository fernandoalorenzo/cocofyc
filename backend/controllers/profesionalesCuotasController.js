import Profesional from "../models/profesionalesModel.js";
import Profesionales_Cuotas from "../models/profesionales_cuotasModel.js";
import authenticateToken from "../functions/tokenVerify.js";
import { config } from "dotenv";
config();

const generarProfesionalesCuotas = async (request, response) => {
	console.log("request.body: ", request.body);
	authenticateToken(request, response, async () => {
		try {
			// Extrae el ID de la matrícula seleccionada de la solicitud
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
            const { profesionalId } = request.params;
            const cuotasGeneradas = await Profesionales_Cuotas.findAll({
                where: { profesional_id: profesionalId },
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



export { generarProfesionalesCuotas, getCuotasGeneradasById, getCuotasGeneradasByProfesional };
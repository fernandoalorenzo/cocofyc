import Profesional from "../models/profesionalesModel.js";
import Profesionales_Matriculas from "../models/profesionales_matriculasModel.js";
import authenticateToken from "../functions/tokenVerify.js";
import { config } from "dotenv";
config();

const generarProfesionalesMatriculas = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			// Extrae el ID de la matrícula seleccionada de la solicitud
			const { matriculaId } = request.body;

			// Busca todos los profesionales activos
			const profesionalesActivos = await Profesional.findAll({
				where: { activo: true },
			});

			// Itera sobre cada profesional activo y agrega un registro en profesionales_matriculas
			for (const profesional of profesionalesActivos) {
				await Profesionales_Matriculas.create({
					profesional_id: profesional.id,
					matricula_id: matriculaId,
				});
			}

			response.status(201).json({
				message:
					"Registros agregados correctamente en profesionales_matriculas",
			});
		} catch (error) {
			console.error(
				"Error al agregar registros en profesionales_matriculas:",
				error.message
			);
			response.status(500).json({
				message:
					"Error al agregar registros en profesionales_matriculas",
			});
		}
	});
};

const getMatriculasGeneradasById = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
            const matriculaId = request.params.id;
			const matriculasGeneradas = await Profesionales_Matriculas.findAll({
				where: { matricula_id: matriculaId },
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

const getMatriculasGeneradasByProfesional = async (request, response) => {
    authenticateToken(request, response, async () => {
        try {
            const { profesionalId } = request.params;
            const matriculasGeneradas = await Profesionales_Matriculas.findAll({
                where: { profesional_id: profesionalId },
            });
            response.status(200).json({ data: matriculasGeneradas });
        } catch (error) {
            console.error(
                "Error al obtener las matriculas generadas por un profesional:",
                error.message
            );
            response.status(500).json({
                message:
                    "Error al obtener las matriculas generadas por un profesional",
            });
        }
    });
};



export { generarProfesionalesMatriculas, getMatriculasGeneradasById, getMatriculasGeneradasByProfesional };
import Profesionales_Establecimientos from "../models/profesionales_establecimientosModel.js";
import Establecimiento from "../models/establecimientosModel.js";
import authenticateToken from "../functions/tokenVerify.js";
// import jwt from "jsonwebtoken";
// import { config } from "dotenv";
// config();

// Controlador para obtener los establecimientos asignados a un profesional
export const getEstablecimientosAsignados = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const { id } = request.params; // ID del profesional
			// Buscar los establecimientos asignados al profesional en la tabla pivote
			const asignaciones = await Profesionales_Establecimientos.findAll({
				where: { profesional_id: id },
			});
			// Obtener los datos de los establecimientos asignados
			const establecimientosIds = asignaciones.map(
				(asignacion) => asignacion.establecimiento_id
			);
			const establecimientosAsignados = await Establecimiento.findAll({
				where: { id: establecimientosIds },
			});
			response.status(200).json(establecimientosAsignados);
		} catch (error) {
			console.error(
				"Error al obtener los establecimientos asignados:",
				error
			);
			response.status(500).json({
				message: "Error al obtener los establecimientos asignados",
			});
		}
	});
};

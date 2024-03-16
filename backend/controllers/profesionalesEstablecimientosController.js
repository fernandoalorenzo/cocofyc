import Profesional from "../models/profesionalesModel.js";
import Establecimiento from "../models/establecimientosModel.js";
import Profesionales_Establecimientos from "../models/profesionalesEstablecimientosModel.js";

// Controlador para manejar las operaciones relacionadas con profesionales y establecimientos
const ProfesionalesEstablecimientosController = {
	// Función para obtener todos los profesionales con sus establecimientos asociados
	async obtenerProfesionalesConEstablecimientos(req, res) {
		try {
			const profesionalesConEstablecimientos = await Profesional.findAll({
				include: [
					{
						model: Establecimiento,
						through: {
							model: Profesionales_Establecimientos,
						},
					},
				],
			});
			res.json(profesionalesConEstablecimientos);
		} catch (error) {
			console.error(
				"Error al obtener profesionales con establecimientos:",
				error
			);
			res.status(500).json({ mensaje: "Error interno del servidor" });
		}
	},

	// Otras funciones del controlador para crear, actualizar o eliminar profesionales y establecimientos según sea necesario
};

export default ProfesionalesEstablecimientosController;

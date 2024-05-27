import DenunciasSeguimientoArchivos from "../models/denunciasSeguimientosArchivosModel.js";
import authenticateToken from "../functions/tokenVerify.js";
import { config } from "dotenv";
config();

// Obtener archivos de un seguimiento por ID del seguimiento 
const getArchivosBySeguimientoId = async (request, response) => {
    authenticateToken(request, response, async () => {
        const seguimientoId = request.params.id;
        try {
            const archivos = await DenunciasSeguimientoArchivos.findAll({
				where: { denuncia_seguimiento_id: seguimientoId },
			});

            response.status(200).json({
                message: "Los archivos del seguimiento fueron obtenidos exitosamente!",
				length: archivos.length,
				data: archivos,
            });
        } catch (error) {
            console.error("Error: " + error.message);
            response.status(500).send({ message: error.message });
        }
    });
};

// Obtener un archivo por su ID
const getArchivoById = async (request, response) => {
    authenticateToken(request, response, async () => {
        const archivoId = request.params.id;
        try {
            const archivo = await DenunciasSeguimientoArchivos.findByPk(
				archivoId
			);
            if (archivo) {
                response.status(200).json({
                    message: "El archivo fue obtenido exitosamente!",
                    data: archivo
                });
            } else {
                response.status(404).json({ message: "Archivo no encontrado" });
            }
        } catch (error) {
            console.error("Error: " + error.message);
            response.status(500).send({ message: error.message });
        }
    });
};

// Agregar un archivo a un seguimiento de una denuncia
const agregarArchivo = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const nuevoArchivo = await DenunciasSeguimientoArchivos.create({
				fecha: request.body.fecha,
				archivo: request.body.archivo,
				archivo_descripcion: request.body.archivo_descripcion,
                denuncia_seguimiento_id: request.body.denuncia_seguimiento_id,
                archivo_descripcion: request.body.archivo_descripcion,
				user_id: request.body.user_id
			});

			response.status(201).json({
				message: "El archivo fue agregado exitosamente!",
				data: nuevoArchivo,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Eliminar un archivo
const eliminarArchivo = async (request, response) => {
    authenticateToken(request, response, async () => {
        const archivoId = request.params.id;
        try {
            const deleted = await DenunciasSeguimientoArchivos.destroy({
				where: { id: archivoId },
			});
            if (deleted) {
                response.status(200).json({
                    message: "El archivo fue eliminado exitosamente!"
                });
            } else {
                response.status(404).json({ message: "Archivo no encontrado" });
            }
        } catch (error) {
            console.error("Error: " + error.message);
            response.status(500).send({ message: error.message });
        }
    });
};

// Exportamos todas las rutas
export {
	getArchivosBySeguimientoId,
	getArchivoById,
	agregarArchivo,
	eliminarArchivo,
};
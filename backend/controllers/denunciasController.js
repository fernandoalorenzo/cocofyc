import Denuncia from "../models/denunciasModel.js";
import DenunciasSeguimiento from "../models/denunciasSeguimientosModel.js";
import authenticateToken from "../functions/tokenVerify.js";
import { config } from "dotenv";
config();

// Crear una nueva denuncia
const createDenuncia = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const nuevaDenuncia = await Denuncia.create(
				request.body
			);

			response.status(201).json({
				message: "La denuncia fue creada exitosamente!",
				data: nuevaDenuncia,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener todas las denuncias
const getDenuncias = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			const denuncias = await Denuncia.findAll(
				request.body
			);

			response.status(201).json({
				message:
					"El listado de denuncias fue creado exitosamente!",
				data: denuncias,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener una denuncia por Id
const getDenunciaById = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const denuncia = await Denuncia.findOne({
				where: { id: id },
			});

			response.status(201).json({
				message:
					"Los datos de la denuncia fueron obtenidos exitosamente!",
				data: denuncia,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener una denuncia por Id del profesional
// const getDenunciaByIdProfesional = async (request, response) => {
// 	authenticateToken(request, response, async () => {
// 		const profesional_id = request.params.profesional_id;
// 		try {
// 			const denuncia = await Denuncia.findAll({
// 				where: { profesional_id: profesional_id },
// 			});

// 			response.status(201).json({
// 				message:
// 					"Los datos de la denuncia fueron obtenidos exitosamente!",
// 				data: denuncia,
// 			});
// 		} catch (error) {
// 			console.error("Error: " + error.message);
// 			response.status(500).send({ message: error.message });
// 		}
// 	});
// };

// Actualizar denuncias
const updateDenuncia = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const denunciaUpdate = await Denuncia.update(
				request.body,
				{ where: { id: id } }
			);

			response.status(201).json({
				message: "La denuncia fue actualizada exitosamente!",
				data: denunciaUpdate,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Eliminar una denuncia
const deleteDenuncia = async (request, response) => {
	authenticateToken(request, response, async () => {
		const id = request.params.id;
		try {
			const denunciaDelete = await Denuncia.destroy({
				where: { id: id },
			});

			response.status(201).json({
				message: "La denuncia fue eliminada exitosamente!",
				data: denunciaDelete,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Obtener seguimientos de una denuncia por su ID
const getSeguimientosByDenunciaId = async (request, response) => {
    authenticateToken(request, response, async () => {
        const denunciaId = request.params.id;
        try {
            const seguimientos = await DenunciasSeguimiento.findAll({
                where: { denuncia_id: denunciaId }
            });

            response.status(200).json({
                message: "Los seguimientos de la denuncia fueron obtenidos exitosamente!",
				length: seguimientos.length,
				data: seguimientos,
            });
        } catch (error) {
            console.error("Error: " + error.message);
            response.status(500).send({ message: error.message });
        }
    });
};

// Obtener un seguimiento por su ID
const getSeguimientoById = async (request, response) => {
    authenticateToken(request, response, async () => {
        const seguimientoId = request.params.id;
        try {
            const seguimiento = await DenunciasSeguimiento.findByPk(seguimientoId);
            if (seguimiento) {
                response.status(200).json({
                    message: "El seguimiento fue obtenido exitosamente!",
                    data: seguimiento
                });
            } else {
                response.status(404).json({ message: "Seguimiento no encontrado" });
            }
        } catch (error) {
            console.error("Error: " + error.message);
            response.status(500).send({ message: error.message });
        }
    });
};

// Agregar un seguimiento a una denuncia
const agregarSeguimiento = async (request, response) => {
	authenticateToken(request, response, async () => {
		try {
			// Verificar si la denuncia existe
			const denuncia = await Denuncia.findByPk(request.params.id);
			if (!denuncia) {
				return response
					.status(404)
					.json({ message: "Denuncia no encontrada" });
			}

			// Agregar el seguimiento asociado a la denuncia
			const nuevoSeguimiento = await DenunciasSeguimiento.create({
				fecha: request.body.fecha,
				respuesta: request.body.respuesta,
				proximo_seguimiento: request.body.proximo_seguimiento,
				denuncia_id: request.params.id
			});

			response.status(201).json({
				message: "El seguimiento fue agregado exitosamente!",
				data: nuevoSeguimiento,
			});
		} catch (error) {
			console.error("Error: " + error.message);
			response.status(500).send({ message: error.message });
		}
	});
};

// Modificar un seguimiento
const modificarSeguimiento = async (request, response) => {
    authenticateToken(request, response, async () => {
        const seguimientoId = request.params.id;
        try {
            const [updated] = await DenunciasSeguimiento.update(request.body, {
                where: { id: seguimientoId }
            });
            if (updated) {
                response.status(200).json({
                    message: "El seguimiento fue modificado exitosamente!"
                });
            } else {
                response.status(404).json({ message: "Seguimiento no encontrado" });
            }
        } catch (error) {
            console.error("Error: " + error.message);
            response.status(500).send({ message: error.message });
        }
    });
};

// Eliminar un seguimiento
const eliminarSeguimiento = async (request, response) => {
    authenticateToken(request, response, async () => {
        const seguimientoId = request.params.id;
        try {
            const deleted = await DenunciasSeguimiento.destroy({
                where: { id: seguimientoId }
            });
            if (deleted) {
                response.status(200).json({
                    message: "El seguimiento fue eliminado exitosamente!"
                });
            } else {
                response.status(404).json({ message: "Seguimiento no encontrado" });
            }
        } catch (error) {
            console.error("Error: " + error.message);
            response.status(500).send({ message: error.message });
        }
    });
};

// Exportamos todas las rutas
export {
	createDenuncia,
	getDenuncias,
	getDenunciaById,
	// getDenunciaByIdProfesional,
	updateDenuncia,
	deleteDenuncia,
	getSeguimientosByDenunciaId,
	getSeguimientoById,
	agregarSeguimiento,
	modificarSeguimiento,
	eliminarSeguimiento,
};
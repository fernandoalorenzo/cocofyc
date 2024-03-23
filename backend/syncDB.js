// ************** Ejecutar en la consola node syncDb ****************
// import Usuario from "./models/usuariosModel.js";
// import Rol from "./models/rolesModel.js";
import MedioDePago from "./models/medios_de_pagoModel.js";

import sequelize from "./config/sequelizeConfig.js"; // Ruta a la configuración de Sequelize

async function syncDB() {
	try {
		await MedioDePago.sync({ force: true }); // force: true para forzar la creación de la tabla
		console.log("Tabla creada correctamente.");
	} catch (error) {
		console.error("Error al crear la tabla:", error);
	} finally {
		await sequelize.close(); // Cierra la conexión después de sincronizar
	}
}

syncDB();

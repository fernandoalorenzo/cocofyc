import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Profesional = sequelize.define(
	"tb_profesionales",
	{
		id: {
			// type: DataTypes.BIGINT,
			// primaryKey: true,
			// autoIncrement: true,
			type: DataTypes.UUID, // Tipo UUID
			defaultValue: DataTypes.UUIDV4, // Valor por defecto generado por la función UUIDV4
			primaryKey: true,
		},
		nombre: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		dni: { type: DataTypes.STRING, allowNull: false },
		cuit: DataTypes.STRING,
		telefono: DataTypes.STRING,
		email: DataTypes.STRING,
		matricula: { type: DataTypes.STRING, allowNull: false },
		domicilio: DataTypes.STRING,
		localidad: DataTypes.STRING,
		fecha_nacimiento: DataTypes.DATE,
		imagen: DataTypes.STRING,
		activo: DataTypes.BOOLEAN,
		estado_matricula: DataTypes.STRING,
	},
	{ timestamps: false }
);

(async () => {
	await sequelize.sync(); // Esto sincroniza los modelos con la base de datos

	console.log("Tablas sincronizadas con éxito");
})();

export default Profesional;

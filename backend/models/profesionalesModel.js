import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Profesional = sequelize.define(
	"tb_profesionales",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		nombre: { type: DataTypes.STRING(50), allowNull: false },
		dni: { type: DataTypes.STRING(8), allowNull: false, unique: true },
		cuit: { type: DataTypes.STRING(13), allowNull: true },
		telefono: { type: DataTypes.STRING(30) },
		email: { type: DataTypes.STRING(50) },
		matricula: { type: DataTypes.STRING(10) },
		matricula_fecha: { type: DataTypes.DATEONLY },
		domicilio: { type: DataTypes.STRING(50) },
		localidad: { type: DataTypes.STRING(50) },
		fecha_nacimiento: { type: DataTypes.DATEONLY },
		imagen: { type: DataTypes.STRING(50) },
		activo: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		activo_estado: {
			type: DataTypes.STRING(30),
			allowNull: false,
		},
		estado_matricula_id: { type: DataTypes.UUID },
		observaciones: { type: DataTypes.TEXT },
	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default Profesional;

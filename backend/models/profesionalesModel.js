import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Profesional = sequelize.define(
	"tb_profesionales",
	{
		id: {
			type: DataTypes.UUID, // Tipo UUID
			defaultValue: DataTypes.UUIDV4, // Valor por defecto generado por la función UUIDV4
			primaryKey: true,
		},
		nombre: { type: DataTypes.STRING(50), allowNull: false },
		dni: { type: DataTypes.STRING(8), allowNull: false, unique: true },
		cuit: { type: DataTypes.STRING(13), allowNull: true },
		telefono: DataTypes.STRING(30),
		email: DataTypes.STRING(50),
		matricula: { type: DataTypes.STRING(10), allowNull: false },
		domicilio: DataTypes.STRING(50),
		localidad: DataTypes.STRING(50),
		fecha_nacimiento: DataTypes.DATEONLY,
		imagen: DataTypes.STRING(50),
		activo: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		estado_matricula_id: DataTypes.CHAR(36),
	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default Profesional;
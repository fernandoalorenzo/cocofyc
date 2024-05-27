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
		telefono: DataTypes.STRING(30),
		email: DataTypes.STRING(50),
		matricula: { type: DataTypes.STRING(10) },
		matricula_fecha: DataTypes.DATEONLY,
		domicilio: DataTypes.STRING(50),
		localidad: DataTypes.STRING(50),
		fecha_nacimiento: DataTypes.DATEONLY,
		imagen: DataTypes.STRING(50),
		activo: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		estado_matricula_id: DataTypes.UUID,
	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default Profesional;
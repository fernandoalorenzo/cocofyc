import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Parametros = sequelize.define(
	"tb_parametros",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		titular: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		domicilio: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		localidad: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		telefono: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		instagram: {
			type: DataTypes.STRING(100),
		},
		facebook: {
			type: DataTypes.STRING(100),
		},
		twitter: {
			type: DataTypes.STRING(100),
		},
		cuit: {
			type: DataTypes.STRING(13),
			allowNull: false,
		},
		importe_cuota: {
			type: DataTypes.DECIMAL(20, 2),
		},
	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default Parametros;

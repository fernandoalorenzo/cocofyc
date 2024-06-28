import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Establecimiento = sequelize.define(
	"tb_establecimientos",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		establecimiento: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		titular: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		cuit: {
			type: DataTypes.STRING(13),
			allowNull: true,
			defaultValue: null,
		},
		dni: {
			type: DataTypes.STRING(8),
			allowNull: true,
			defaultValue: null,
		},
		telefono: { type: DataTypes.STRING(30), allowNull: false },
		email: { type: DataTypes.STRING(255), allowNull: false },
		domicilio: DataTypes.STRING(60),
		localidad: DataTypes.STRING(30),
		fecha_inicio: { type: DataTypes.DATEONLY },
		fecha_caducidad: { type: DataTypes.DATEONLY },
	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default Establecimiento;

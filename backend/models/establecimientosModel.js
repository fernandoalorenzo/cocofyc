import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Establecimiento = sequelize.define(
	"tb_establecimientos",
	{
		id: {
			type: DataTypes.UUID, // Tipo UUID
			defaultValue: DataTypes.UUIDV4, // Valor por defecto generado por la función UUIDV4
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
			allowNull: false,
			defaultValue: null,
		},
		telefono: { type: DataTypes.STRING(30), allowNull: false },
		email: { type: DataTypes.STRING(255), allowNull: false },
		domicilio: DataTypes.STRING(60),
		localidad: DataTypes.STRING(30),
	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default Establecimiento;

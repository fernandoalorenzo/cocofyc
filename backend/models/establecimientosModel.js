import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Establecimiento = sequelize.define(
	"tb_establecimientos",
	{
		id: {
			// type: DataTypes.BIGINT,
			// primaryKey: true,
			// autoIncrement: true,
			type: DataTypes.UUID, // Tipo UUID
			defaultValue: DataTypes.UUIDV4, // Valor por defecto generado por la función UUIDV4
			primaryKey: true,
		},
		establecimiento: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		titular: DataTypes.STRING,
		allowNull: false,
		telefono: DataTypes.STRING,
		email: DataTypes.STRING,
		cuit: DataTypes.STRING,
		domicilio: DataTypes.STRING,
		localidad: DataTypes.STRING,
	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default Establecimiento
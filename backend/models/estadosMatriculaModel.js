import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Estado = sequelize.define(
	"tb_estados_matricula",
	{
		id: {
			// type: DataTypes.BIGINT,
			// primaryKey: true,
			// autoIncrement: true,
			type: DataTypes.UUID, // Tipo UUID
			defaultValue: DataTypes.UUIDV4, // Valor por defecto generado por la función UUIDV4
			primaryKey: true,
		},
		estado: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default Estado
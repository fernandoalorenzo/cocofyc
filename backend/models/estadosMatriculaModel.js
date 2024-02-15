import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Estado = sequelize.define(
	"tb_estados",
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		estado: {
			type: DataTypes.STRING,
			allowNull: false,
        }
	},
	{ timestamps: false }
);

export default Estado
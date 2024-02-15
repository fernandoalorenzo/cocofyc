import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Establecimiento = sequelize.define(
	"tb_establecimientos",
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		establecimiento: {
			type: DataTypes.STRING,
			allowNull: false,
        },
        titular: DataTypes.STRING, allowNull: false,
        telefono: DataTypes.STRING,
		email: DataTypes.STRING,
		cuit: DataTypes.STRING,
		domicilio: DataTypes.STRING,
		localidad: DataTypes.STRING,
	},
	{ timestamps: false }
);

export default Establecimiento
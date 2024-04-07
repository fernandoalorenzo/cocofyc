import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Profesionales_Cuotas = sequelize.define(
	"tb_profesionales_cuotas",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		profesional_id: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		cuota_id: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		movimiento_id: {
			type: DataTypes.UUID,
		},
	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default Profesionales_Cuotas;
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
			allowNull: true,
		},
		profesional_id: {
			type: DataTypes.UUID,
		},
		cuota_id: {
			type: DataTypes.UUID,
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
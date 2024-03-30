import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";
import Profesional from "./profesionalesModel.js";
import Cuota from "./cuotasModel.js";

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
			type: DDataTypes.UUID,
			allowNull: false,
		},
		cuota_id: {
			type: DDataTypes.UUID,
			allowNull: false,
		},
		movimiento_id: {
			type: DDataTypes.UUID,
		},
	},
	{
		timestamps: true,
		underscored: true,
	}
);

Profesional.belongsToMany(Cuota, {
	through: Profesionales_Cuotas,
	foreignKey: "profesional_id",
});

Cuota.belongsToMany(Profesional, {
	through: Profesionales_Cuotas,
	foreignKey: "cuota_id",
});

export default Profesionales_Cuotas;
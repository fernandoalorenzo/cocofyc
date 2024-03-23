import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";
import Profesional from "./profesionalesModel.js";
import Cuota from "./cuotasModel.js";

const Profesionales_Cuotas = sequelize.define(
	"tb_profesionales_cuotas",
	{
		id: {
			type: DataTypes.UUID, // Tipo UUID
			defaultValue: DataTypes.UUIDV4, // Valor por defecto generado por la función UUIDV4
			primaryKey: true,
		},
		profesional_id: {
			type: DataTypes.CHAR(36),
			allowNull: false,
		},
		cuota_id: {
			type: DataTypes.CHAR(36),
			allowNull: false,
		},
		movimiento_id: {
			type: DataTypes.CHAR(36),
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
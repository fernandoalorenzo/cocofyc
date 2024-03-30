import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";
import Profesional from "./profesionalesModel.js";
import Establecimiento from "./establecimientosModel.js";

const Profesionales_Establecimientos = sequelize.define(
	"tb_profesionales_establecimientos",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		profesional_id: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		establecimiento_id: {
			type: DataTypes.UUID,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		underscored: true,
	}
);

Profesional.belongsToMany(Establecimiento, {
	through: Profesionales_Establecimientos,
	foreignKey: "profesional_id",
});

Establecimiento.belongsToMany(Profesional, {
	through: Profesionales_Establecimientos,
	foreignKey: "establecimiento_id",
});

export default Profesionales_Establecimientos;
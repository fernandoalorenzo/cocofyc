import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";
import Profesional from "./profesionalesModel.js";
import Matricula from "./matriculasModel.js";

const Profesionales_Matriculas = sequelize.define(
	"tb_profesionales_matriculas",
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
		matricula_id: {
			type: DataTypes.CHAR(36),
			allowNull: false,
		},
		pago_id: {
			type: DataTypes.CHAR(36),
		},
	},
	{
		timestamps: true,
		underscored: true,
	}
);

Profesional.belongsToMany(Matricula, {
	through: Profesionales_Matriculas,
	foreignKey: "profesional_id",
});

Matricula.belongsToMany(Profesional, {
	through: Profesionales_Matriculas,
	foreignKey: "matricula_id",
});

export default Profesionales_Matriculas;
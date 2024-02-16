import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";
import Profesional from "./profesionalesModel.js";

const Estado = sequelize.define(
	"tb_estados_matricula",
	{
		id: {
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

// Definir la asociación con Profesional
Estado.associate = (models) => {
	Estado.hasMany(models.Profesional, {
		foreignKey: "estado_matricula_id",
		as: "profesionales",
	});
};

export default Estado;
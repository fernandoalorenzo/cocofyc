import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Estado = sequelize.define(
	"tb_estados_matricula",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4, 
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
const associate = (models) => {
    const Profesional = models.Profesional;
    Estado.hasMany(Profesional, {
        foreignKey: 'estado_matricula_id',
        as: 'profesionales',
    });
};
export default Estado;
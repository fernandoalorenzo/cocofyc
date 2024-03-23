import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Usuario = sequelize.define(
	"tb_users",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		email: { type: DataTypes.STRING(50), allowNull: false },
		password: { type: DataTypes.STRING(12), allowNull: false },
		nombre: { type: DataTypes.STRING(25), allowNull: false },
		apellido: { type: DataTypes.STRING(25), allowNull: false },
		rol: { type: DataTypes.STRING(36) },
		avatar: DataTypes.STRING(60),
		administrador: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		activo: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default Usuario;
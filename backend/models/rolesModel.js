import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Rol = sequelize.define(
	"tb_roles",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		rol: { type: DataTypes.STRING(20), allowNull: false , unique: true},
	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default Rol;

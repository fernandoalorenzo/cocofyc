import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Aranceles = sequelize.define(
	"tb_aranceles",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		arancel: { type: DataTypes.STRING(30), allowNull: false },
	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default Aranceles;

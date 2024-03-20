import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Matricula = sequelize.define(
	"tb_matriculas",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		user_id: { type: DataTypes.STRING(36), allowNull: false },
		matricula: { type: DataTypes.STRING(10), allowNull: false, unique: true },
		vencimiento: { type: DataTypes.DATE, allowNull: false },
		importe: { type: DataTypes.DECIMAL(20, 2), allowNull: false },
	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default Matricula;
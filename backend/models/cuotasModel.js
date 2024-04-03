import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Cuota = sequelize.define(
	"tb_cuotas",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		user_id: { type: DataTypes.UUID, allowNull: false },
		cuota: { type: DataTypes.STRING(10), allowNull: false, unique: true },
		vencimiento: { type: DataTypes.DATEONLY, allowNull: false },
		importe: { type: DataTypes.DECIMAL(20, 2), allowNull: false },
	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default Cuota;
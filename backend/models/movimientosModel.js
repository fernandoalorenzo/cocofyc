import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Movimientos = sequelize.define(
	"tb_movimientos",
	{
		id: {
			type: DataTypes.UUID, // Tipo UUID
			defaultValue: DataTypes.UUIDV4, // Valor por defecto generado por la función UUIDV4
			primaryKey: true,
		},
		tipo_movimiento: { type: DataTypes.STRING(10), allowNull: false },
		user_id: { type: DataTypes.STRING(36) },
		fecha: { type: DataTypes.DATE, allowNull: false },
		importe: { type: DataTypes.DECIMAL(20, 2), allowNull: false },
		medio: { type: DataTypes.STRING(10), allowNull: false },
		concepto: { type: DataTypes.STRING(255), allowNull: false },
		comprobante: { type: DataTypes.STRING(255) },
	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default Movimientos;
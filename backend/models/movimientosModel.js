import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";
import Usuario from "./usuariosModel.js";

const Movimientos = sequelize.define(
	"tb_movimientos",
	{
		id: {
			type: DataTypes.UUID, // Tipo UUID
			defaultValue: DataTypes.UUIDV4, // Valor por defecto generado por la función UUIDV4
			primaryKey: true,
		},
		user_id: { type: DataTypes.STRING(36) },
		tipo_operacion: { type: DataTypes.STRING(7), allowNull: false },
		fecha: { type: DataTypes.DATEONLY, allowNull: false },
		importe: { type: DataTypes.DECIMAL(20, 2), allowNull: false },
		medio_id: { type: DataTypes.STRING(36), allowNull: false },
		concepto: { type: DataTypes.STRING(255), allowNull: false },
		comprobante: { type: DataTypes.STRING(255) },
	},
	{
		timestamps: true,
		underscored: true,
	}
);

// Definir relaciones
Movimientos.belongsTo(Usuario, { foreignKey: 'user_id' }); // Un movimiento pertenece a un usuario
// Movimientos.belongsTo(Medio, { foreignKey: 'medio_id' }); // Un movimiento pertenece a un medio

export default Movimientos;

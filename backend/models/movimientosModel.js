import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";
import Usuario from "./usuariosModel.js";
import MedioDePago from "./medios_de_pagoModel.js";
import Profesional from "./profesionalesModel.js";

const Movimientos = sequelize.define(
	"tb_movimientos",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		user_id: { type: DataTypes.UUID },
		profesional_id: { type: DataTypes.UUID },
		tipo_operacion: { type: DataTypes.STRING(7), allowNull: false },
		fecha: { type: DataTypes.DATEONLY, allowNull: false },
		importe: { type: DataTypes.DECIMAL(20, 2), allowNull: false },
		medio_id: { type: DataTypes.UUID, allowNull: false },
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
Movimientos.belongsTo(MedioDePago, { foreignKey: "medio_id" }); // Un movimiento pertenece a un medio
Movimientos.belongsTo(Profesional, { foreignKey: "profesional_id" }); // Un movimiento pertenece a un profesional

export default Movimientos;

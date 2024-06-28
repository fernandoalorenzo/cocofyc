import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const DenunciasSeguimientoArchivos = sequelize.define(
	"tb_denuncias_seguimientos_archivos",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		user_id: { type: DataTypes.STRING(36), allowNull: true },
		denuncia_seguimiento_id: { type: DataTypes.UUID, allowNull: false },
		fecha: { type: DataTypes.DATEONLY, allowNull: false },
		archivo: {
			type: DataTypes.STRING(255),
			unique: true,
			allowNull: false,
		},
		archivo_descripcion: { type: DataTypes.STRING(255) },
	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default DenunciasSeguimientoArchivos;
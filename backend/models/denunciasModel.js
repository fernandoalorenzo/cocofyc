import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Denuncia = sequelize.define(
	"tb_denuncias",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		user_id: { type: DataTypes.STRING(36), allowNull: true },
		nro_acta: { type: DataTypes.STRING(10), allowNull: false },
		fecha: { type: DataTypes.DATEONLY, allowNull: false },
		fecha_cierre: { type: DataTypes.DATEONLY },
		profesional_id: { type: DataTypes.STRING(36) },
		establecimiento_id: { type: DataTypes.STRING(36) },
		infraccion: { type: DataTypes.STRING(50), allowNull: false },
		comentario: { type: DataTypes.STRING(500) },
	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default Denuncia;

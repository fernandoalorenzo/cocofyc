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
		tipo_denuncia: { type: DataTypes.STRING(5), allowNull: true },
		nro_comprobante: { type: DataTypes.STRING(10), allowNull: false },
		estado: { type: DataTypes.STRING(8), allowNull: false },
		fecha: { type: DataTypes.DATEONLY, allowNull: false },
		fecha_cierre: { type: DataTypes.DATEONLY },
		persona: { type: DataTypes.STRING(50), allowNull: false },
		dni: { type: DataTypes.STRING(8), allowNull: true },
		cuit: { type: DataTypes.STRING(13), allowNull: true },
		domicilio: { type: DataTypes.STRING(50), allowNull: true },
		localidad: { type: DataTypes.STRING(50), allowNull: true },
		profesional_id: { type: DataTypes.STRING(36) },
		establecimiento_id: { type: DataTypes.STRING(36) },
		redsocial1: { type: DataTypes.STRING(100), allowNull: true },
		redsocial2: { type: DataTypes.STRING(100), allowNull: true },
		redsocial3: { type: DataTypes.STRING(100), allowNull: true },
		infraccion: { type: DataTypes.STRING(50), allowNull: false },
		comentario: { type: DataTypes.STRING(500) },
	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default Denuncia;

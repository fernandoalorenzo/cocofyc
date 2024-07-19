import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Establecimiento = sequelize.define(
	"tb_establecimientos",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		establecimiento: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		id_responsable: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		es_profesional: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		cuit: {
			type: DataTypes.STRING(13),
			defaultValue: null,
		},
		dni: {
			type: DataTypes.STRING(8),
			defaultValue: null,
		},
		telefono: { type: DataTypes.STRING(30), allowNull: false },
		email: { type: DataTypes.STRING(255), allowNull: false },
		domicilio: DataTypes.STRING(60),
		localidad: DataTypes.STRING(30),
		fecha_inicio: { type: DataTypes.DATEONLY },
		fecha_caducidad: { type: DataTypes.DATEONLY },
		nro_tramite: { type: DataTypes.STRING(15) },
		nro_habilitacion: { type: DataTypes.STRING(15) },
		nro_resolucion: { type: DataTypes.STRING(15) },

	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default Establecimiento;

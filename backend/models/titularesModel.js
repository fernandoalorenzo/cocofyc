import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const Titular = sequelize.define(
	"tb_titulares",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		nombre: { type: DataTypes.STRING(50), allowNull: false },
		dni: { type: DataTypes.STRING(8), allowNull: false, unique: true },
		cuit: { type: DataTypes.STRING(13), allowNull: true },
		telefono: { type: DataTypes.STRING(30) },
		email: { type: DataTypes.STRING(50) },
		domicilio: { type: DataTypes.STRING(50) },
		localidad: { type: DataTypes.STRING(50) },
		fecha_nacimiento: { type: DataTypes.DATEONLY },
	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default Titular;
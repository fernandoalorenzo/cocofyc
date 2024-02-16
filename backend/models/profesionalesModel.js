import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";
import Estado from "./estadosMatriculaModel.js";

const Profesional = sequelize.define(
	"tb_profesionales",
	{
		id: {
			type: DataTypes.UUID, // Tipo UUID
			defaultValue: DataTypes.UUIDV4, // Valor por defecto generado por la función UUIDV4
			primaryKey: true,
		},
		nombre: { type: DataTypes.STRING, allowNull: false },
		dni: { type: DataTypes.STRING, allowNull: false, unique: true },
		cuit: DataTypes.STRING,
		telefono: DataTypes.STRING,
		email: DataTypes.STRING,
		matricula: { type: DataTypes.STRING, allowNull: false },
		domicilio: DataTypes.STRING,
		localidad: DataTypes.STRING,
		fecha_nacimiento: DataTypes.DATE,
		imagen: DataTypes.STRING,
		activo: DataTypes.BOOLEAN,
		estado_matricula_id: DataTypes.CHAR(36),
	},
	{
		timestamps: true,
		underscored: true,
	}
);

// Definir la asociación con Estado
Profesional.associate = (models) => {
	Profesional.belongsTo(models.Estado, {
		foreignKey: "estado_matricula_id",
		as: "estadoMatricula",
	});
};

export default Profesional;
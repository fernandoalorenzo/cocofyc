import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";
import Denuncia from "./denunciasModel.js";

const DenunciasSeguimiento = sequelize.define(
	"tb_denuncias_seguimientos",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		user_id: { type: DataTypes.STRING(36) },
		denuncia_id: { type: DataTypes.UUID, allowNull: false },
		fecha: { type: DataTypes.DATEONLY, allowNull: false },
		respuesta: { type: DataTypes.STRING(500) },
		proximo_seguimiento: { type: DataTypes.DATEONLY },
	},
	{
		timestamps: true,
		underscored: true,
	}
);

// Definir la asociación uno a muchos
DenunciasSeguimiento.belongsTo(Denuncia, { foreignKey: "denuncia_id" });

export default DenunciasSeguimiento;

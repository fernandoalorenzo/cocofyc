import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const MedioDePago = sequelize.define(
	"tb_medios_de_pagos",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		medio: { type: DataTypes.STRING(20), allowNull: false },
	},
	{
		timestamps: true,
		underscored: true,
	}
);

export default MedioDePago;

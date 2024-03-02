import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const User = sequelize.define(
	"tb_users",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		email: { type: DataTypes.STRING(50), allowNull: false },
		password: { type: DataTypes.STRING(12), allowNull: false },
		nombre: { type: DataTypes.STRING(50), allowNull: false },
		rol: { type: DataTypes.STRING(20), allowNull: false },
		avatar: DataTypes.STRING(50),
		activo: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	},
	{
		timestamps: true,
		underscored: true,
	}
);

// Antes de crear o actualizar un usuario, hashea la contraseña
User.beforeCreate(async (user) => {
    if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 10); // 10 es el costo de hashing, puede ajustarse según la seguridad necesaria
    }
});

User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        user.password_hash = await bcrypt.hash(user.password, 10);
    }
});

export default User;
import { Sequelize } from "sequelize";

import dotenv from "dotenv";

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const sequelize = new Sequelize(
	"db_cocofyc",
	"root",
	"",
	{
		host: "localhost",
		dialect: "mysql",
		define: {
			timestamps: true,
		},
		// logging: false, // Aquí ajustamos la posición de logging
	},

//  process.env.DB_NAME,
//  process.env.DB_USER,
//  process.env.DB_PASSWORD,
//  {
//    host: process.env.DB_HOST,
//    dialect: "mysql",
//    define: {
//      timestamps: true,
//    },
    // logging: false, // Aquí ajustamos la posición de logging
//  },
);

export default sequelize
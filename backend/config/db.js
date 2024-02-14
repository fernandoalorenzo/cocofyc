import mysql from "mysql2/promise";
import { config } from "dotenv";
config();

const dbConfig = {
	host: `${process.env.DB_HOST}`,
	user: `${process.env.DB_USER}`,
	password: `${process.env.DB_PASSWORD}`,
	database: `${process.env.DB_DATABASE}`,
};

const connect = async () => {
	try {
		const connection = await mysql.createConnection(dbConfig);
		console.log("Conexión a la base de datos establecida correctamente.");
	} catch (error) {
		console.error("Error al conectar a la base de datos:", error.message);
	}
};

export default connect;
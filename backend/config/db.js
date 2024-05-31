import mysql from "mysql2/promise";
import { createPool } from "mysql2/promise";
import { config } from "dotenv";
config();

const dbConfig = {
	host: `${process.env.DB_HOST}` || "localhost",
	user: `${process.env.DB_USER}` || "root",
	password: `${process.env.DB_PASSWORD}` || "",
	database: `${process.env.DB_DATABASE}` || "db_cocofyc",
};

export const pool = createPool(dbConfig);

const connect = async () => {
	try {
		const connection = await mysql.createConnection(dbConfig);
		console.log("Conexión a la base de datos establecida correctamente.");
	} catch (error) {
		console.error("Error al conectar a la base de datos:", error.message);
	}
};

export default connect;
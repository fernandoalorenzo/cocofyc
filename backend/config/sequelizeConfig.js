import { Sequelize } from "sequelize";

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
	}
);

export default sequelize
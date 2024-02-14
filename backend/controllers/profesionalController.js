import { pool } from "../config/db.js";
// import authenticateToken from "../functions/tokenVerify.js";

// Crear un nuevo profesional
const createProfesional = async (request, response) => {
	// authenticateToken(request, response, async () => {
	try {
		const {
			nombre,
			dni,
			cuit,
			email,
			matricula,
			domicilio,
			localidad,
			fecha_nacimiento,
			imagen,
			activo,
			estado_matricula,
		} = request.body;

		const [result] = await pool.query(
			"INSERT INTO tb_profesionales (nombre, dni, cuit, email, matricula, domicilio, localidad, fecha_nacimiento, imagen, activo, estado_matricula) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
			[
				nombre,
				dni,
				cuit,
				email,
				matricula,
				domicilio,
				localidad,
				fecha_nacimiento,
				imagen,
				activo,
				estado_matricula,
			]
		);

		// response.status(201).json({
		// 	id: result.insertId,
		// 	nombre,
		// 	dni,
		// 	cuit,
		// 	email,
		// 	matricula,
		// 	domicilio,
		// 	localidad,
		// 	fecha_nacimiento,
		// 	imagen,
		// 	activo,
		// 	estado_matricula,
		// });

		if (result.affectedRows > 0) {
			response.status(201).json({
				message: "El profesional fue creado exitosamente!",
				data: {
					id: result.insertId,
					nombre,
					dni,
					cuit,
					email,
					matricula,
					domicilio,
					localidad,
					fecha_nacimiento,
					imagen,
					activo,
					estado_matricula,
				},
			}); // Devuelve los datos del post creado
		} else {
			throw new Error("No se pudo crear el profesional."); // Lanza un error si la inserción no fue exitosa
		}
	} catch (error) {
		console.log("Error: " + error.message);
		response.status(500).send({ message: error.message });
	}
	// });
};

// Obtener todos los profesionales
const getProfesionales = async (request, response) => {
	// authenticateToken(request, response, async () => {
	try {
		const [rows] = await pool.query("SELECT * FROM tb_profesionales");
		response.status(200).json(rows);
	} catch (err) {
		console.error(err);
		response
			.status(500)
			.json({ error: "Error al obtener listado de profesionales" });
	}
	// try {
	// 	const posts = await Post.find({}).sort({ createdAt: -1 });
	// 	return response.status(200).json({
	// 		count: posts.length,
	// 		data: posts,
	// 	});
	// } catch (error) {
	// 	console.log(error.message);
	// 	response.status(500).send({ message: error.message });
	// }
	// });
};

// Obtener un profesional por Id
const getProfesionalById = async (request, response) => {
	// 	authenticateToken(request, response, async () => {
	const profesional_Id = request.params.id;
	try {
		const [rows] = await pool.query(
			"SELECT * FROM tb_profesionales WHERE id = ?",
			[profesional_Id]
		);
		if (rows.length === 0) {
			response.status(404).json({ error: "Profesional no encontrado" });
		} else {
			response.status(200).json(rows[0]);
		}
	} catch (err) {
		console.error(err);
		response.status(500).json({ error: "Error al obtener el profesional" });
	}
	// 	});
};

// Actualizar profesionales
const updateProfesional = async (request, response) => {
	// 	authenticateToken(request, response, async () => {
	const profesional_Id = request.params.id;
	const {
		nombre,
		dni,
		cuit,
		email,
		matricula,
		domicilio,
		localidad,
		fecha_nacimiento,
		imagen,
		activo,
		estado_matricula,
	} = request.body;
	try {
		const [result] = await pool.query(
			"UPDATE tb_profesionales SET nombre = ?, dni = ?, cuit = ?, email = ?, matricula = ?, domicilio = ?, localidad = ?, fecha_nacimiento = ?, imagen = ?, activo = ?, estado_matricula = ? WHERE id = ?",
			[
				nombre,
				dni,
				cuit,
				email,
				matricula,
				domicilio,
				localidad,
				fecha_nacimiento,
				imagen,
				activo,
				estado_matricula,
				profesional_Id,
			]
		);

		if (result.affectedRows === 0) {
			return response.status(404).json({ error: "Profesional no encontrado" });
		} else {
			response.status(200).json({
				message: "Profesional actualizado exitosamente!",
			})
		}

		response.status(200).json({
			id: profesional_Id,
			nombre,
			dni,
			cuit,
			email,
			matricula,
			domicilio,
			localidad,
			fecha_nacimiento,
			imagen,
			activo,
			estado_matricula,
		});
	} catch (err) {
		console.error(err);
		response.status(500).json({ error: "Error al actualizar el profesional" });
	}
	// 	});
};

// Eliminar un profesional
const deleteProfesional = async (request, response) => {
	// 	authenticateToken(request, response, async () => {
	const profesional_Id = request.params.id;
	try {
		const [result] = await pool.query(
			"DELETE FROM tb_profesionales WHERE id = ?",
			[profesional_Id]
		);
		if (result.affectedRows === 0) {
			return response
				.status(404)
				.json({ error: "Profesional no encontrado" });
		} else {
			response
				.status(200)
				.json({ message: "Profesional eliminado exitosamente!" });
		}
		response.status(204).end(); // Respond with a 204 No Content status
	} catch (err) {
		console.error(err);
		response
			.status(500)
			.json({ error: "Error al eliminar el profesional" });
	}
	// 	});
};

// Exportamos todas las rutas
// export { createProfesional, getProfesionales, getProfesionalById, updateProfesional, deleteProfesional };
export {
	createProfesional,
	getProfesionales,
	getProfesionalById,
	updateProfesional,
	deleteProfesional,
};

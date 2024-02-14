import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "dotenv";
config();

// Crear un nuevo usuario
const createUser = async (request, response) => {
	try {
		// verifica si el correo que intenta registrar existe
		const existUser = await User.findOne({ email: request.body.email });
		if (existUser) {
			return response
				.status(400)
				.json({ message: "El correo ya está registrado." });
		}

		const user = await User.create(request.body);

		return response.status(201).send({
			message: "El usuario fue creado exitosamente!",
			data: user,
		});
	} catch (error) {
		console.log(error.message);
		response.status(500).send({ message: "Error interno del servidor" });
	}
};

// Obtener todos los usuarios
const getUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Obtener un usuario por Id
const getUserById = async (request, response) => {
	try {
		const { id } = request.params;
		const user = await User.findById(id);
		return response.status(200).json(user);
	} catch (error) {
		console.log(error.message);
		response.status(500).send({ message: error.message });
	}
};

// Actualizar usuarios
const updateUser = async (request, response) => {
	try {
		const { id } = request.params;
		const { newPassword, ...updateData } = request.body;

		if (newPassword) {
			// Si hay una nueva contraseña, hashea y actualiza
			const hashedPassword = await bcrypt.hash(newPassword, 10);
			updateData.password = hashedPassword;
		}

		const result = await User.findByIdAndUpdate(id, updateData);

		if (!result) {
			return response
				.status(404)
				.json({ message: "El usuario no fue encontrado!" });
		}
		return response
			.status(200)
			.json({ message: "El usuario fue actualizado exitosamente!" });
	} catch (error) {
		console.log(error.message);
		response.status(500).send({ message: error.message });
	}
};

// Eliminar un usuario
const deleteUser = async (request, response) => {
	try {
		const { id } = request.params;
		const result = await User.findByIdAndDelete(id);
		if (!result) {
			return response
				.status(404)
				.json({ message: "El usuario no fue encontrado!" });
		}
		return response
			.status(200)
			.json({ message: "El usuario fue eliminado exitosamente!" });
	} catch (error) {
		console.log(error.message);
		response.status(500).send({ message: error.message });
	}
};

// Login
const loginUser = async (req, res) => {
	const secret = process.env.SECRET;
	try {
		const { email, password, id, nombre, apellido, rol } = req.body;

		// Verificar si el usuario existe en la base de datos
		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(401)
				.json({ message: "El email no está registrado" });
		}

		// Verificar que la contraseña coincida
		const passwordOk = await bcrypt.compare(password, user.password);
		if (!passwordOk) {
			return res
				.status(401)
				.json({ message: "La contraseña es incorrecta" });
		}

		// Generar el token JWT
		const token = jwt.sign(
			{
				id: user._id,
				nombre: nombre,
				apellido: apellido,
				email: email,
				rol: rol,
			},
			secret,
			{
				expiresIn: process.env.TOKEN_EXPIRES_IN,
			}
		);

		// Devolver el token y la info del usuario logueado
		res.status(200).json({
			token,
			user: {
				nombre: user.nombre,
				apellido: user.apellido,
				email: user.email,
				id: user._id,
			},
		});
	} catch (error) {
		console.error("Error en el inicio de sesión:", error);
		res.status(500).json({ message: "Error interno del servidor" });
	}
};

// Validar Contraseña
const validatePassword = async (request, response) => {
	try {
		const { id } = request.params;
		const { currentPassword } = request.body;

		const user = await User.findById(id);

		if (!user) {
			return response.status(404).json({ message: "Usuario no encontrado" });
		}

		const passwordMatch = await bcrypt.compare(
			currentPassword,
			user.password
		);

		if (passwordMatch) {
			return response
				.status(200)
				.json({ message: "La contraseña ingresada es válida" });
		} else {
			return response
				.status(401)
				.json({ message: "La contraseña ingresada es incorrecta" });
		}
	} catch (error) {
		console.error("Error al validar la contraseña actual:", error);
		response.status(500).json({ message: "Error interno del servidor" });
	}
};

// Actualizar contraseña
const updatePassword = async (request, response) => {
	try {
		const { id } = request.params;
		const { newPassword } = request.body;

		// Encriptar la nueva contraseña
		const hashedNewPassword = await bcrypt.hash(newPassword, 10);

		// Realizar la actualización de la contraseña en la base de datos
		const result = await User.findByIdAndUpdate(id, {
			password: hashedNewPassword,
		});

		if (!result) {
			return response
				.status(404)
				.json({ message: "El usuario no fue encontrado!" });
		}

		return response
			.status(200)
			.json({ message: "La contraseña fue actualizada exitosamente!" });
	} catch (error) {
		console.error("Error al actualizar la contraseña:", error);
		response.status(500).json({ message: error.message });
	}
};


// Exportamos todas las rutas
export {
	createUser,
	getUsers,
	getUserById,
	updateUser,
	deleteUser,
	loginUser,
	validatePassword,
	updatePassword,
};

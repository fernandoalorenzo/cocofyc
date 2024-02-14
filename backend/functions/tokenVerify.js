import jwt from "jsonwebtoken";

const authenticateToken = (request, response, next) => {

	const token = request.header("Authorization");
	const user = request.body.usuario;

	if (!token) {
		return response.status(401).json({ message: "Acceso no autorizado" });
	} else {
		jwt.verify(token, process.env.SECRET, (err, decoded) => {
			if (err) {
				console.log("Error: " + err.name);

				return response.status(403).json({
					Mensaje: "Existe algun problema en el Token - " + err.name,
				});
			}
			request.user = decoded;
			next();
		});
	}

};

export default authenticateToken
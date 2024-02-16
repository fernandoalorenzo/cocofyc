import { useEffect, useState } from "react";
import CardsList from "../components/cards/CardsList";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


export default function Home() {
	const navigate = useNavigate();
	const [tokenExpired, setTokenExpired] = useState(false);

	useEffect(() => {
		const user = localStorage.getItem("user");
		const token = localStorage.getItem("token");

		// Si no hay datos de usuario o token, redirige a la página de inicio de sesión
		if (!user || !token) {
			navigate("/login");
		} else {
			// Verificar si el token ha expirado
			const decodedToken = jwtDecode(token);
			const currentTime = Date.now() / 1000;

			if (decodedToken.exp < currentTime) {
				setTokenExpired(true);

				// Eliminar datos del usuario y token
				localStorage.removeItem("user");
				localStorage.removeItem("token");
			}
		}
	}, [navigate]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			const token = localStorage.getItem("token");
			if (token) {
				const decodedToken = jwtDecode(token);
				const currentTime = Date.now() / 1000;

				if (decodedToken.exp < currentTime) {
					setTokenExpired(true);

					// Eliminar datos del usuario y token
					localStorage.removeItem("user");
					localStorage.removeItem("token");
				}
			}
			// }, 300000); // 5 minutos en milisegundos
		}, 60000); // 1 MINUTO

		// Limpiar el intervalo al desmontar el componente
		return () => clearInterval(intervalId);
	}, []);

	// Redirigir si el token ha expirado
	useEffect(() => {
		if (tokenExpired) {
			navigate("/login");
		}
	}, [tokenExpired, navigate]);
	
	return (
		<>
			<CardsList />
		</>
	);
}

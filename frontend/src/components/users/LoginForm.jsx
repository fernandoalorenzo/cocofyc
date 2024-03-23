import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiConnection from "../../../../backend/functions/apiConnection";
import backgroundImage from "./../../assets/img/login.jpg";
import viewImage from "./../../assets/img/view.png";
import hideImage from "./../../assets/img/hide.png";

const LoginForm = () => {
	const [loginData, setLoginData] = useState({
		email: "",
		password: "",
	});

	// Estado de error en los datos de logueo
	const [error, setError] = useState(null);

	const [loading, setLoading] = useState(false); // Nuevo estado para indicar carga

	const [showPassword, setShowPassword] = useState(false); // Estado para mostrar u ocultar la contraseña

	const navigate = useNavigate();

	const onInputChange = (event) => {
		setLoginData({
			...loginData,
			[event.target.name]: event.target.value,
		});
	};

	const validateForm = () => {
		// Validación básica de correo electrónico y contraseña
		if (!loginData.email || !loginData.password) {
			setError("Por favor, complete todos los campos.");
			return false;
		}
		return true;
	};

	const toggleShowPassword = () => {
		setShowPassword(!showPassword); // Cambiar el estado de mostrar u ocultar contraseña
	};

	const onLogin = async (event) => {
		event.preventDefault();

		if (!validateForm()) return;

		setLoading(true);

		try {
			const response = await fetch(
				"http://localhost:5000/api/usuarios/login",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(loginData),
				}
			);

			if (response.ok) {
				const { token, user } = await response.json();
				// Guarda la info de usuario en localStorage
				localStorage.setItem("token", token);
				localStorage.setItem("user", JSON.stringify(user));

				const fetchParametros = async () => {
					try {
						const endpoint =
							"http://localhost:5000/api/parametros/";
						const direction = "1";
						const method = "GET";
						const body = false;
						const headers = {
							"Content-Type": "application/json",
							Authorization: localStorage.getItem("token"),
						};

						const response = await apiConnection(
							endpoint,
							direction,
							method,
							body,
							headers
						);

						if (response) {
							return response.data;
						} else {
							console.error(
								"Error al obtener los datos de los parametros:",
								response.statusText
							);
						}
					} catch (error) {
						console.error(
							"Error al obtener los datos de los parametros:",
							error
						);
					}
				};

				const parametrosResponse = await fetchParametros();

				if (parametrosResponse) {
					localStorage.setItem(
						"parametros",
						JSON.stringify(parametrosResponse)
					);
				}

				navigate("/");
			} else {
				const data = await response.json();

				// Ocultar el mensaje de error pasados 3 segundos
				setTimeout(() => {
					setError(null);
				}, 3000);

				setError(data.message || "Error en el inicio de sesión.");
			}
		} catch (error) {
			console.error("Error al iniciar sesión:", error);
			setError(
				"Error en el inicio de sesión. Inténtalo de nuevo más tarde."
			);

			// Ocultar el mensaje de error después de 3 segundos
			setTimeout(() => {
				setError(null);
			}, 3000);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div
				className="d-flex align-items-center justify-content-center"
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh", // Ajusta la altura mínima para ocupar toda la pantalla
					background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage})`,
					backgroundSize: "cover",
				}}>
				<form
					onSubmit={onLogin}
					className="p-4 bg-white rounded shadow-lg">
					<div className="mb-3">
						<label htmlFor="email" className="form-label">
							Email
						</label>
						<input
							type="email"
							className="form-control"
							id="email"
							name="email"
							value={loginData.email}
							onChange={onInputChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="password" className="form-label">
							Contraseña
						</label>
						<div className="input-group mb-3">
							<input
								type={showPassword ? "text" : "password"}
								className="form-control"
								id="password"
								name="password"
								value={loginData.password}
								onChange={onInputChange}
								required
							/>
							<img
								onClick={toggleShowPassword}
								src={showPassword ? hideImage : viewImage}
								className="input-group-text p-2"
								style={{
									maxWidth: "2.375em",
									maxHeight: "2.375em",
								}}
								alt={
									showPassword
										? "Ocultar contraseña"
										: "Mostrar contraseña"
								}
							/>
						</div>
					</div>
					{error && <div className="alert alert-danger">{error}</div>}
					<button
						type="submit"
						className="btn btn-primary w-100"
						disabled={loading}>
						{loading ? "Cargando..." : "Iniciar sesión"}
					</button>
				</form>
			</div>
		</>
	);
};

export default LoginForm;

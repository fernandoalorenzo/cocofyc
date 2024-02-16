/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const LoginForm = () => {
	const [loginData, setLoginData] = useState({
		email: "",
		password: "",
	});

	// Estado de error en los datos de logueo
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	const onInputChange = (event) => {
		setLoginData({
			...loginData,
			[event.target.name]: event.target.value,
		});
	};

	const onLogin = async (event) => {
		event.preventDefault();

		try {
			const response = await fetch("http://localhost:5000/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(loginData),
			});

			if (response.ok) {
				const { token, user } = await response.json();
				// Guarda la info de usuario en localStorage
				localStorage.setItem("token", token);
				localStorage.setItem("user", JSON.stringify(user));
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
		}
	};

	// DESACTIVAR EL SCROLL VERTICAL AL MONTAR EL COMPONENTE
	useEffect(() => {
		document.body.style.overflowY = "hidden";
		return () => {
			document.body.style.overflowY = "auto";
		};
	}, []);

	return (
		<>
			<section className="vh-100 gradient-custom">
				<form onSubmit={onLogin}>
					<div className="container vh-100">
						<div className="row d-flex justify-content-center align-items-center pt-5">
							<div className="col-12 col-md-8 col-lg-6 col-xl-5">
								<div
									className="card bg-dark text-white mt-2"
									style={{ borderRadius: "1rem" }}>
									<div className="card-body p-4 text-center p-0">
										<div className="mb-md-4">
											<h2 className="fw-bold mb-2 text-uppercase">
												Login
											</h2>
											<p className="text-white-50 mb-5">
												Ingrese su e-mail y contraseña
											</p>
											<div className="form-outline form-white mb-4">
												<input
													type="email"
													className="form-control form-control-lg"
													name="email"
													value={loginData.email}
													onChange={onInputChange}
													required
												/>
												<div className="row align-items-start">
													<label className="form-label text-start">
														Email
													</label>
												</div>
											</div>

											<div className="form-outline form-white mb-4">
												<input
													type="password"
													className="form-control form-control-lg"
													name="password"
													value={loginData.password}
													onChange={onInputChange}
													required
												/>
												<div className="row align-items-start">
													<label className="form-label text-start">
														Contraseña
													</label>
												</div>
											</div>

											<button
												className="btn btn-outline-light btn-lg px-5"
												type="submit">
												Login
											</button>

											<div className="mb-3">
												{error && (
													<div
														className="alert alert-danger border border-danger mt-4 border-3"
														role="alert">
														<strong>{error}</strong>
													</div>
												)}
											</div>
										</div>

										<div>
											<p className="mb-0">
												No tiene una cuenta?{" "}
												<span></span>
												<Link
													to="/register"
													className="text-white-50 fw-bold">
													Registrarse
												</Link>
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</section>
		</>
	);
};

export default LoginForm;
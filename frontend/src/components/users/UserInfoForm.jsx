/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastErrorGenerico, ToastOK } from "../toast/Toast.jsx";
import { ToastError } from "../toast/Toast.jsx";
import { Toaster } from "react-hot-toast";

const UserInfoForm = ({ isUpdating }) => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		nombre: "",
		apellido: "",
	});

	const navigate = useNavigate();

	const user = JSON.parse(localStorage.getItem("user"));
	const userId = user ? user.id : null;

	// DESACTIVAR EL SCROLL VERTICAL AL MONTAR EL COMPONENTE
	// VERIFICAR SI ESTA LOGUEADO PARA DERIVAR AL REGISTRO
	useEffect(() => {
		document.body.style.overflowY = "hidden";

		const currentPath = window.location.pathname;
		const user = localStorage.getItem("user");
		const token = localStorage.getItem("token");

		// SI INTENTA ENTRAR A PROFILE Y NO HAY USUARIO, VA A REGISTER
		if (currentPath === "/profile" && !user && !token) {
			localStorage.removeItem("user");
			localStorage.removeItem("token");
			navigate("/login");
		}

		// SI ESTA ACTUALIZANDO PERFIL OBTENEMOS LOS DATOS DEL USUARIO
		if (isUpdating && userId) {
			fetchUserData(userId);
		}

		return () => {
			document.body.style.overflowY = "auto";
		};
	}, [navigate, isUpdating, userId]);

	const fetchUserData = async (userId) => {
		try {
			const response = await fetch(
				`http://localhost:5000/users/${userId}`
			);
			if (response.ok) {
				const userData = await response.json();
				setFormData(userData);
			} else {
				ToastErrorGenerico("Error al cargar los datos del usuario");
			}
		} catch (error) {
			console.error("Error al cargar los datos del usuario:", error);
			ToastError("Error al cargar los datos del usuario");
		}
	};

	const onSubmit = async (event) => {
		event.preventDefault();

		try {
			const url = isUpdating
				? `http://localhost:5000/users/${userId}`
				: "http://localhost:5000/users";
			const method = isUpdating ? "PUT" : "POST";

			const response = await fetch(url, {
				method: method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				const successMessage = isUpdating
					? ToastOK("Perfil", "actualizado")
					: ToastOK("Usuario", "registrado");

				// Actualiza el nombre en el localStorage si el nombre ha cambiado
				const updatedUser = JSON.parse(localStorage.getItem("user"));
				if (updatedUser && updatedUser.nombre !== formData.nombre) {
					updatedUser.nombre = formData.nombre;
					localStorage.setItem("user", JSON.stringify(updatedUser));
				}
				setTimeout(() => {
					navigate(isUpdating ? "/" : "/login");
				}, 2000);
			} else {
				const data = await response.json();
				ToastErrorGenerico(data.message);
			}
		} catch (error) {
			console.error("Error al registrar/actualizar:", error);
			ToastErrorGenerico(
				"Error en el registro/actualización. Inténtalo de nuevo más tarde."
			);
		}
	};

	const handleChange = (event) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});
	};

	return (
		<>
			<section className="vh-100 gradient-custom">
				<form onSubmit={onSubmit}>
					<div className="container vh-100">
						<div className="row d-flex justify-content-center align-items-center">
							<div className="col-12 col-md-8 col-lg-6 col-xl-5">
								<div
									className="card bg-dark text-white mt-5"
									style={{ borderRadius: "1rem" }}>
									<div className="card-body p-4 text-center pb-0">
										<div className="mb-md-4">
											<h2 className="fw-bold mb-2 text-uppercase">
												{isUpdating
													? "Actualización de Perfil"
													: "Registro"}
											</h2>

											<div className="form-outline form-white mb-2">
												<input
													type="nombre"
													className="form-control form-control-lg"
													name="nombre"
													value={formData.nombre}
													onChange={handleChange}
													required
												/>
												<div className="row align-items-start">
													<label className="form-label text-start">
														Nombre
													</label>
												</div>
											</div>

											<div className="form-outline form-white mb-2">
												<input
													type="apellido"
													className="form-control form-control-lg"
													name="apellido"
													value={formData.apellido}
													onChange={handleChange}
												/>
												<div className="row align-items-start">
													<label className="form-label text-start">
														Apellido
													</label>
												</div>
											</div>

											<div className="form-outline form-white mb-2">
												<input
													type="email"
													className="form-control form-control-lg"
													name="email"
													value={formData.email}
													onChange={handleChange}
													required
												/>
												<div className="row align-items-start">
													<label className="form-label text-start">
														Email
													</label>
												</div>
											</div>
											{!isUpdating && (
												<>
													<div className="form-outline form-white mb-2">
														<input
															type="password"
															className="form-control form-control-lg"
															name="password"
															value={
																formData.password
															}
															onChange={
																handleChange
															}
															required
														/>
														<div className="row align-items-start">
															<label className="form-label text-start">
																Password
															</label>
														</div>
													</div>
												</>
											)}
											<button
												className="btn btn-outline-light btn-lg me-2 mb-3"
												type="submit">
												{isUpdating
													? "Actualizar"
													: "Registrar"}
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</section>
			<Toaster />
		</>
	);
};

export default UserInfoForm;

/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastErrorGenerico, ToastOK } from "../toast/Toast.jsx";
import { ToastError } from "../toast/Toast.jsx";
import { Toaster } from "react-hot-toast";

const UserPasswordForm = () => {
	const [formData, setFormData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const [currentPasswordError, setCurrentPasswordError] = useState("");
	const [passwordsMatchError, setPasswordsMatchError] = useState("");

	const navigate = useNavigate();

	const user = JSON.parse(localStorage.getItem("user"));
	const userId = user ? user.id : null;

	// DESACTIVAR EL SCROLL VERTICAL AL MONTAR EL COMPONENTE
	useEffect(() => {
		document.body.style.overflowY = "hidden";

		return () => {
			document.body.style.overflowY = "auto";
		};
	}, []);

	const handleChange = (event) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});
	};

	const validateCurrentPassword = async () => {
		try {
			const response = await fetch(
				`http://localhost:5000/users/validate-password/${userId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: localStorage.getItem("token"),
					},
					body: JSON.stringify({
						currentPassword: formData.currentPassword,
					}),
				}
			);

			const data = await response.json();

			if (response.status === 200) {
				// Contraseña actual válida
				setCurrentPasswordError("");
				return true;
			} else {
				// Contraseña actual incorrecta
				setCurrentPasswordError(data.message);
				return false;
			}
		} catch (error) {
			console.error("Error al validar la contraseña actual:", error);
			setCurrentPasswordError(
				"Error al validar la contraseña actual"
			);

			return false;
		}
	};

	const validatePasswords = () => {
		// Verificar si las contraseñas coinciden
		if (formData.newPassword !== formData.confirmPassword) {
			setPasswordsMatchError("Las contraseñas no coinciden");
			return false;
		} else {
			setPasswordsMatchError("");
			return true;
		}
	};

	const onSubmit = async (event) => {
		event.preventDefault();

		// Validar la contraseña actual
		const isCurrentPasswordValid = await validateCurrentPassword();

		if (!isCurrentPasswordValid) {
			// Si la contraseña actual no es válida, no continuar con la actualización
			return;
		}

		// Validar las contraseñas
		if (!validatePasswords()) {
			return;
		}

		try {
			// Procedimiento para actualizar la contraseña
			const updateResponse = await fetch(
				`http://localhost:5000/users/update-password/${userId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: localStorage.getItem("token"),
					},
					body: JSON.stringify({
						newPassword: formData.newPassword,
					}),
				}
			);

			const updateData = await updateResponse.json();

			if (updateResponse.status === 200) {
				ToastOK("Contraseña", "actualizada");

				// Eliminar token y usuario del localStorage
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				
				setTimeout(() => {
					navigate("/login");
				}, 1000);
			} else {
				// Error al actualizar la contraseña
				ToastError(updateData.message);
			}
		} catch (error) {
			console.error("Error al enviar la solicitud:", error);
			ToastErrorGenerico();
		}
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
											<h4 className="fw-bold mb-4 text-uppercase">
												Actualización de Contraseña
											</h4>

											{/* CONTRASEÑA ACTUAL */}
											<div className="form-outline form-white mb-2">
												<input
													type="password"
													className={`form-control form-control-lg ${
														currentPasswordError
															? "is-invalid"
															: ""
													}`}
													name="currentPassword"
													value={
														formData.currentPassword
													}
													onChange={handleChange}
													required
												/>
												<div className="row align-items-start">
													<label className="form-label text-start">
														Contraseña Actual
													</label>
												</div>
												{currentPasswordError && (
													<div className="invalid-feedback">
														{currentPasswordError}
													</div>
												)}
											</div>

											{/* CONTRASEÑA NUEVA */}
											<div className="form-outline form-white mb-2">
												<input
													type="password"
													className={`form-control form-control-lg ${
														passwordsMatchError
															? "is-invalid"
															: ""
													}`}
													name="newPassword"
													value={
														formData.newPassword
													}
													onChange={handleChange}
													required
												/>
												<div className="row align-items-start">
													<label className="form-label text-start">
														Nueva Contraseña
													</label>
												</div>
												{passwordsMatchError && (
													<div className="invalid-feedback">
														{passwordsMatchError}
													</div>
												)}
											</div>

											{/* CONFIRMAR CONTRASEÑA NUEVA */}
											<div className="form-outline form-white mb-2">
												<input
													type="password"
													className="form-control form-control-lg"
													name="confirmPassword"
													value={
														formData.confirmPassword
													}
													onChange={handleChange}
													required
												/>
												<div className="row align-items-start">
													<label className="form-label text-start">
														Confirmar Contraseña
													</label>
												</div>
												{passwordsMatchError && (
													<div className="invalid-feedback">
														{passwordsMatchError}
													</div>
												)}
											</div>

											<button
												className="btn btn-outline-light btn-lg me-2 mb-3"
												type="submit">
												Actualizar
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

export default UserPasswordForm;

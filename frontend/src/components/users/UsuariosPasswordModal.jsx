import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";

const PasswordModal = ({ showModalPassword, closeModalPassword, usuario }) => {
	const initialState = {
		password1: "",
		password2: "",
	};

	const [formData, setFormData] = useState(initialState);
	const [showPassword1, setShowPassword1] = useState(false); // Estado para mostrar/ocultar contraseña 1
	const [showPassword2, setShowPassword2] = useState(false); // Estado para mostrar/ocultar contraseña 2
	const [showPassword, setShowPassword] = useState(false);

	// FUNCION PARA ACTUALIZAR LOS DATOS
	const handleFormSubmit = async (e) => {
		e.preventDefault();

		try {
			const endpoint = "http://127.0.0.1:5000/api/usuarios/";
			const direction = `${data.id}`;
			const method = "PATCH";
			const body = formData;

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
				Swal.fire({
					icon: "success",
					title: "Operación exitosa!",
					text: "Registro guardado exitosamente.",
					showConfirmButton: false,
					timer: 2500,
				});

				// CERRAR MODAL
				setTimeout(() => {
					closeModalAndResetData();
				}, 2500);
			} else {
				console.error("Error en la operación:", response.error);
			}
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Error al guardar el registro",
				text: "Ocurrió un error al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.",
				showConfirmButton: false,
				timer: 2500,
			});
			console.error("Error:", error.message);
		}
	};

	// FUNCION PARA CONTROLAR LA VISUALIZACION DE LA CONTRASEÑA 1
	const toggleShowPassword1 = () => {
		setShowPassword1(!showPassword1);
	};

	// FUNCION PARA CONTROLAR LA VISUALIZACION DE LA CONTRASEÑA 2
	const toggleShowPassword2 = () => {
		setShowPassword2(!showPassword2);
	};

	// FUNCION PARA CONTROLAR LOS INPUTS
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	// CERRAR MODAL
	const closeModalAndResetData = () => {
		setFormData(initialState);
		closeModalPassword();
	};

	return (
		<div
			className={`modal fade ${showModalPassword ? "show" : ""}`}
			tabIndex="-1"
			style={{ display: showModalPassword ? "block" : "none" }}
			id="staticBackdrop"
			data-bs-target="#staticBackdrop"
			data-bs-backdrop="static"
			data-bs-keyboard="false"
			aria-labelledby="staticBackdropLabel"
			aria-hidden={!showModalPassword}>
			<div className="modal-dialog modal-sm">
				<div className="modal-content bg-secondary">
					<div className="modal-header bg-primary">
						<h5 className="modal-title">Cambiar contraseña</h5>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={closeModalAndResetData}></button>
					</div>
					<div className="modal-body">
						<div className="container-fluid">
							<div className="row mb-3">
								<div className="col">
									<label htmlFor="password1">
										Contraseña
									</label>
									<div className="input-group mb-3">
										<input
											type={
												showPassword1
													? "text"
													: "password"
											}
											className="form-control"
											id="password1"
											name="password1"
											value={formData.password1}
											onChange={handleInputChange}
											required
										/>
										<i
											onClick={toggleShowPassword1}
											className={
												"fa-regular " +
												(showPassword1
													? "fa-eye-slash"
													: "fa-eye") +
												" input-group-text"
											}
											alt={
												showPassword1
													? "hidepass"
													: "viewpass"
											}></i>
									</div>
								</div>
							</div>
							<div className="row mb-3">
								<div className="col">
									<label htmlFor="password2">
										Repita la contraseña
									</label>
									<div className="input-group mb-3">
										<input
											type={
												showPassword2
													? "text"
													: "password"
											}
											className="form-control"
											id="password2"
											name="password2"
											value={formData.password2}
											onChange={handleInputChange}
											required
										/>
										<i
											onClick={toggleShowPassword2}
											className={
												"fa-regular " +
												(showPassword2
													? "fa-eye-slash"
													: "fa-eye") +
												" input-group-text"
											}
											alt={
												showPassword2
													? "hidepass"
													: "viewpass"
											}></i>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/* Botones */}
					<div className="modal-footer bg-dark justify-content-around">
						<div className="row mb-3 justify-content-center">
							<div className="col-auto">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={closeModalAndResetData}>
									<i className="fas fa-times me-1"></i>{" "}
									Cancelar
								</button>
							</div>
							<div className="col-auto">
								<button
									type="button"
									className="btn btn-primary"
									onClick={handleFormSubmit}>
									<i className="fas fa-save me-1"></i> Guardar
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default PasswordModal;

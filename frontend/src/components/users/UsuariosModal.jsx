import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import { useForm } from "react-hook-form";

const UsuariosModal = ({
	showModal,
	closeModal,
	data,
	modalMode,
	fetchUsuarios,
}) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
		// getValues,
		watch,
		setValue,
	} = useForm();

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data, reset]);

	const initialState = {
		nombre: "",
		apellido: "",
		email: "",
		administrador: false,
		activo: false,
		password1: "",
		password2: "",
	};

	useEffect(() => {
		if (modalMode === "agregar") {
			reset(initialState);
		} else if (data) {
			reset(data);
		}
	}, [modalMode]);

	// FUNCION PARA ACTUALIZAR LOS DATOS
	const onSubmit = async (formData) => {
		if (
			modalMode === "agregar" &&
			formData.password1 !== formData.password2
		) {
			Swal.fire({
				icon: "error",
				title: "Error al guardar el registro",
				text: "Las contraseñas no coinciden.",
				showConfirmButton: true,
			});
			return;
		} else if (modalMode === "agregar") {
			formData.password = formData.password1;
			delete formData.password1;
			delete formData.password2;
		}

		console.log("formData:", formData);

		try {
			const endpoint = "http://127.0.0.1:5000/api/usuarios/";
			const direction = formData.id ? `${formData.id}` : "";
			const method = formData.id ? "PATCH" : "POST";
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
					closeModal();
					fetchUsuarios();
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

	const password1 = watch("password1");
	const password2 = watch("password2");

	// FUNCION PARA CONTROLAR EL CHECKBOX
	const handleSwitchChange = (e) => {
		const { id, checked } = e.target;
		setValue(id, checked);
	};

	return (
		<div
			className={`modal fade ${showModal ? "show" : ""}`}
			tabIndex="-1"
			style={{ display: showModal ? "block" : "none" }}
			id="staticBackdrop"
			data-bs-target="#staticBackdrop"
			data-bs-backdrop="static"
			data-bs-keyboard="false"
			aria-labelledby="staticBackdropLabel"
			aria-hidden={!showModal}>
			<div className="modal-dialog modal-xl">
				<div className="modal-content bg-secondary">
					<div className="modal-header bg-primary">
						<h5 className="modal-title">
							{modalMode === "mostrar"
								? "Mostrar usuario"
								: modalMode === "editar"
								? "Editar usuario"
								: modalMode === "agregar"
								? "Nuevo usuario"
								: ""}
						</h5>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={closeModal}></button>
					</div>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="modal-body">
							<div className="container-fluid">
								<div className="row mb-3">
									<div className="col-6">
										<label
											htmlFor="nombre"
											className="form-label mb-0">
											Nombre{" "}
											{modalMode !== "mostrar" && (
												<span className="text-danger">
													*
												</span>
											)}
										</label>
										<input
											type="text"
											className="form-control"
											id="nombre"
											readOnly={modalMode === "mostrar"}
											{...register("nombre", {
												required: true,
											})}
										/>
										{errors.nombre?.type === "required" && (
											<span className="row text-warning m-1">
												El NOMBRE es requerido
											</span>
										)}
									</div>
									<div className="col-6">
										<label
											htmlFor="apellido"
											className="form-label mb-0">
											Apellido{" "}
											{modalMode !== "mostrar" && (
												<span className="text-danger">
													*
												</span>
											)}
										</label>
										<input
											type="text"
											className="form-control"
											id="apellido"
											readOnly={modalMode === "mostrar"}
											{...register("apellido", {
												required: true,
											})}
										/>
										{errors.apellido?.type ===
											"required" && (
											<span className="row text-warning m-1">
												El APELLIDO es requerido
											</span>
										)}
									</div>
								</div>
								<div className="row mb-3">
									<div className="col-7">
										<label
											htmlFor="email"
											className="form-label mb-0">
											Email{" "}
											{modalMode !== "mostrar" && (
												<span className="text-danger">
													*
												</span>
											)}
										</label>
										<input
											type="email"
											className="form-control"
											autoComplete="off"
											id="email"
											readOnly={modalMode === "mostrar"}
											{...register("email", {
												required: true,
											})}
										/>
										{errors.email?.type === "required" && (
											<span className="row text-warning m-1">
												El E-MAIL es requerido
											</span>
										)}
									</div>
									<div className="col-2 text-center">
										<label
											htmlFor="activo"
											className="form-label mb-0">
											Activo
										</label>
										<div className="form-switch">
											<input
												type="checkbox"
												className="form-check-input"
												id="activo"
												disabled={
													modalMode === "mostrar"
												}
												{...register("activo")}
											/>
										</div>
									</div>
									<div className="col-2 text-center">
										<label
											htmlFor="administrador"
											className="form-label mb-0">
											Administrador
										</label>
										<div className="form-switch">
											<input
												type="checkbox"
												className="form-check-input"
												id="administrador"
												disabled={
													modalMode === "mostrar"
												}
												{...register("administrador")}
											/>
										</div>
									</div>
								</div>
								{modalMode === "agregar" && (
									<>
										<span className="text-warning">
											Establecer contraseña
										</span>
										<div className="row mb-3 border border-3 bg-dark border-warning border-rounded rounded-3 p-3 m-0">
											<>
												<div className="col-6">
													<label
														htmlFor="password1"
														className="form-label mb-0">
														Contraseña
													</label>
													<input
														type="password"
														className="form-control"
														id="password1"
														{...register(
															"password1",
															{
																required: true,
															}
														)}
													/>
													{errors.password1?.type ===
														"required" && (
														<span className="row text-warning m-1">
															La CONTRASEÑA es
															requerida
														</span>
													)}
												</div>
												<div className="col-6">
													<label
														htmlFor="password2"
														className="form-label mb-0">
														Confirmar Contraseña
													</label>
													<input
														type="password"
														className="form-control"
														id="password2"
														{...register(
															"password2",
															{
																required: true,
																validate: (
																	value
																) =>
																	value ===
																		password1 ||
																	"Las contraseñas no coinciden",
															}
														)}
													/>
													{errors.password2?.type ===
														"required" && (
														<span className="row text-warning m-1">
															La CONFIRMACIÓN DE
															CONTRASEÑA es
															requerida
														</span>
													)}
													{errors.password2?.type ===
														"validate" && (
														<span className="row text-warning m-1">
															{
																errors.password2
																	.message
															}
														</span>
													)}
												</div>
											</>
										</div>
									</>
								)}
							</div>
						</div>
						{/* Botones */}
						<div
							className="modal-footer bg-dark"
							style={{
								display: modalMode != "mostrar" ? "" : "none",
							}}>
							<div className="row mb-3 justify-content-end">
								<div className="col-auto">
									<button
										type="button"
										className="btn btn-secondary me-2"
										onClick={closeModal}>
										<i className="fas fa-times me-1"></i>{" "}
										Cancelar
									</button>
								</div>
								<div className="col-auto">
									<button
										type="submit"
										className="btn btn-primary">
										<i className="fas fa-save me-1"></i>{" "}
										Guardar
									</button>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
export default UsuariosModal;
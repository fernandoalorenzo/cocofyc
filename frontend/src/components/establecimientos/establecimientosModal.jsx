import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import { useForm } from "react-hook-form";

const EstablecimientosModal = ({
	showModal,
	closeModal,
	data,
	modalMode,
	fetchEstablecimientos,
}) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
		setValue,
	} = useForm();

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data, reset]);

	const initialState = {
		establecimiento: "",
		titular: "",
		cuit: "",
		telefono: "",
		email: "",
		domicilio: "",
		localidad: "",
	};

	useEffect(() => {
		if (modalMode === "agregar" ) {
			reset(initialState);
		} else if (data) {
			reset(data);
		}
	}, [modalMode]);

	// Manejador de cambios para el campo CUIT
	const handleCUITChange = (e) => {
		const value = e.target.value;
		// Eliminar cualquier caracter que no sea un número
		const newValue = value.replace(/[^\d]/g, "");
		// Aplicar formato 99-99999999-9
		let formattedValue = "";
		if (newValue.length <= 2) {
			formattedValue = newValue;
		} else if (newValue.length <= 10) {
			formattedValue = `${newValue.slice(0, 2)}-${newValue.slice(2)}`;
		} else {
			formattedValue = `${newValue.slice(0, 2)}-${newValue.slice(
				2,
				10
			)}-${newValue.slice(10, 11)}`;
		}
		// Actualizar el valor del campo CUIT en el formulario
		setValue("cuit", formattedValue); // Utilizar setValue para actualizar el campo CUIT
	};

	const onSubmit = async (formData, id) => {
		try {
			const endpoint = "http://127.0.0.1:5000/api/establecimientos/";
			const direction = id ? `${id}` : "";
			const method = id ? "PUT" : "POST";
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

			if (response.data) {
				Swal.fire({
					icon: "success",
					title: "Operación exitosa!",
					text: "Registro guardado exitosamente.",
					showConfirmButton: false,
					timer: 2500,
				});

				setTimeout(() => {
					closeModal();
					fetchEstablecimientos();
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
			<div className="modal-dialog modal-lg">
				<div className="modal-content bg-secondary">
					<div className="modal-header bg-primary">
						<h5 className="modal-title">
							{modalMode === "mostrar"
								? "Mostrar Establecimiento"
								: modalMode === "editar"
								? "Editar Establecimiento"
								: modalMode === "agregar"
								? "Agregar Nuevo Establecimiento"
								: ""}
						</h5>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={closeModal}></button>
					</div>
					<form
						onSubmit={handleSubmit((formData) =>
							onSubmit(formData, data && data.id ? data.id : null)
						)}>
						<div className="modal-body">
							<div className="container-fluid">
								<div className="row">
									<div className="col-6 mb-3">
										<label
											htmlFor="establecimiento"
											className="form-label mb-0">
											Establecimiento
										</label>
										<input
											type="text"
											className="form-control"
											id="establecimiento"
											readOnly={modalMode === "mostrar"}
											{...register("establecimiento", {
												required: true,
											})}
										/>
										{errors.establecimiento?.type ===
											"required" && (
											<span className="row text-warning m-1">
												El ESTABLECIMIENTO es requerido
											</span>
										)}
									</div>
									<div className="col-6 mb-3">
										<label
											htmlFor="titular"
											className="form-label mb-0">
											Titular
										</label>
										<input
											type="text"
											className="form-control"
											id="titular"
											readOnly={modalMode === "mostrar"}
											{...register("titular", {
												required: true,
											})}
										/>
										{errors.titular?.type ===
											"required" && (
											<span className="row text-warning m-1">
												El TITULAR es requerido
											</span>
										)}
									</div>
								</div>
								<div className="row">
									<div className="col mb-3">
										<label
											htmlFor="cuit"
											className="form-label mb-0">
											CUIT
										</label>
										<input
											type="text"
											className="form-control text-center"
											id="cuit"
											readOnly={modalMode === "mostrar"}
											maxLength="13"
											{...register("cuit", {
												required: true,
												maxLength: 13,
												minLength: 13,
											})}
											onChange={handleCUITChange}
										/>
										{errors.cuit?.type === "required" && (
											<span className="row text-warning m-1">
												El CUIT es requerido
											</span>
										)}
										{errors.cuit?.type === "maxLength" ||
											(errors.cuit?.type ===
												"minLength" && (
												<span className="row text-warning m-1">
													El CUIT debe contener 13
													digitos en total
												</span>
											))}
									</div>
									<div className="col mb-3">
										<label
											htmlFor="telefono"
											className="form-label mb-0">
											Teléfono
										</label>
										<input
											type="text"
											className="form-control"
											id="telefono"
											readOnly={modalMode === "mostrar"}
											{...register("telefono", {
												required: true,
											})}
										/>
										{errors.telefono && (
											<span className="row text-warning m-1">
												El TELEFONO es requerido
											</span>
										)}
									</div>
									<div className="col-5 mb-3">
										<label
											htmlFor="email"
											className="form-label mb-0">
											E-Mail
										</label>
										<input
											type="email"
											className="form-control"
											id="email"
											readOnly={modalMode === "mostrar"}
											{...register("email", {
												required: "required",
												pattern: {
													value: /\S+@\S+\.\S+/,
												},
											})}
											autoComplete="off"
										/>
										{errors.email?.type === "required" && (
											<span className="row text-warning m-1">
												El eMail es requerido
											</span>
										)}
										{errors.email?.type === "pattern" && (
											<span className="row text-warning m-1">
												El eMail es invalido
											</span>
										)}
									</div>
								</div>
								<div className="row">
									<div className="col mb-3">
										<label
											htmlFor="domicilio"
											className="form-label mb-0">
											Domicilio
										</label>
										<input
											type="text"
											className="form-control"
											id="domicilio"
											readOnly={modalMode === "mostrar"}
											{...register("domicilio")}
										/>
									</div>
									<div className="col mb-3">
										<label
											htmlFor="localidad"
											className="form-label mb-0">
											Localidad
										</label>
										<input
											type="text"
											className="form-control"
											id="localidad"
											readOnly={modalMode === "mostrar"}
											{...register("localidad")}
										/>
									</div>
								</div>
							</div>
						</div>
						<div
							className="modal-footer bg-dark"
							style={{
								display: modalMode !== "mostrar" ? "" : "none",
							}}>
							<div className="row mb-3 justify-content-end">
								<div className="col-auto">
									<button
										type="button"
										className="btn btn-secondary col-md-2"
										onClick={closeModal}>
										<i className="fa-solid fa-ban me-2"></i>
										Cancelar
									</button>
								</div>
								<div className="col-auto">
									<button
										type="submit"
										className="btn btn-primary col-md-2">
										<i className="fa-regular fa-floppy-disk me-2"></i>
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

export default EstablecimientosModal;

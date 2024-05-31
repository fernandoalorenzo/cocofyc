import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import { useForm } from "react-hook-form";

const CuotasModal = ({
	showModal,
	closeModal,
	data,
	modalMode,
	fetchCuotas,
	API_ENDPOINT,
}) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
		setValue,
	} = useForm();

	const initialState = {
		cuota: "",
		vencimiento: "",
		importe: "",
	};

	useEffect(() => {
		if (modalMode === "agregar") {
			reset(initialState);
			setValue(
				"importe",
				JSON.parse(localStorage.getItem("parametros")).importe_cuota
			);
		} else if (data) {
			reset(data);
		}
	}, [modalMode, data, reset]);

	const onSubmit = async (formData, id) => {
		const cuota = formData.cuota;

		if (modalMode === "agregar") {
			try {
				const endpoint = `${API_ENDPOINT}/cuotas/`;
				const direction = cuota;
				const method = "GET";
				const body = "";
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

				if (response.data.length > 0) {
					Swal.fire({
						icon: "error",
						title: "Operación fallida",
						text: "La cuota ya existe en la base de datos.",
						confirmButtonText: "Continuar",
					});
					return; // Detener la ejecución
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
		}

		const user = JSON.parse(localStorage.getItem("user"));

		formData = { ...formData, user_id: user.id };

		try {
			const endpoint = `${API_ENDPOINT}/cuotas/`;
			const direction = id ? `${id}` : "";
			const method = id ? "PATCH" : "POST";
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
					fetchCuotas();
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
								? "Mostrar Cuota"
								: modalMode === "editar"
								? "Editar Cuota"
								: modalMode === "agregar"
								? "Agregar Cuota"
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
									<div className="col-4 mb-3">
										<label
											htmlFor="cuota"
											className="form-label mb-0">
											Cuota{" "}
											{modalMode !== "mostrar" && (
												<span className="text-warning">
													*
												</span>
											)}
										</label>
										<input
											type="text"
											className="form-control"
											id="cuota"
											readOnly={modalMode === "mostrar"}
											{...register("cuota", {
												required: true,
											})}
										/>
										{errors.cuota?.type ===
											"required" && (
											<span className="row text-warning m-1">
												El campo es requerido
											</span>
										)}
									</div>
									<div className="col-4 mb-3">
										<label
											htmlFor="vencimiento"
											className="form-label mb-0">
											Vencimiento{" "}
											{modalMode !== "mostrar" && (
												<span className="text-warning">
													*
												</span>
											)}
										</label>
										<input
											type="date"
											className="form-control"
											id="vencimiento"
											readOnly={modalMode === "mostrar"}
											{...register("vencimiento", {
												required: true,
											})}
										/>
										{errors.vencimiento?.type ===
											"required" && (
											<span className="row text-warning m-1">
												El campo es requerido
											</span>
										)}
									</div>
									<div className="col-4 mb-3">
										<label
											htmlFor="importe"
											className="form-label mb-0">
											Importe{" "}
											{modalMode !== "mostrar" && (
												<span className="text-warning">
													*
												</span>
											)}
										</label>
										<input
											type="number"
											className="form-control text-center"
											id="importe"
											readOnly={modalMode === "mostrar"}
											{...register("importe", {
												required: true,
											})}
										/>
										{errors.importe?.type ===
											"required" && (
											<span className="row text-warning m-1">
												El campo es requerido
											</span>
										)}
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
										className="btn btn-secondary w-100"
										onClick={closeModal}>
										<i className="fa-solid fa-ban me-2"></i>
										Cancelar
									</button>
								</div>
								<div className="col-auto">
									<button
										type="submit"
										className="btn btn-primary w-100">
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

export default CuotasModal;

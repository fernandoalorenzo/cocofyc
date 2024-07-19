import React, { useEffect } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import { useForm } from "react-hook-form";

const TitularesModal = ({
	showTitularesModal,
	closeTitularesModal,
	data,
	modalTitularesMode,
	fetchTitulares,
	API_ENDPOINT,
}) => {

	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
		setValue,
	} = useForm();

	// DEFINE EL TITULO DEL MODAL
	let modalTitularesTitle = "";
	if (modalTitularesMode === "mostrar") {
		modalTitularesTitle = "Mostrar Titular";
	} else if (modalTitularesMode === "editar") {
		modalTitularesTitle = "Editar Titular";
	} else if (modalTitularesMode === "agregar") {
		modalTitularesTitle = "Agregar Titular";
	}

	const initialState = {
		nombre: "",
		dni: "",
		cuit: "",
		telefono: "",
		email: "",
		domicilio: "",
		localidad: "",
		fecha_nacimiento: "",
	};

	useEffect(() => {
		if (modalTitularesMode === "agregar") {
			reset(initialState);
		} else if (data) {
			if (data.fecha_nacimiento == "0000-00-00") {
				data.fecha_nacimiento = "";
			}
			reset(data);
		}
	}, [modalTitularesMode]);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data, reset]);

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

	// FUNCION PARA VERIFICAR SI EL DNI EXISTE
	const checkDniExists = async (dni) => {
		try {
			const endpoint = `${API_ENDPOINT}/titulares/dni/`;
			const direction = `${dni}`;
			const method = "GET";
			const body = false;
			const headers = {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			};

			const data = await apiConnection(
				endpoint,
				direction,
				method,
				body,
				headers
			);

			if (data) {
				return data.success;
			}
		} catch (error) {}
	};

	// FUNCION PARA ACTUALIZAR LOS DATOS
	const onSubmit = async (formData) => {
		try {
			if (modalTitularesMode === "agregar") {
				// Verificar si el DNI ya existe
				const dniExists = await checkDniExists(formData.dni);

				if (dniExists) {
					// Mostrar mensaje de error al usuario
					Swal.fire({
						icon: "error",
						title: "Error al guardar el registro",
						text: "El DNI ingresado ya existe en la base de datos.",
						showConfirmButton: true,
						timer: null,
					});
					return;
				} else {
					// Si el DNI no existe, continuar con la creación o actualización
					console.log(
						"El DNI no esta duplicado en la base de datos."
					);
				}
			}

			const endpoint = `${API_ENDPOINT}/titulares/`;
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

			if (response.data) {
				Swal.fire({
					icon: "success",
					title: "Operación exitosa!",
					text: "Registro guardado exitosamente.",
					showConfirmButton: false,
					timer: 2500,
				});

				// CERRAR MODAL
				setTimeout(() => {
					closeTitularesModal();
					fetchTitulares();
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
		<>
			<div
				className={`modal fade ${showTitularesModal ? "show" : ""}`}
				tabIndex="-1"
				style={{ display: showTitularesModal ? "block" : "none" }}
				id="staticBackdrop"
				data-bs-target="#staticBackdrop"
				data-bs-backdrop="static"
				data-bs-keyboard="false"
				aria-labelledby="staticBackdropLabel"
				aria-hidden={!showTitularesModal}>
				<div className="modal-dialog modal-xl">
					<div className="modal-content bg-secondary">
						<div className="modal-header bg-primary">
							<h5 className="modal-title">
								{modalTitularesTitle}
							</h5>
							<button
								type="button"
								className="btn-close"
								aria-label="Close"
								onClick={closeTitularesModal}></button>
						</div>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="modal-body">
								<div className="container-fluid">
									<div className="row mb-3">
										<div className="col-lg-12">
											<div className="row mb-3">
												{/* Nombre Completo */}
												<div className="col-6">
													<label
														htmlFor="nombre"
														className="form-label mb-0">
														Nombre Completo{" "}
														{modalTitularesMode !==
															"mostrar" && (
															<span className="text-warning">
																*
															</span>
														)}
													</label>
													<input
														type="text"
														className="form-control"
														id="nombre"
														readOnly={
															modalTitularesMode ===
															"mostrar"
														}
														{...register("nombre", {
															required: true,
														})}
													/>
													{errors.nombre?.type ===
														"required" && (
														<span className="row text-warning m-1">
															El campo es
															requerido
														</span>
													)}
												</div>
												{/* DNI */}
												<div className="col">
													<label
														htmlFor="dni"
														className="form-label mb-0">
														DNI{" "}
														{modalTitularesMode !==
															"mostrar" && (
															<span className="text-warning">
																*
															</span>
														)}
													</label>
													<input
														type="text"
														className="form-control"
														id="dni"
														readOnly={
															modalTitularesMode ===
															"mostrar"
														}
														{...register("dni", {
															required: true,
														})}
													/>
													{errors.dni?.type ===
														"required" && (
														<span className="row text-warning m-1">
															El campo es
															requerido
														</span>
													)}
												</div>
												{/* CUIT */}
												<div className="col">
													<label
														htmlFor="cuit"
														className="form-label mb-0">
														CUIT{" "}
													</label>
													<input
														type="text"
														className="form-control"
														id="cuit"
														readOnly={
															modalTitularesMode ===
															"mostrar"
														}
														maxLength="13"
														{...register("cuit", {
															maxLength: 13,
														})}
														onChange={
															handleCUITChange
														}
													/>
												</div>
											</div>
											<div className="row mb-3">
												{/* Teléfono */}
												<div className="col-3">
													<label
														htmlFor="telefono"
														className="form-label mb-0">
														Teléfono
													</label>
													<input
														type="text"
														className="form-control"
														id="telefono"
														readOnly={
															modalTitularesMode ===
															"mostrar"
														}
														{...register(
															"telefono"
														)}
													/>
												</div>
												{/* E-Mail */}
												<div className="col">
													<label
														htmlFor="email"
														className="form-label mb-0">
														E-Mail{" "}
														{modalTitularesMode !==
															"mostrar" && (
															<span className="text-warning">
																*
															</span>
														)}
													</label>
													<input
														type="email"
														className="form-control"
														id="email"
														readOnly={
															modalTitularesMode ===
															"mostrar"
														}
														{...register("email", {
															required:
																"required",
															pattern: {
																value: /\S+@\S+\.\S+/,
															},
														})}
														autoComplete="off"
													/>
												</div>
												{/* Fecha de Nacimiento */}
												<div className="col-3">
													<label
														htmlFor="fecha_nacimiento"
														className="form-label mb-0">
														Fecha de Nacimiento
													</label>
													<input
														type="date"
														className="form-control"
														id="fecha_nacimiento"
														readOnly={
															modalTitularesMode ===
															"mostrar"
														}
														{...register(
															"fecha_nacimiento"
														)}
													/>
												</div>
											</div>
											<div className="row mb-3">
												{/* Domicilio */}
												<div className="col">
													<label
														htmlFor="domicilio"
														className="form-label mb-0">
														Domicilio
													</label>
													<input
														type="text"
														className="form-control"
														id="domicilio"
														readOnly={
															modalTitularesMode ===
															"mostrar"
														}
														{...register(
															"domicilio"
														)}
													/>
												</div>
												{/* Localidad */}
												<div className="col">
													<label
														htmlFor="localidad"
														className="form-label mb-0">
														Localidad
													</label>
													<input
														type="text"
														className="form-control"
														id="localidad"
														readOnly={
															modalTitularesMode ===
															"mostrar"
														}
														{...register(
															"localidad"
														)}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div
								className="modal-footer bg-dark"
								// LO MUESTRA SI ESTA EDITANDO O AGREGANDO REGISTROS
								style={{
									display:
										modalTitularesMode != "mostrar" ? "" : "none",
								}}>
								<button
									type="button"
									className="btn btn-secondary col-md-2"
									onClick={closeTitularesModal}>
									<i className="fa-solid fa-ban me-2"></i>
									Cancelar
								</button>
								<button
									type="submit"
									className="btn btn-primary col-md-2">
									<i className="fa-regular fa-floppy-disk me-2"></i>
									Guardar
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};
export default TitularesModal;
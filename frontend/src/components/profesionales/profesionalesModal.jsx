import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import { useForm } from "react-hook-form";

const ProfesionalesModal = ({
	showModal,
	closeModal,
	data,
	modalMode,
	fetchProfesionales,
}) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
		setValue,
	} = useForm();

	// DEFINE EL TITULO DEL MODAL
	let modalTitle = "";
	if (modalMode === "mostrar") {
		modalTitle = "Mostrar Profesional";
	} else if (modalMode === "editar") {
		modalTitle = "Editar Profesional";
	} else if (modalMode === "agregar") {
		modalTitle = "Agregar Profesional";
	}

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data, reset]);

	const initialState = {
		nombre: "",
		dni: "",
		cuit: "",
		telefono: "",
		email: "",
		matricula: "",
		domicilio: "",
		localidad: "",
		fecha_nacimiento: "",
		imagen: "",
		activo: false,
		estado_matricula_id: "",
	};

	useEffect(() => {
		if (modalMode === "agregar") {
			reset(initialState);
		} else if (data) {
			if (data.fecha_nacimiento == "0000-00-00") {
				data.fecha_nacimiento = "";
			}
			reset(data);
		}
	}, [modalMode]);

	const [estadosMatriculas, setEstadosMatriculas] = useState([]);

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
			const endpoint = "http://localhost:5000/api/profesionales/dni/";
			const direction = `${dni}`;
			const method = "GET";
			const body = false;
			const headers = {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			};

			// const data = await response.json();
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
		} catch (error) {
			
		}
	};

	// FUNCION PARA ACTUALIZAR LOS DATOS
	const onSubmit = async (formData, id) => {
		try {
			if (modalMode === "agregar") {
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

			const endpoint = "http://localhost:5000/api/profesionales/";
			const direction = formData.id ? `${formData.id}` : "";
			const method = formData.id ? "PUT" : "POST";
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
					closeModal();
					fetchProfesionales();
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

	useEffect(() => {
		const fetchEstadosMatriculas = async () => {
			try {
				const endpoint = "http://localhost:5000/api/estados";
				const direction = "";
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

				setEstadosMatriculas(data.data);
			} catch (error) {
				console.error("Error:", error.message);
			}
		};
		fetchEstadosMatriculas();
	}, []);

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
						<h5 className="modal-title">{modalTitle}</h5>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={closeModal}></button>
					</div>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="modal-body">
							<div className="container-fluid">
								<div className="row">
									{/* Nombre Completo */}
									<div className="col-6 mb-3">
										<label
											htmlFor="nombre"
											className="form-label mb-0">
											Nombre Completo{" "}
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
												El campo es requerido
											</span>
										)}
									</div>
									{/* DNI */}
									<div className="col mb-3">
										<label
											htmlFor="dni"
											className="form-label mb-0">
											DNI{" "}
											{modalMode !== "mostrar" && (
												<span className="text-danger">
													*
												</span>
											)}
										</label>
										<input
											type="text"
											className="form-control"
											id="dni"
											readOnly={modalMode === "mostrar"}
											{...register("dni", {
												required: true,
											})}
										/>
										{errors.dni?.type === "required" && (
											<span className="row text-warning m-1">
												El campo es requerido
											</span>
										)}
									</div>
									{/* CUIT */}
									<div className="col mb-3">
										<label
											htmlFor="cuit"
											className="form-label mb-0">
											CUIT{" "}
											{modalMode !== "mostrar" && (
												<span className="text-danger">
													*
												</span>
											)}
										</label>
										<input
											type="text"
											className="form-control"
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
												El campo es requerido
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
								</div>
								<div className="row">
									{/* Teléfono */}
									<div className="col-4 mb-3">
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
											{...register("telefono")}
										/>
									</div>
									{/* E-Mail */}
									<div className="col mb-3">
										<label
											htmlFor="email"
											className="form-label mb-0">
											E-Mail{" "}
											{modalMode !== "mostrar" && (
												<span className="text-danger">
													*
												</span>
											)}
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
									</div>
									{/* Fecha de Nacimiento */}
									<div className="col-2 mb-3">
										<label
											htmlFor="fecha_nacimiento"
											className="form-label mb-0">
											Fecha de Nacimiento
										</label>
										<input
											type="date"
											className="form-control"
											id="fecha_nacimiento"
											readOnly={modalMode === "mostrar"}
											{...register("fecha_nacimiento")}
										/>
									</div>
								</div>
								<div className="row">
									{/* Domicilio */}
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
									{/* Localidad */}
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
								<div className="row">
									{/* Matrícula */}
									<div className="col-2 ">
										<label
											htmlFor="matricula"
											className="form-label mb-0">
											Matrícula{" "}
											{modalMode !== "mostrar" && (
												<span className="text-danger">
													*
												</span>
											)}
										</label>
										<input
											type="text"
											className="form-control"
											id="matricula"
											readOnly={modalMode === "mostrar"}
											{...register("matricula")}
										/>
									</div>
									{/* Estado de Matrícula */}
									<div className="col-3 ">
										<label
											htmlFor="estado_matricula_id"
											className="form-label mb-0">
											Estado de Matrícula{" "}
											{modalMode !== "mostrar" && (
												<span className="text-danger">
													*
												</span>
											)}
										</label>
										<select
											className="form-select"
											disabled={modalMode === "mostrar"}
											id="estado_matricula_id"
											{...register(
												"estado_matricula_id",
												{
													required: true,
												}
											)}>
											<option value="">
												Seleccionar
											</option>
											{estadosMatriculas.map((estado) => (
												<option
													key={estado.id}
													value={estado.id}>
													{estado.estado}
												</option>
											))}
										</select>
										{errors.estado_matricula_id?.type ===
											"required" && (
											<span className="row text-warning m-1">
												El campo es requerido
											</span>
										)}
									</div>
									{/* Activo */}
									<div className="col-1 text-center">
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
								</div>
							</div>
						</div>
						<div
							className="modal-footer bg-dark"
							// LO MUESTRA SI ESTA EDITANDO O AGREGANDO REGISTROS
							style={{
								display: modalMode != "mostrar" ? "" : "none",
							}}>
							<button
								type="button"
								className="btn btn-secondary col-md-2"
								onClick={closeModal}>
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
	);
};
export default ProfesionalesModal;

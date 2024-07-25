import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import formatFecha from "../../utils/formatFecha";
import { useForm } from "react-hook-form";

const EstablecimientosModal = ({
	showModal,
	closeModal,
	data,
	modalMode,
	fetchEstablecimientos,
	API_ENDPOINT,
}) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
		setValue,
		getValues,
	} = useForm();

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data, reset]);

	const initialState = {
		establecimiento: "",
		id_responsable: "",
		es_profesional: false,
		cuit: "",
		telefono: "",
		email: "",
		domicilio: "",
		localidad: "",
		fecha_inicio: "",
		fecha_caducidad: "",
		nro_tramite: "",
		nro_habilitacion: "",
		nro_resolucion: "",
	};

	const [titulares, setTitulares] = useState([]);
	const [profesionales, setProfesionales] = useState([]);
	// const [titularSelected, setTitularSelected] = useState(null);
	// const [profesionalSelected, setProfesionalSelected] = useState(null);
	const [responsableDetails, setResponsableDetails] = useState(null);
	const [esProfesional, setEsProfesional] = useState(false);

	useEffect(() => {
		if (modalMode === "agregar") {
			reset(initialState);
			setEsProfesional(0);
			setResponsableDetails(null);
		} else if (data) {
			if (data.fecha_inicio == "0000-00-00") {
				data.fecha_inicio = "";
			}
			if (data.fecha_caducidad == "0000-00-00") {
				data.fecha_caducidad = "";
			}
			reset(data);
			setEsProfesional(data.es_profesional);

			// Contenedor para los titulares y profesionales
			const selectedId = data.id_responsable;
			const responsables = data.es_profesional
				? profesionales
				: titulares;
			const selectedResponsable = responsables.find(
				(resp) => resp.id === selectedId
			);
			setResponsableDetails(selectedResponsable);
		}
	}, [modalMode, data, reset]);

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

	// Manejador de cambios para la fecha de inicio
	const handleFechaInicioBlur = (e) => {
		const fechaInicio = e.target.value;
		if (fechaInicio) {
			const nuevaFechaCaducidad = new Date(fechaInicio);
			nuevaFechaCaducidad.setFullYear(
				nuevaFechaCaducidad.getFullYear() + 3
			);
			const nuevaFechaCaducidadStr = nuevaFechaCaducidad
				.toISOString()
				.split("T")[0];

			const nuevaFechaCaducidadFormatted = formatFecha(
				nuevaFechaCaducidadStr
			);

			if (!getValues("fecha_caducidad")) {
				setValue("fecha_caducidad", nuevaFechaCaducidadStr);
			} else {
				Swal.fire({
					title: "Nueva Fecha de Caducidad",
					text: `¿Desea reemplazar la fecha de caducidad y establecerla a ${nuevaFechaCaducidadFormatted}?`,
					icon: "warning",
					showCancelButton: true,
					confirmButtonColor: "#3085d6",
					cancelButtonColor: "#d33",
					confirmButtonText: "Sí, reemplazar",
					cancelButtonText: "No, mantener",
				}).then((result) => {
					if (result.isConfirmed) {
						setValue("fecha_caducidad", nuevaFechaCaducidadStr);
					}
				});
			}
		}
	};

	const fetchTitulares = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/titulares`;
			const direction = "";
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

			setTitulares(response.data);
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	const fetchProfesionales = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/profesionales`;
			const direction = "";
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

			setProfesionales(response.data);
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	// OBTENER LISTA DE REGISTROS
	useEffect(() => {
		fetchTitulares();
		fetchProfesionales();
	}, []);

	const onSubmit = async (formData, id) => {
		try {
			const endpoint = `${API_ENDPOINT}/establecimientos/`;
			const direction = id ? `${id}` : "";
			const method = id ? "PUT" : "POST";
			const body = { ...formData, es_profesional: esProfesional };
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

	const handleCheckboxChange = () => {
		setEsProfesional(!esProfesional);
		setResponsableDetails(null);
		setValue("id_responsable", "");
	};

	const handleResponsableChange = (e) => {
		const selectedId = e.target.value;
		const responsables = esProfesional ? profesionales : titulares;
		const selectedResponsable = responsables.find(
			(resp) => resp.id === selectedId
		);
		setResponsableDetails(selectedResponsable);
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
								? "Mostrar Establecimiento"
								: modalMode === "editar"
								? "Editar Establecimiento"
								: modalMode === "agregar"
								? "Agregar Establecimiento"
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
								<div className="row mb-2">
									<div className="col-5">
										<label
											htmlFor="establecimiento"
											className="form-label mb-0">
											Establecimiento{" "}
											{modalMode !== "mostrar" && (
												<span className="text-warning">
													{" "}
													*
												</span>
											)}
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
												El campo es requerido
											</span>
										)}
									</div>
									<div className="col-2 text-center">
										<label
											htmlFor="es_profesional"
											className="form-label mb-0">
											Es Profesional
										</label>
										<div className="form-check text-center">
											<input
												className="form-check-input"
												type="checkbox"
												value={esProfesional}
												id="es_profesional"
												checked={esProfesional}
												onChange={handleCheckboxChange}
											/>
										</div>
									</div>
									<div className="col-5">
										<label
											htmlFor="id_responsable"
											className="form-label mb-0">
											Titular{" "}
											{modalMode !== "mostrar" && (
												<span className="text-warning">
													{" "}
													*
												</span>
											)}
										</label>
										<select
											className="form-select"
											disabled={modalMode === "mostrar"}
											id="id_responsable"
											{...register("id_responsable", {
												required: true,
											})}
											onChange={handleResponsableChange}>
											<option value="">
												Seleccionar
											</option>
											{esProfesional
												? profesionales.map(
														(profesional) => (
															<option
																key={
																	profesional.id
																}
																value={
																	profesional.id
																}>
																{
																	profesional.nombre
																}
															</option>
														)
												  )
												: titulares.map((titular) => (
														<option
															key={titular.id}
															value={titular.id}>
															{titular.nombre}
														</option>
												  ))}
										</select>
										{errors.id_responsable?.type ===
											"required" && (
											<span className="row text-warning m-1">
												El campo es requerido
											</span>
										)}
									</div>
								</div>
								{/* Contenedor para mostrar los datos del responsable */}
								{responsableDetails && (
									<div className="row mb-2">
										<div className="col">
											<div
												className="card collapsed-card shadow border-dark p-0 m-0"
												style={{
													backgroundColor: "#B7BDC8",
												}}>
												<div
													className="card-header px-2 py-1 my-0 border-0"
													style={{
														backgroundColor:
															"#929AAB",
													}}>
													<button
														type="button"
														className="btn btn-dark btn-sm p-0 px-1 ms-auto"
														data-card-widget="collapse"
														title="Collapse">
														<i className="fas fa-plus p-0 m-0"></i>
													</button>
													<span className="ms-2 my-0 position-relative">
														<strong>
															Datos personales de{" "}
															{
																responsableDetails.nombre
															}
														</strong>
													</span>
												</div>
												<div className="card-body py-0 px-2">
													<div className="row">
														<div className="col-6">
															<label className="fw-normal">
																e-Mail:{" "}
															</label>
															<span className="ms-2 fs-6 text-start fw-bold">
																{
																	responsableDetails.email
																}
															</span>
														</div>
														<div className="col-3">
															<label className="fw-normal">
																DNI:{" "}
															</label>
															<span className="ms-2 fs-6 text-start fw-bold">
																{
																	responsableDetails.dni
																}
															</span>
														</div>
														<div className="col-3">
															<label className="fw-normal">
																Teléfono:{" "}
															</label>
															<span className="ms-2 fs-6 text-start fw-bold">
																{
																	responsableDetails.telefono
																}
															</span>
														</div>
													</div>
													<div className="row">
														<div className="col-6">
															<label className="fw-normal">
																Domicilio:{" "}
															</label>
															<span className="ms-2 fs-6 text-start fw-bold">
																{
																	responsableDetails.domicilio
																}
															</span>
														</div>
														<div className="col-6">
															<label className="fw-normal">
																Localidad:{" "}
															</label>
															<span className="ms-2 fs-6 text-start fw-bold">
																{
																	responsableDetails.localidad
																}
															</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								)}
								<div className="row mb-2">
									<div className="col-2">
										<label
											htmlFor="fecha_inicio"
											className="form-label mb-0">
											Inicio{" "}
										</label>
										<input
											type="date"
											className="form-control"
											id="fecha_inicio"
											readOnly={modalMode === "mostrar"}
											{...register("fecha_inicio")}
											onBlur={handleFechaInicioBlur}
										/>
									</div>
									<div className="col-2">
										<label
											htmlFor="fecha_caducidad"
											className="form-label mb-0">
											Caducidad{" "}
										</label>
										<input
											type="date"
											className="form-control"
											id="fecha_caducidad"
											readOnly={modalMode === "mostrar"}
											{...register("fecha_caducidad")}
										/>
									</div>
									<div className="col">
										<label
											htmlFor="nro_tramite"
											className="form-label mb-0">
											N° de Trámite
										</label>
										<input
											type="text"
											className="form-control"
											id="nro_tramite"
											readOnly={modalMode === "mostrar"}
											{...register("nro_tramite")}
										/>
									</div>
									<div className="col">
										<label
											htmlFor="nro_habilitacion"
											className="form-label mb-0">
											N° de Habilitación
										</label>
										<input
											type="text"
											className="form-control"
											id="nro_habilitacion"
											readOnly={modalMode === "mostrar"}
											{...register("nro_habilitacion")}
										/>
									</div>
									<div className="col">
										<label
											htmlFor="nro_resolucion"
											className="form-label mb-0">
											N° de Resolución
										</label>
										<input
											type="text"
											className="form-control"
											id="nro_resolucion"
											readOnly={modalMode === "mostrar"}
											{...register("nro_resolucion")}
										/>
									</div>
								</div>
								<div className="row mb-2">
									<div className="col-2">
										<label
											htmlFor="dni"
											className="form-label mb-0">
											DNI{" "}
										</label>
										<input
											type="text"
											className="form-control"
											id="dni"
											readOnly={modalMode === "mostrar"}
											{...register("dni")}
										/>
									</div>
									<div className="col-2">
										<label
											htmlFor="cuit"
											className="form-label mb-0">
											CUIT{" "}
										</label>
										<input
											type="text"
											className="form-control text-center"
											id="cuit"
											readOnly={modalMode === "mostrar"}
											maxLength="13"
											{...register("cuit")}
											onChange={handleCUITChange}
										/>
									</div>
									<div className="col-3">
										<label
											htmlFor="telefono"
											className="form-label mb-0">
											Teléfono{" "}
											{modalMode !== "mostrar" && (
												<span className="text-warning">
													*
												</span>
											)}
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
												El campo es requerido
											</span>
										)}
									</div>
									<div className="col">
										<label
											htmlFor="email"
											className="form-label mb-0">
											E-Mail{" "}
											{modalMode !== "mostrar" && (
												<span className="text-warning">
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
										{errors.email?.type === "required" && (
											<span className="row text-warning m-1">
												El campo es requerido
											</span>
										)}
										{errors.email?.type === "pattern" && (
											<span className="row text-warning m-1">
												El eMail es invalido
											</span>
										)}
									</div>
								</div>
								<div className="row mb-2">
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
											readOnly={modalMode === "mostrar"}
											{...register("domicilio")}
										/>
									</div>
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

export default EstablecimientosModal;

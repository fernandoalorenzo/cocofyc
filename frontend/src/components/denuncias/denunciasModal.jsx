import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import { useForm } from "react-hook-form";

const DenunciasModal = ({
	showModal,
	closeModal,
	data,
	modalMode,
	API_ENDPOINT,
}) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
		setValue,
		watch,
	} = useForm();

	const user = JSON.parse(localStorage.getItem("user")) || {};
	const [establecimientos, setEstablecimientos] = useState([]);
	const [establecimientoId, setEstablecimientoId] = useState("");
	// const [estado, setEstado] = useState("");

	const estado = watch("estado");
	const fechaCierre = watch("fecha_cierre");

	// DEFINE EL TITULO DEL MODAL
	let modalTitle = "";
	if (modalMode === "mostrar") {
		modalTitle = "Mostrar Denuncia";
	} else if (modalMode === "editar") {
		modalTitle = "Editar Denuncia";
	} else if (modalMode === "agregar") {
		modalTitle = "Agregar Denuncia";
	}

	// Obtener la fecha actual
	const getCurrentDate = () => {
		const now = new Date();
		const year = now.getFullYear();
		let month = now.getMonth() + 1;
		let day = now.getDate();
		if (month < 10) month = "0" + month;
		if (day < 10) day = "0" + day;
		return `${year}-${month}-${day}`;
	};

	const fechaActual = getCurrentDate();

	const fetchEstablecimientos = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/establecimientos/`;
			const method = "GET";
			const headers = {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			};

			const response = await apiConnection(
				endpoint,
				"",
				method,
				false,
				headers
			);

			if (response) {
				const establecimientos = response.data.sort((a, b) => {
					if (a.establecimiento < b.establecimiento) {
						return -1;
					}
					if (a.establecimiento > b.establecimiento) {
						return 1;
					}
					return 0;
				});
				setEstablecimientos(establecimientos);
				return establecimientos;
			}
			return []; // Devolver una lista vacía si no hay datos
		} catch (error) {
			console.error("Error fetching establecimientos:", error.message);
			throw error;
		}
	};

	useEffect(() => {
		if (data) {
			fetchEstablecimientos();
			reset(data);
		}
	}, [data, reset]);

	const initialState = {
		fecha: fechaActual,
		nro_comprobante: "",
		establecimiento_id: "",
		tipo_denuncia: "",
		DNI: "",
		CUIT: "",
		domicilio: "",
		localidad: "",
		estado: "",
		redsocial1: "",
		redsocial2: "",
		redsocial3: "",
		infraccion: "",
		comentario: "",
		fecha_cierre: null,
	};

	useEffect(() => {
		if (modalMode === "agregar") {
			reset(initialState);
			setEstablecimientoId("");
		} else if (data) {
			if (data.fecha == "0000-00-00") {
				data.fecha = "";
			}
			if (data.fecha_cierre == "0000-00-00") {
				data.fecha_cierre = "";
			}
			reset(data);
		}
		if (modalMode !== "agregar" && data && data.establecimiento_id) {
			fetchEstablecimientos()
				.then((establecimientos) => {
					if (establecimientos) {
						const establecimientoSeleccionado =
							establecimientos.find(
								(establecimiento) =>
									establecimiento.id ===
									data.establecimiento_id
							);
						if (establecimientoSeleccionado) {
							setEstablecimientoId(data.establecimiento_id);
						}
						setEstablecimientos(establecimientos);
					}
				})
				.catch((error) => {
					console.error("Error fetching establecimientos:", error);
				});
		}
	}, [modalMode, data]);

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

	// Manejar el cambio de estado para completar/eliminar la fecha de cierre
	const handleEstadoChange = (e) => {
		const newEstado = e.target.value;
		setValue("estado", newEstado); // Actualizar el valor en react-hook-form

		if (newEstado === "Resuelto") {
			// Establecer la fecha de cierre cuando se selecciona "Resuelto"
			setValue("fecha_cierre", fechaActual);
		} else if (newEstado === "Judicial") {
			// Limpiar la fecha de cierre si se selecciona "Judicial"
			setValue("fecha_cierre", "");
		}
	};

	const onSubmit = async (formData, id) => {
		// Validar que la fecha de cierre no sea nula si el estado es "Resuelto"
		if (formData.estado === "Resuelto" && !formData.fecha_cierre) {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "La fecha de cierre no puede ser nula cuando el estado es 'Resuelto'.",
			});
			return;
		}

		const newData = {
			...formData,
			user_id: user.id,
		};
		try {
			const endpoint = `${API_ENDPOINT}/denuncias/`;
			const direction = newData.id ? `${newData.id}` : "";
			const method = newData.id ? "PUT" : "POST";
			const body = newData;

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
		if (data && data.establecimiento_id) {
			fetchEstablecimientos()
				.then((establecimientos) => {
					const establecimientoSeleccionado = establecimientos.find(
						(establecimiento) =>
							establecimiento.id === data.establecimiento_id
					);
					if (establecimientoSeleccionado) {
						setEstablecimientoId(data.establecimiento_id);
					}
				})
				.catch((error) => {
					console.error("Error fetching establecimientos:", error);
				});
		}
	}, [data]);

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
					<form id="cargar-pago" onSubmit={handleSubmit(onSubmit)}>
						<div className="modal-body">
							<div className="container-fluid">
								{/* DATOS DE LA PERSONA DENUNCIADA */}
								<div className="position-relative mt-2">
									<span
										className="badge badge-dark position-absolute"
										style={{
											top: "-10px",
											left: "5px",
											fontSize: "14px",
										}}>
										Datos de la persona
									</span>
									<div className="row mt-2 rounded border border-light p-2 pe-0">
										<div className="row my-2 pe-0">
											{/* PERSONA */}
											<div className="col-3">
												<label htmlFor="persona">
													Apellido y Nombre
													{modalMode !==
														"mostrar" && (
														<span className="text-warning">
															*
														</span>
													)}
												</label>
												<input
													type="text"
													id="persona"
													className="form-control"
													readOnly={
														modalMode === "mostrar"
													}
													{...register("persona", {
														required: true,
													})}
												/>
												{errors.persona?.type ===
													"required" && (
													<span className="row text-warning m-1">
														El campo es requerido
													</span>
												)}
											</div>
											{/* DNI */}
											<div className="col-2">
												<label htmlFor="dni">DNI</label>
												<input
													type="text"
													id="dni"
													className="form-control"
													readOnly={
														modalMode === "mostrar"
													}
													{...register("dni")}
												/>
											</div>
											{/* CUIT */}
											<div className="col-2">
												<label htmlFor="cuit">
													CUIT
												</label>
												<input
													type="text"
													id="cuit"
													className="form-control"
													readOnly={
														modalMode === "mostrar"
													}
													maxLength="13"
													{...register("cuit", {
														maxLength: 13,
													})}
													onChange={handleCUITChange}
												/>
											</div>
											{/* DOMICILIO */}
											<div className="col-3">
												<label htmlFor="domicilio">
													Domicilio
												</label>
												<input
													type="text"
													id="domicilio"
													className="form-control"
													readOnly={
														modalMode === "mostrar"
													}
													{...register("domicilio")}
												/>
											</div>
											{/* LOCALIDAD */}
											<div className="col-2">
												<label htmlFor="localidad">
													Localidad
												</label>
												<input
													type="text"
													id="localidad"
													className="form-control"
													readOnly={
														modalMode === "mostrar"
													}
													{...register("localidad")}
												/>
											</div>
										</div>
										<div className="row my-2 pe-0">
											{/* Red Social 1 */}
											<div className="col-4">
												<label htmlFor="redsocial1">
													Red Social 1
												</label>
												<input
													type="text"
													id="redsocial1"
													className="form-control"
													readOnly={
														modalMode === "mostrar"
													}
													{...register("redsocial1")}
												/>
											</div>
											{/* Red Social 2 */}
											<div className="col-4">
												<label htmlFor="redsocial2">
													Red Social 2
												</label>
												<input
													type="text"
													id="redsocial2"
													className="form-control"
													readOnly={
														modalMode === "mostrar"
													}
													{...register("redsocial2")}
												/>
											</div>
											{/* Red Social 3 */}
											<div className="col-4">
												<label htmlFor="redsocial3">
													Red Social 3
												</label>
												<input
													type="text"
													id="redsocial3"
													className="form-control"
													readOnly={
														modalMode === "mostrar"
													}
													{...register("redsocial3")}
												/>
											</div>
										</div>
									</div>
								</div>
								{/* DATOS DE LA DENUNCIA */}
								<div className="position-relative mt-4">
									<span
										className="badge badge-dark position-absolute"
										style={{
											top: "-10px",
											left: "5px",
											fontSize: "14px",
										}}>
										Datos de la denuncia
									</span>
									<div className="row mt-2 rounded border border-light p-2 pe-0">
										<div className="row mt-2 pe-0 justify-content-between">
											{/* FECHA */}
											<div className="col-3">
												<label htmlFor="fecha">
													Fecha
													{modalMode !==
														"mostrar" && (
														<span className="text-warning">
															*
														</span>
													)}
												</label>
												<input
													type="date"
													id="fecha"
													className="form-control"
													readOnly={
														modalMode === "mostrar"
													}
													defaultValue={
														modalMode === "agregar"
															? getCurrentDate()
															: data && data.fecha
													}
													{...register("fecha", {
														required: true,
													})}
												/>
												{errors.fecha?.type ===
													"required" && (
													<span className="row text-warning m-1">
														El campo es requerido
													</span>
												)}
											</div>
											{/* Tipo de Denuncia (ACTA / CARTA) */}
											<div className="col-4">
												<label htmlFor="tipo_denuncia">
													Tipo de Denuncia
												</label>
												<select
													className="form-select"
													disabled={
														modalMode === "mostrar"
													}
													id="tipo_denuncia"
													{...register(
														"tipo_denuncia"
													)}>
													<option value="">
														Seleccione un tipo
													</option>
													<option value="Acta">
														Acta
													</option>
													<option value="Carta">
														Carta
													</option>
												</select>
											</div>
											{/* Nº COMPROBANTE */}
											<div className="col-4">
												<label htmlFor="nro_comprobante">
													Nº Acta/Carta
													{modalMode !==
														"mostrar" && (
														<span className="text-warning">
															*
														</span>
													)}
												</label>
												<input
													type="text"
													id="nro_comprobante"
													className="form-control"
													readOnly={
														modalMode === "mostrar"
													}
													{...register(
														"nro_comprobante",
														{
															required: true,
														}
													)}
												/>
												{errors.nro_comprobante
													?.type === "required" && (
													<span className="row text-warning m-1">
														Campo requerido
													</span>
												)}
											</div>
										</div>
										<div className="row my-3 justify-content-between">
											{/* ESTABLECIMIENTO */}
											<div className="col-5">
												<label htmlFor="establecimiento_id">
													Establecimiento
												</label>
												<select
													className="form-select"
													disabled={
														modalMode === "mostrar"
													}
													id="establecimiento_id"
													{...register(
														"establecimiento_id"
													)}
													value={establecimientoId}
													onChange={(e) =>
														setEstablecimientoId(
															e.target.value
														)
													}>
													<option value="">
														Seleccione un
														establecimiento
													</option>
													{establecimientos.map(
														(establecimiento) => (
															<option
																key={
																	establecimiento.id
																}
																value={
																	establecimiento.id
																}>
																{
																	establecimiento.establecimiento
																}
															</option>
														)
													)}
												</select>
											</div>
											{/* Estado (RESUELTO / JUDICIAL) */}
											<div className="col-4">
												<label htmlFor="estado">
													Estado
												</label>
												<select
													className="form-select"
													disabled={
														modalMode === "mostrar"
													}
													id="estado"
													{...register("estado", {
														onChange:
															handleEstadoChange, // Captura el cambio aquí
													})}>
													<option value="">
														Seleccione un estado
													</option>
													<option value="Resuelto">
														Resuelto
													</option>
													<option value="Judicial">
														Judicial
													</option>
												</select>
											</div>
											{/* FECHA DE CIERRE */}
											<div className="col-3">
												<label htmlFor="fecha">
													Fecha de Cierre
												</label>
												<input
													type="date"
													id="fecha_cierre"
													className="form-control"
													readOnly={
														modalMode === "mostrar"
													}
													{...register(
														"fecha_cierre"
													)}
												/>
											</div>
										</div>
										<div className="row mt-2 pe-0">
											{/* INFRACCION */}
											<div className="col">
												<label htmlFor="infraccion">
													Detalle de la Infracción
													{modalMode !==
														"mostrar" && (
														<span className="text-warning">
															*
														</span>
													)}
												</label>
												<textarea
													className="form-control"
													readOnly={
														modalMode === "mostrar"
													}
													id="infraccion"
													rows="3"
													{...register("infraccion", {
														required: true,
													})}></textarea>
												{errors.infraccion?.type ===
													"required" && (
													<span className="row text-warning m-1">
														El campo es requerido
													</span>
												)}
											</div>
											{/* COMENTARIO */}
											<div className="col">
												<label htmlFor="comentario">
													Comentarios
												</label>
												<textarea
													className="form-control"
													readOnly={
														modalMode === "mostrar"
													}
													id="comentario"
													rows="3"
													{...register(
														"comentario"
													)}></textarea>
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
export default DenunciasModal;

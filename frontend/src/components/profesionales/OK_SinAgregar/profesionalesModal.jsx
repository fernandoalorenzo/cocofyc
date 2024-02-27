import React, { useEffect, useState } from "react";
import sweetAlert from "../toast/SweetAlert";
import apiConnection from "../../../../backend/functions/apiConnection";

const ProfesionalesModal = ({
	showModal,
	setShowModal,
	profesional,
	onClose,
	modalMode,
	fetchProfesionales,
}) => {
	const [estadosMatriculas, setEstadosMatriculas] = useState([]);
	const [editProfesionalData, setEditProfesionalData] = useState(null); // Datos del registro a editar

	// DEFINE EL TITULO DEL MODAL
	let modalTitle = "";
	if (modalMode === "mostrar") {
		modalTitle = "Mostrar Profesional";
	} else if (modalMode === "editar") {
		modalTitle = "Editar Profesional";
	} else if (modalMode === "agregar") {
		modalTitle = "Agregar Nuevo Profesional";
	}

	// Usar editProfesionalData si el modal está en modo "editar"
	const profesionalData =
		modalMode === "editar" ? editProfesionalData : profesional;

	// ESTABLECE LOS VALORES INICIALES DEL MODAL
	const [inputValues, setInputValues] = useState({
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
	});

	// FUNCION PARA CARGAR LOS DATOS DEL PROFESIONAL A EDITAR
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setInputValues({
			...inputValues,
			[name]: value,
		});
	};

	// FUNCION PARA CONTROLAR EL CHECKBOX
	const handleSwitchChange = (e) => {
		const { name, checked } = e.target;
		setInputValues({
			...inputValues,
			[name]: checked,
		});
	};

	// SI LA PROP PROFESIONAL TRAE DATOS, CARGA DATOS DEL PROFESIONAL EN LOS INPUTS
	useEffect(() => {
		if (profesional) {
			setInputValues({
				nombre: profesional.nombre || "",
				dni: profesional.dni || "",
				cuit: profesional.cuit || "",
				telefono: profesional.telefono || "",
				email: profesional.email || "",
				matricula: profesional.matricula || "",
				domicilio: profesional.domicilio || "",
				localidad: profesional.localidad || "",
				fecha_nacimiento: profesional.fecha_nacimiento || "",
				imagen: profesional.imagen || "",
				activo: profesional.activo || false,
				estado_matricula_id: profesional.estado_matricula_id || "",
			});
		}
	}, [profesional]);

	// CARGAR ESTADOS DE MATRICULA EN EL SELECT
	useEffect(() => {
		const fetchEstadosMatriculas = async () => {
			try {
				const endpoint = "http://127.0.0.1:5000/api/estados";
				const direction = "";
				const method = "GET";
				const body = false;
				const headers = {
					"Content-Type": "application/json",
					// Authorization: localStorage.getItem("token"),
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

	// CERRAR MODAL Y RESTABLECER DATOS
	const closeModalAndResetData = () => {
		setShowModal(false);
		onClose();
	};

	if (!profesional) {
		return <div>Loading...</div>;
	}

	// FUNCION PARA ACTUALIZAR LOS DATOS
	const handleFormSubmit = async (e) => {
		e.preventDefault();

		try {
			const endpoint = "http://127.0.0.1:5000/api/profesionales/";
			const direction = `${profesional.id}`;
			const method = profesional ? "PUT" : "POST"; // Método dependiendo de si es una actualización o una creación
			const body = inputValues;
			const headers = {
				"Content-Type": "application/json",
				// Authorization: localStorage.getItem("token"),
			};

			// Realizar la llamada al servidor
			const response = await apiConnection(
				endpoint,
				direction,
				method,
				body,
				headers
			);

			sweetAlert(
				"success",
				"Operación exitosa!",
				"El registro se guardó exitosamente.",
				2500,
				false
			); // icono , titulo , mensaje, mostrarOk, tiempo en milisegundos

			
			// CERRAR MODAL
			setTimeout(() => {
				closeModalAndResetData();
				fetchProfesionales();
			},2500);
			
		} catch (error) {
			console.error("Error:", error.message);
			sweetAlert(
				"error",
				"Error en la operación",
				error.message,
				2500,
				false
			);
		}
	};

	return (
		<div
			className={`modal ${showModal ? "show" : ""}`}
			tabIndex="-1"
			style={{ display: showModal ? "block" : "none" }}
			id="staticBackdrop"
			data-bs-target="#staticBackdrop">
			<div className="modal-dialog modal-xl">
				<div className="modal-content bg-secondary">
					<div className="modal-header bg-primary">
						<h5 className="modal-title">{modalTitle}</h5>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={closeModalAndResetData}></button>
					</div>
					<form onSubmit={handleFormSubmit}>
						{/* <form> */}
						<div className="modal-body">
							<div className="container-fluid">
								<div className="row">
									{/* Nombre Completo */}
									<div className="col-6 mb-3">
										<label
											htmlFor="nombre"
											className="form-label mb-0">
											Nombre Completo
										</label>
										<input
											type="text"
											className="form-control"
											id="nombre"
											name="nombre"
											value={inputValues.nombre}
											readOnly={modalMode === "mostrar"}
											onChange={handleInputChange}
										/>
									</div>
									{/* DNI */}
									<div className="col mb-3">
										<label
											htmlFor="dni"
											className="form-label mb-0">
											DNI
										</label>
										<input
											type="text"
											className="form-control"
											id="dni"
											name="dni"
											value={inputValues.dni}
											readOnly={modalMode === "mostrar"}
											onChange={handleChangeDni}
										/>
									</div>
									{/* CUIT */}
									<div className="col mb-3">
										<label
											htmlFor="cuit"
											className="form-label mb-0">
											CUIT
										</label>
										<input
											type="text"
											className="form-control"
											id="cuit"
											name="cuit"
											value={inputValues.cuit}
											readOnly={modalMode === "mostrar"}
											onChange={handleInputChange}
										/>
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
											name="telefono"
											value={inputValues.telefono}
											readOnly={modalMode === "mostrar"}
											onChange={handleInputChange}
										/>
									</div>
									{/* E-Mail */}
									<div className="col mb-3">
										<label
											htmlFor="email"
											className="form-label mb-0">
											E-Mail
										</label>
										<input
											type="email"
											className="form-control"
											id="email"
											name="email"
											value={inputValues.email}
											readOnly={modalMode === "mostrar"}
											onChange={handleInputChange}
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
											name="fecha_nacimiento"
											value={inputValues.fecha_nacimiento}
											readOnly={modalMode === "mostrar"}
											onChange={handleInputChange}
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
											name="domicilio"
											value={inputValues.domicilio}
											readOnly={modalMode === "mostrar"}
											onChange={handleInputChange}
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
											name="localidad"
											value={inputValues.localidad}
											readOnly={modalMode === "mostrar"}
											onChange={handleInputChange}
										/>
									</div>
								</div>
								<div className="row">
									{/* Matrícula */}
									<div className="col mb-3">
										<label
											htmlFor="matricula"
											className="form-label mb-0">
											Matrícula
										</label>
										<input
											type="text"
											className="form-control"
											id="matricula"
											name="matricula"
											value={inputValues.matricula}
											readOnly={modalMode === "mostrar"}
											onChange={handleInputChange}
										/>
									</div>
									{/* Estado de Matrícula */}
									<div className="col mb-3">
										<label
											htmlFor="estado_matricula_id"
											className="form-label mb-0">
											Estado de Matrícula
										</label>
										{modalMode === "mostrar" ? (
											<input
												type="text"
												className="form-control"
												id="estado_matricula_id"
												name="estado_matricula_id"
												value={
													estadosMatriculas.find(
														(estado) =>
															estado.id ===
															inputValues.estado_matricula_id
													)?.estado || ""
												}
												readOnly
											/>
										) : (
											<select
												className="form-select"
												id="estado_matricula_id"
												name="estado_matricula_id"
												value={
													inputValues.estado_matricula_id ||
													"" // Verificación de nulo aquí
												}
												onChange={handleInputChange}>
												<option>Seleccionar</option>
												{estadosMatriculas.map(
													(estado) => (
														<option
															key={estado.id}
															value={estado.id}>
															{estado.estado}
														</option>
													)
												)}
											</select>
										)}
									</div>
									{/* Activo */}
									<div className="col-1 mb-3 text-center">
										<label
											htmlFor="activo"
											className="form-label mb-0">
											Activo
										</label>
										<div className="form-check form-switch">
											<input
												type="checkbox"
												className="form-check-input"
												id="activo"
												name="activo"
												value={setInputValues.activo}
												checked={inputValues.activo}
												onChange={
													modalMode !== "mostrar"
														? handleSwitchChange
														: null
												}
												readOnly={
													modalMode === "mostrar"
												}
											/>
										</div>
									</div>
									{/* Imagen */}
									<div className="col mb-3">
										<label
											htmlFor="imagen"
											className="form-label mb-0">
											Imagen
										</label>
										<input
											type="file"
											className="form-control"
											id="imagen"
											name="imagen"
										/>
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
								onClick={closeModalAndResetData}>
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

import React, { useEffect, useState } from "react";
import sweetAlert from "../toast/SweetAlert";
import apiConnection from "../../../../backend/functions/apiConnection";

const ProfesionalesModal = ({
	showModal,
	closeModal,
	data,
	modalMode,
	fetchProfesionales,
}) => {
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
		imagen: null,
		activo: false,
		estado_matricula_id: "",
	};

	const [formData, setFormData] = useState(initialState);

	const [estadosMatriculas, setEstadosMatriculas] = useState([]);

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
		setFormData({
			...formData,
			[name]: value,
		});
	};

	// FORMATO PARA EL NOMBRE
	const [nombre, setNombre] = useState("");
	const handleChangeNombre = (event) => {
		const value = event.target.value.toUpperCase(); // Convertir a mayúsculas
		setFormData({
			...formData,
			nombre: value,
		});
	};

	// FORMATO PARA EL DNI
	const [dni, setDni] = useState("");
	const handleChangeDni = (event) => {
		let value = event.target.value;
		value = value.replace(/\D/g, "");
		value = value.slice(0, 8);
		let formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
		setFormData({
			...formData,
			dni: formattedValue,
		});
	};

	// FORMATO PARA EL CUIT
	const [cuit, setCuit] = useState("");
	const handleChangeCuit = (event) => {
		let value = event.target.value.replace(/\D/g, "");
		value = value.slice(0, 11);
		if (value.length >= 2) {
			value = value.slice(0, 2) + "-" + value.slice(2);
		}
		if (value.length >= 11) {
			value = value.slice(0, 11) + "-" + value.slice(11);
		}
		setFormData({
			...formData,
			cuit: value,
		});
	};

	// FUNCION PARA CONTROLAR EL CHECKBOX
	const handleSwitchChange = (e) => {
		const { name, checked } = e.target;
		setFormData({
			...formData,
			[name]: checked,
		});
	};

	useEffect(() => {
		if (formData) {
			if (formData.fecha_nacimiento == "0000-00-00") {
				formData.fecha_nacimiento = "";
			}
			setInputValues({
				nombre: formData.nombre || "",
				dni: formData.dni || "",
				cuit: formData.cuit || "",
				telefono: formData.telefono || "",
				email: formData.email || "",
				matricula: formData.matricula || "",
				domicilio: formData.domicilio || "",
				localidad: formData.localidad || "",
				fecha_nacimiento: formData.fecha_nacimiento || "",
				imagen: formData.imagen || "",
				activo: formData.activo || false,
				estado_matricula_id: formData.estado_matricula_id || "",
			});
		}
	}, [formData]);

	// DEFINE EL TITULO DEL MODAL
	let modalTitle = "";
	if (modalMode === "mostrar") {
		modalTitle = "Mostrar Profesional";
	} else if (modalMode === "editar") {
		modalTitle = "Editar Profesional";
	} else if (modalMode === "agregar") {
		modalTitle = "Agregar Nuevo Profesional";
	}

	// const handleChange = (e) => {
	// 	const { name, value } = e.target;
	// 	setFormData({ ...formData, [name]: value });
	// };

	// const handleFileChange = (e) => {
	// 	const file = e.target.files[0];
	// 	// Aquí puedes manejar el archivo como desees, por ejemplo, mostrar una vista previa o almacenarlo en el estado
	// };

	// FUNCION PARA ACTUALIZAR LOS DATOS
	const handleFormSubmit = async (e) => {
		e.preventDefault();

		// Remover el guion del CUIT y los puntos del DNI
		const cuitSinGuion = inputValues.cuit.replace(/-/g, "");
		const dniSinPuntos = inputValues.dni.replace(/\./g, "");

		// Crear una copia del formData con los valores transformados
		const formDataToSend = {
			...inputValues,
			cuit: cuitSinGuion,
			dni: dniSinPuntos,
		};

		try {
			const endpoint = "http://127.0.0.1:5000/api/profesionales/";
			const direction = formDataToSend ? `/${data.id}` : ""; // Si hay data, es una actualización, de lo contrario, es una creación
			const method = formDataToSend ? "PUT" : "POST"; // Método dependiendo de si es una actualización o una creación
			const body = formDataToSend;

			const headers = {
				"Content-Type": "application/json",
				// Authorization: localStorage.getItem("token"),
			};

			const response = await apiConnection(
				endpoint,
				direction,
				method,
				body,
				headers
			);

			// Después de agregar el nuevo registro, llamar a la función para actualizar los datos del padre
			// updateParentData(formDataToSend);

			if (response.data) {
				// MOSTRAR SWEET ALERT

				sweetAlert(
					"success",
					"Operación exitosa!",
					"¡Registro guardado exitosamente.",
					2500,
					false
				);

				// CERRAR MODAL
				setTimeout(() => {
					closeModalAndResetData();
					fetchProfesionales();
				}, 2500);
			} else {
				console.error("Error en la operación:", response.error);
			}
		} catch (error) {
			if (error.message.includes("duplicado")) {
				sweetAlert(
					"error",
					"Error al guardar el registro",
					"El valor que está intentando guardar ya existe en la base de datos.",
					2500,
					false
				);
				;
			} else {
				sweetAlert(
					"error",
					"Error al guardar el registro",
					"Ocurrió un error al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.",
					2500,
					false
				);
			}

			console.error("Error:", error.message);
			// Verificar si el error es debido a un DNI duplicado
			if (error.response && error.response.status === 409) {
				sweetAlert(
					"error",
					"Error al guardar el registro",
					"El DNI ingresado ya existe en la base de datos.",
					2500,
					false
				);
			} else {
				sweetAlert(
					"error",
					"Error al guardar el registro",
					"Ocurrió un error al intentar guardar el registro. Por favor, inténtelo de nuevo más tarde.",
					2500,
					false
				);
			}
		}
	};

	const closeModalAndResetData = () => {
		closeModal();
		setFormData(initialState);
	};

	useEffect(() => {
		if (data) {
			setFormData(data); // Utiliza los datos del profesional seleccionado si están disponibles
		}
	}, [data]);

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
											onChange={handleChangeNombre}
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
											onChange={handleChangeCuit}
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

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
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
		imagen: "",
		activo: false,
		estado_matricula_id: "",
	};

	const [imagePreview, setImagePreview] = useState("");
	const [file, setFile] = useState();

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
	// const [nombre, setNombre] = useState("");
	const handleChangeNombre = (event) => {
		const value = event.target.value.toUpperCase(); // Convertir a mayúsculas
		setFormData({
			...formData,
			nombre: value,
		});
	};

	// FORMATO PARA EL DNI
	// const [dni, setDni] = useState("");
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
	// const [cuit, setCuit] = useState("");
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

	// FUNCION PARA VERIFICAR SI EL DNI EXISTE
	const checkDniExists = async (dni) => {
		try {
			const endpoint = `http://localhost:5000/api/profesionales/dni/${dni}`;
			const response = await fetch(endpoint);

			const data = await response.json();

			if (response.ok) {
				return data.success;
			}
		} catch (error) {
			console.error("Error al verificar si el DNI existe:", error);
		}
	};

	// DEFINE EL TITULO DEL MODAL
	let modalTitle = "";
	if (modalMode === "mostrar") {
		modalTitle = "Mostrar Profesional";
	} else if (modalMode === "editar") {
		modalTitle = "Editar Profesional";
	} else if (modalMode === "agregar") {
		modalTitle = "Agregar Nuevo Profesional";
	}

	// FUNCION PARA MOSTRAR LA IMAGEN
	const handleImageChange = (e) => {
		const selectedFile = e.target.files[0];

		// Si no se selecciona ningún archivo, borramos la vista previa
		if (!selectedFile) {
			setImagePreview("");
			return;
		}

		inputValues.imagen =
			"img_profesional_" +
			inputValues.dni +
			"." +
			selectedFile.name.split(".").pop();

		setFile(selectedFile);

		const file = e.target.files[0];

		const reader = new FileReader();
		reader.onloadend = () => {
			setImagePreview(reader.result);
		};
		reader.readAsDataURL(selectedFile);
	};

	// FUNCION PARA ELIMINAR LA IMAGEN
	const handleRemoveImage = async () => {
		try {
			const result = await Swal.fire({
				title: "¿Estás seguro?",
				text: "Esta acción no podrá deshacerse",
				icon: "warning",
				showConfirmButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Sí, eliminar",
				showCancelButton: true,
				cancelButtonText: "Cancelar",
			});

			if (result.isConfirmed) {
				if (data.imagen) {
					// Hacer una solicitud HTTP para eliminar el archivo
					const response = await fetch(
						"http://localhost:5000/api/deleteimage/" + data.imagen,
						{
							method: "DELETE",
							headers: {
								"Content-Type": "application/json",
								Authorization: localStorage.getItem("token"),
							},
							body: JSON.stringify({
								filename: data.imagen,
							}),
						}
					);
					if (response.ok) {
						// Si la eliminación fue exitosa, actualizar la interfaz de usuario
						console.log("Archivo eliminado exitosamente");
						// Guardar en la base de datos el campo imagen vacío
						const endpoint =
							"http://127.0.0.1:5000/api/profesionales/";
						const direction = `${data.id}`;
						const method = "PATCH";
						const body = {
							imagen: "",
						};

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
					} else {
						console.error(
							"Error al eliminar el archivo:",
							response.statusText
						);
					}
				}
				setImagePreview("");
				setFile(null);
				document.getElementById("file").value = "";
				inputValues.imagen = "";
			}
		} catch (error) {
			console.error("Error al eliminar el archivo:", error);
		}
	};

	// FUNCION PARA SUBIR LA IMAGEN
	const handleUpload = async () => {
		// if (!file) {
		// 	// Verificar si hay un archivo seleccionado
		// 	Swal.fire({
		// 		icon: "error",
		// 		title: "Oops...",
		// 		text: "No hay una imagen para subir",
		// 		confirmButtonText: "Ok",
		// 	});
		// 	return false;
		// }

		const formFile = new FormData();
		formFile.append("file", file);

		const dniSinPuntos = inputValues.dni.replace(/\./g, "");

		const fileExtension = file.name.split(".").pop();

		const fileName = `img_profesional_${dniSinPuntos}.${fileExtension}`;

		formFile.set("file", file, fileName);

		try {
			const response = await fetch(
				"http://localhost:5000/api/loadimage/",
				{
					method: "POST",
					body: formFile,
				}
			);

			if (response.ok) {
				console.log("Imagen subida correctamente. ", fileName);
				return fileName; // Devolver el nombre de archivo
			} else {
				console.error("Error al subir la imagen:", response.statusText);
				return false; // Devolver falso si hubo un error al subir la imagen
			}
		} catch (error) {
			console.error("Error de red:", error);
			return false; // Devolver falso si hubo un error de red
		}
	};

	// FUNCION PARA ACTUALIZAR LOS DATOS
	const handleFormSubmit = async (e) => {
		e.preventDefault();

		// Remover el guion del CUIT y los puntos del DNI
		const cuitSinGuion = inputValues.cuit.replace(/-/g, "");
		const dniSinPuntos = inputValues.dni.replace(/\./g, "");

		// Subir la imagen

		const imagenSubida = await handleUpload();

		// if (imagenSubida) {
		// 	// Si la imagen se subió correctamente, actualizar inputValues.imagen a true
		// 	inputValues.imagen = imagenSubida;
		// } else {
		// 	if (inputValues.imagen) {
		// 		Swal.fire({
		// 			title: "¿Estás seguro?",
		// 			text: "Esta acción no se podrá deshacer",
		// 			icon: "warning",
		// 			showConfirmButton: true,
		// 			confirmButtonColor: "#3085d6",
		// 			cancelButtonColor: "#d33",
		// 			confirmButtonText: "Sí, eliminar",
		// 			showCancelButton: true,
		// 			cancelButtonText: "Cancelar",
		// 		}).then((result) => {
		// 			if (result.isConfirmed) {
		// 				inputValues.imagen = ""; // Reiniciamos el estado del input de imagen
		// 			}
		// 		});
		// 	}
		// }

		// Crear una copia del formData con los valores transformados
		const formDataToSend = {
			...inputValues,
			cuit: cuitSinGuion,
			dni: dniSinPuntos,
		};

		try {
			if (modalMode === "agregar") {
				// Verificar si el DNI ya existe
				const dniExists = await checkDniExists(formDataToSend.dni);
				if (dniExists) {
					// Mostrar mensaje de error al usuario
					Swal.fire({
						icon: "error",
						title: "Error al guardar el registro",
						text: "El DNI ingresado ya existe en la base de datos.",
						showConfirmButton: true,
						timer: null,
					});
					return; // Salir de la función si el DNI está duplicado
				} else {
					// Si el DNI no existe, continuar con la creación o actualización
					console.log(
						"El DNI no esta duplicado en la base de datos."
					);
				}
			}

			const endpoint = "http://127.0.0.1:5000/api/profesionales/";
			const direction = data ? `${data.id}` : ""; // Si hay data, es una actualización, de lo contrario, es una creación
			const method = data ? "PUT" : "POST"; // Método dependiendo de si es una actualización o una creación
			const body = formDataToSend;

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
					closeModalAndResetData();
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

	const closeModalAndResetData = () => {
		setFile(null);
		// document.getElementById("file").value = ""; // Reiniciar el input de archivo
		setFormData(initialState);
		closeModal();
		setImagePreview(""); // Limpiar la vista previa de la imagen después de un breve retraso
	};

	useEffect(() => {
		if (!showModal) {
			setImagePreview(""); // Limpiar la vista previa de la imagen al cerrar el modal
			setFile(null);
			// data.imagen = "";
		}
	}, [showModal]);

	useEffect(() => {
		if (data) {
			setFormData(data); // Utiliza los datos del profesional seleccionado si están disponibles
			if (data.id && data.imagen !== "") {
				setImagePreview(`./../../public/uploads/${data.imagen}`);
			}
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
											required
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
											required
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
									<div className="col-2 ">
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
											required
										/>
									</div>
									{/* Estado de Matrícula */}
									<div className="col-3 ">
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
												required
												value={
													inputValues.estado_matricula_id ||
													"" // Verificación de nulo
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
									<div className="col">
										<div className="row align-items-end">
											{imagePreview && (
												<>
													<div className="col-auto">
														<label
															htmlFor="vista_previa"
															className="form-label">
															Imagen
														</label>
													</div>
													<div className="row align-items-end">
														<div className="col-auto">
															<img
																name="vista_previa"
																src={
																	imagePreview
																}
																alt="Vista previa"
																className="img-fluid rounded mx-auto"
																style={{
																	maxHeight:
																		"2.5rem",
																}}
															/>
														</div>
														<div className="col-auto">
															{modalMode !==
																"mostrar" && (
																<button
																	type="button"
																	className="btn btn-danger ms-md-auto"
																	onClick={
																		handleRemoveImage
																	}>
																	<i className="fa-solid fa-ban me-2"></i>
																	Eliminar
																	Imagen
																</button>
															)}
														</div>
													</div>
												</>
											)}
											{!imagePreview &&
												modalMode !== "mostrar" && (
													<>
														<div className="col-auto">
															<label
																htmlFor="fileInput"
																className="btn btn-light form-control m-0">
																<i className="fa-solid fa-upload"></i>{" "}
																Subir imagen...
															</label>
															<input
																className="mb-0"
																type="file"
																id="fileInput"
																name="file"
																style={{
																	display:
																		"none",
																}}
																onChange={
																	handleImageChange
																}
															/>
														</div>
													</>
												)}
										</div>
									</div>
									<div>
										<input
											type="hidden"
											value={inputValues.imagen || ""}
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

import React, { useEffect, useState, useRef } from "react";
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
	const [estadosMatriculas, setEstadosMatriculas] = useState([]);
	const [selectedImage, setSelectedImage] = useState(null);
	const inputRef = useRef(null); // Referencia al input de imagen
	const [imagenUrl, setImagenUrl] = useState(null);
	const [imagePreview, setImagePreview] = useState("");
	const [selectedFile, setSelectedFile] = useState();

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

	const initialState = {
		nombre: "",
		dni: "",
		cuit: "",
		telefono: "",
		email: "",
		matricula: "",
		matricula_fecha: "",
		domicilio: "",
		localidad: "",
		fecha_nacimiento: "",
		imagen: null,
		activo: false,
		estado_matricula_id: "",
	};

	useEffect(() => {
		clearSelectedImage();
		if (modalMode === "agregar") {
			reset(initialState);
			clearSelectedImage();
		} else if (data) {
			if (data.fecha_nacimiento == "0000-00-00") {
				data.fecha_nacimiento = "";
			}
			if (data.matricula_fecha == "0000-00-00") {
				data.matricula_fecha = "";
			}
			reset(data);
		}
	}, [modalMode]);

	// Manejador de cambios en el input de imagen
	const handleImageChange = (e) => {
		const selectedFile = e.target.files[0];
		setSelectedFile(selectedFile);

		setSelectedImage(selectedFile.name);

		// Si no se selecciona ningún archivo, borramos la vista previa
		if (selectedFile) {
			setImagePreview(URL.createObjectURL(selectedFile));
		} else {
			console.log("data.imagen: ", data.imagen);
			if (!data.imagen) {
				setImagePreview(""); // Limpiar la vista previa si no hay archivo seleccionado
			}
		}

		// Verificar si el archivo es una imagen
		const acceptedImageTypes = ["image/jpeg", "image/png", "image/gif"]; // Agrega los tipos MIME de las imágenes permitidas
		if (!acceptedImageTypes.includes(selectedFile.type)) {
			Swal.fire({
				icon: "error",
				title: "Tipo de archivo incorrecto",
				text: "Por favor, selecciona un archivo de imagen válido (JPEG, PNG o GIF).",
			});
			return;
		}

		// Verificar el tamaño del archivo (1MB = 1048576 bytes)
		const maxSize = 1048576; // Tamaño máximo permitido en bytes
		if (selectedFile.size > maxSize) {
			Swal.fire({
				icon: "error",
				title: "Tamaño de archivo excedido",
				text: "El tamaño del archivo seleccionado supera el límite de 1MB.",
			});
			return;
		}

		setSelectedFile(selectedFile);

		const file = e.target.files[0];

		const reader = new FileReader();
		reader.onloadend = () => {
			setImagePreview(reader.result); // Actualiza la vista previa de la imagen con la URL base64 generada
		};
		reader.readAsDataURL(selectedFile);
	};

	// Función para blanquear el input de imagen
	const clearSelectedImage = () => {
		setSelectedImage("./../../../assets/img/noimage.png");
		setSelectedFile("./../../../assets/img/noimage.png");
		setImagePreview("./../../../assets/img/noimage.png");
		// Establecer el valor del input a null o una cadena vacía
		inputRef.current.value = ""; // Esto blanquea el input
	};

	useEffect(() => {
		if (data) {
			reset(data);
			// Si hay una imagen almacenada en los datos, establecerla como imagen seleccionada
			if (data.imagen) {
				// setSelectedImage(data.imagen);
				setImagePreview("./../../../public/uploads/" + data.imagen);
			}
		}
	}, [data, reset]);

	useEffect(() => {
		if (data && data.imagen) {
			loadImage(data.imagen);
		} else {
			setImagenUrl("./../../../assets/img/noimage.png"); // Si no hay imagen en los datos, limpia la URL de la imagen
		}
	}, [data]);

	// useEffect(() => {
	// 	if (showModal) {
	// 		clearSelectedImage(); // Limpiar la imagen seleccionada cada vez que se abre el modal
	// 	}
	// }, [showModal]);

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
		} catch (error) {}
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

			console.log("selectedImage: ", selectedImage);
			console.log("selectedFile: ", selectedFile);

			if (selectedImage) {
				// Subir la imagen al servidor y obtener el nombre del archivo
				const fileName = await uploadImage();
				// Asignar el nombre del archivo al campo de imagen en formData
				formData.imagen = fileName;
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

	// Función para subir la imagen al servidor
	const uploadImage = async () => {
		try {
			if (selectedFile) {
				// Crear un objeto FormData para enviar la imagen al servidor
				const formData = new FormData();

				formData.append("file", selectedFile);

				const fileExtension = selectedFile.name.split(".").pop();

				const fileName = `avatar_${data.id}.${fileExtension}`;

				formData.set("file", selectedFile, fileName);

				// Endpoint para la subida de la imagen
				const endpoint = "http://localhost:5000/api/loadimage";

				// Realizar la petición al servidor
				const response = await fetch(endpoint, {
					method: "POST",
					body: formData,
				});

				if (response.ok) {
					return fileName;
				} else {
					// Error al subir la imagen
					throw new Error("Error al subir la imagen al servidor");
				}
			} else {
				// No hay imagen seleccionada
				throw new Error("No se ha seleccionado ninguna imagen.");
			}
		} catch (error) {
			console.error("Error al subir la imagen:", error.message);
			Swal.fire({
				icon: "error",
				title: "Error al subir la imagen",
				text: "Ocurrió un error al subir la imagen al servidor. Por favor, inténtelo de nuevo más tarde.",
			});

			return null;
		}
	};

	const loadImage = async (imageName) => {
		try {
			const response = await fetch(
				`http://localhost:5000/api/checkimage/${imageName}`
			);
			if (response.ok) {
				const res = await response.json();
				if (res.exists) {
					setImagenUrl(`./../../../public/uploads/${imageName}`);
					setSelectedImage(imageName); // Actualizar el estado selectedImage
				} else {
					setImagenUrl("./../../../assets/img/noimage.png");
					setSelectedImage("./../../../assets/img/noimage.png"); // Limpiar selectedImage si no existe la imagen
				}
				// Si la solicitud es exitosa, establece la URL de la imagen
			} else {
				// Si hay algún error al cargar la imagen, muestra un mensaje de error
				console.error(
					"Error al cargar la imagen:",
					response.statusText
				);
				setImagenUrl("./../../../assets/img/noimage.png");
				setSelectedImage("./../../../assets/img/noimage.png"); // Limpia selectedImage en caso de error
				clearSelectedImage(); // Limpiar selectedImage si hay un error de carga
			}
		} catch (error) {
			console.error("Error al cargar la imagen:", error.message);
			setImagenUrl(null); // Limpia la URL de la imagen
			setSelectedImage(null); // Limpia selectedImage en caso de error
			clearSelectedImage(); // Limpiar selectedImage si hay un error de carga
		}
	};

	const deleteImage = async () => {
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
							"http://localhost:5000/api/profesionales/";
						const direction = `${data.id}`;
						const method = "PATCH";
						const body = {
							imagen: null,
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
				clearSelectedImage();
			}
		} catch (error) {
			console.error("Error al eliminar el archivo:", error);
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
								<div className="row mb-3">
									{/* Nombre Completo */}
									<div className="col-6">
										<label
											htmlFor="nombre"
											className="form-label mb-0">
											Nombre Completo{" "}
											{modalMode !== "mostrar" && (
												<span className="text-warning">
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
									<div className="col">
										<label
											htmlFor="dni"
											className="form-label mb-0">
											DNI{" "}
											{modalMode !== "mostrar" && (
												<span className="text-warning">
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
									<div className="col">
										<label
											htmlFor="cuit"
											className="form-label mb-0">
											CUIT{" "}
											{modalMode !== "mostrar" && (
												<span className="text-warning">
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
								<div className="row mb-3">
									{/* Teléfono */}
									<div className="col-4">
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
									</div>
									{/* Fecha de Nacimiento */}
									<div className="col-2">
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
											readOnly={modalMode === "mostrar"}
											{...register("domicilio")}
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
											readOnly={modalMode === "mostrar"}
											{...register("localidad")}
										/>
									</div>
								</div>
								<div className="row mb-3">
									{/* Matrícula */}
									<div className="col-2">
										<label
											htmlFor="matricula"
											className="form-label mb-0">
											Matrícula{" "}
										</label>
										<input
											type="text"
											className="form-control"
											id="matricula"
											readOnly={modalMode === "mostrar"}
											{...register("matricula")}
										/>
									</div>
									{/* Fecha de Matrícula */}
									<div className="col-2">
										<label
											htmlFor="matricula_fecha"
											className="form-label mb-0">
											Fecha Matr.{" "}
										</label>
										<input
											type="date"
											className="form-control"
											id="matricula_fecha"
											readOnly={modalMode === "mostrar"}
											{...register("matricula_fecha")}
										/>
									</div>
									{/* Estado de Matrícula */}
									<div className="col-3">
										<label
											htmlFor="estado_matricula_id"
											className="form-label mb-0">
											Estado de Matrícula{" "}
										</label>
										<select
											className="form-select"
											disabled={modalMode === "mostrar"}
											id="estado_matricula_id"
											{...register(
												"estado_matricula_id"
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
								<div className="row mb-3">
									{/* Label para el input de imagen (estilizado como botón) */}
									<label
										htmlFor="file"
										className="form-label mb-0">
										Imagen
									</label>
									{/* Input de imagen (oculto) */}
									<input
										type="file"
										id="file"
										accept="image/*"
										onChange={handleImageChange}
										ref={inputRef}
										style={{ display: "none" }}
										disabled={modalMode === "mostrar"} // Deshabilita el input de imagen si modalMode es "mostrar"
									/>
									{/* Avatar o imagen seleccionada */}
									<div className="col-1 d-flex align-items-center justify-content-center">
										<img
											src={
												imagePreview ||
												"./../../../assets/img/noimage.png"
											}
											alt="Imagen del Profesional"
											style={{
												width: "60px",
												height: "60px",
												borderRadius: "50%",
												marginTop: "10px",
												cursor:
													modalMode === "mostrar"
														? "default"
														: "pointer",
											}}
											onClick={() =>
												inputRef.current.click()
											}
										/>
									</div>
									{/* Botones para subir y borrar la imagen */}
									{selectedImage && data && data.imagen && (
											<div className="col-3 d-flex align-items-center">
												<button
													type="button"
													className="btn btn-danger"
													onClick={deleteImage}>
													Eliminar
												</button>
											</div>
										)}
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

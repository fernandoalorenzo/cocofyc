import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";

const DenunciasSeguimientosModal = ({
	showModalSeguimiento,
	closeModalSeguimiento,
	editingSeguimiento,
	modalSeguimientoMode,
	updateSeguimientos,
	denunciaId,
	API_ENDPOINT,
	SERVER_PATH,
}) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm();

	const user = JSON.parse(localStorage.getItem("user")) || {};
	const [data, setData] = useState([]);
	const [archivosSeguimiento, setArchivosSeguimiento] = useState([]);

	const getCurrentDate = () => {
		const now = new Date();
		const year = now.getFullYear();
		let month = now.getMonth() + 1;
		let day = now.getDate();
		if (month < 10) month = "0" + month;
		if (day < 10) day = "0" + day;
		return `${year}-${month}-${day}`;
	};

	const initialState = {
		fecha: getCurrentDate(),
		proximo_seguimiento: null,
		respuesta: "",
	};

	const onSubmit = async (formData) => {
		let direction = "";
		let method = "";

		const newData = {
			...formData,
			user_id: user.id,
		};

		try {
			const endpoint = `${API_ENDPOINT}/denuncias/seguimiento/`;
			if (modalSeguimientoMode === "editar") {
				direction = editingSeguimiento.id;
				method = "PUT";
			} else if (modalSeguimientoMode === "agregar") {
				direction = denunciaId;
				method = "POST";
			}
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

			if (response) {
				// SI GUARDO EL REGISTRO CORRECTAMENTE, SUBE ARCHIVOS AL SERVIDOR
				let uploadedFileNames = [];
				if (selectedFiles.length > 0) {
					uploadedFileNames = await uploadFile(
						selectedFiles,
						editingSeguimiento.id
					);
					if (uploadedFileNames.length > 0) {
						try {
							for (const archivo of uploadedFileNames) {
								const formData = new FormData();
								formData.append("file", archivo);

								const endpoint = `${API_ENDPOINT}/archivos-seguimientos/`;
								const method = "POST";
								const body = {
									user_id: user.id,
									denuncia_seguimiento_id:
										editingSeguimiento.id,
									fecha: getCurrentDate(),
									archivo: archivo.nombre,
									archivo_descripcion: archivo.descripcion,
								};
								const headers = {
									"Content-Type": "application/json",
									Authorization:
										localStorage.getItem("token"),
								};

								const response = await fetch(endpoint, {
									method: method,
									headers: headers,
									body: JSON.stringify(body),
								});

								if (!response.ok) {
									throw new Error(
										"Error al guardar la información del archivo en la base de datos"
									);
								}
							}
						} catch (error) {
							console.error(
								"Error en la operación de guardar datos de archivos:",
								error
							);
						}
					}
				}
				Swal.fire({
					icon: "success",
					title: "Operación exitosa!",
					text: "Registro guardado exitosamente.",
					showConfirmButton: false,
					timer: 2500,
				});

				// CERRAR MODAL
				setTimeout(() => {
					updateSeguimientos();
					reset(initialState);
					setSelectedFiles([]);
					setArchivosSeguimiento([]);
					setData([]);
					closeModalSeguimiento(true);
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
		if (editingSeguimiento && modalSeguimientoMode === "editar") {
			reset({
				fecha: editingSeguimiento.fecha,
				respuesta: editingSeguimiento.respuesta,
				proximo_seguimiento: editingSeguimiento.proximo_seguimiento,
			});
			fetchArchivos();
		} else if (modalSeguimientoMode === "agregar") {
			reset(initialState);
		}
	}, [editingSeguimiento, modalSeguimientoMode, reset]);

	useEffect(() => {
		if (data && data.length > 0) {
			setArchivosSeguimiento(data);
		}
	}, [data]);

	useEffect(() => {
		setArchivosSeguimiento([]);
		if (editingSeguimiento && modalSeguimientoMode === "editar") {
			reset({
				fecha: editingSeguimiento.fecha,
				respuesta: editingSeguimiento.respuesta,
				proximo_seguimiento: editingSeguimiento.proximo_seguimiento,
			});
			fetchArchivos();
		} else if (modalSeguimientoMode === "agregar") {
			reset(initialState);
		}
		if (showModalSeguimiento) {
			fetchArchivos();
		}
	}, [showModalSeguimiento]);

	// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ ARCHIVOS ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
	const [selectedFiles, setSelectedFiles] = useState([]);

	const onSelectFile = (event) => {
		const selectedFiles = event.target.files;
		const selectedFilesArray = Array.from(selectedFiles);

		const filesArray = selectedFilesArray.map((file) => {
			return {
				file: file,
				url: URL.createObjectURL(file),
				name: file.name,
				type: file.type,
				descripcion: "",
			};
		});

		setSelectedFiles((previousFiles) => previousFiles.concat(filesArray));

		// FOR BUG IN CHROME
		event.target.value = "";
	};

	// Función para actualizar la descripción de un archivo
	const updateDescripcion = (index, value) => {
		setSelectedFiles((prevFiles) => {
			const updatedFiles = [...prevFiles];
			updatedFiles[index].descripcion = value;
			return updatedFiles;
		});
	};

	function deleteFilesSelectedHandler(fileUrl) {
		setSelectedFiles((previousFiles) =>
			previousFiles.filter((file) => file.url !== fileUrl)
		);
	}

	const fetchArchivos = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/archivos-seguimientos/`;
			const direction = editingSeguimiento.id;
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

			if (response.data) {
				// const responseData = await response.json();
				setData(response.data);
			} else {
				throw new Error("Failed to fetch archivos seguimientos.");
			}
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	// Función para subir el archivo al servidor
	const uploadFile = async (archivos, id_seguimiento) => {
		try {
			const promises = archivos.map(async (archivo) => {
				if (archivo) {
					// Crear un objeto FormData para enviar la archivo al servidor
					// const fileExtension = archivo.name.split(".").pop();
					const fileName = `seguimiento_${id_seguimiento}_${normalizeFileName(
						archivo.name
					)}`;
					const formData = new FormData();
					formData.append("file", archivo.file, fileName);

					const endpoint = `${API_ENDPOINT}/loadimage/`;

					const response = await fetch(endpoint, {
						method: "POST",
						body: formData,
					});

					if (response.ok) {
						return {
							nombre: fileName,
							descripcion: archivo.descripcion,
						};
					} else {
						throw new Error(
							"Error al guardar la información del archivo en la base de datos"
						);
					}
				} else {
					throw new Error("No se ha seleccionado ningún archivo.");
				}
			});

			const fileData = await Promise.all(promises);
			return fileData;
		} catch (error) {
			console.error("Error al subir los archivos:", error.message);
			return null;
		}
	};

	const deleteFilesSavedHandler = async (archivo) => {
		const confirmed = await Swal.fire({
			title: "¿Estás seguro?",
			text: "¿Está seguro que desea eliminar este archivo?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Sí, eliminar",
			cancelButtonText: "Cancelar",
		});

		if (confirmed.isConfirmed) {
			try {
				const response = await fetch(
					`${API_ENDPOINT}/deleteimage/${archivo.archivo}`,
					{
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
							Authorization: localStorage.getItem("token"),
						},
						body: JSON.stringify({
							filename: data.archivo,
						}),
					}
				);

				if (response.ok) {
					const endpoint = `${API_ENDPOINT}/archivos-seguimientos/`;
					const direction = archivo.id;
					const method = "DELETE";
					const body = archivo;
					const headers = {
						"Content-Type": "application/json",
						Authorization: localStorage.getItem("token"),
					};

					const responseFetch = await apiConnection(
						endpoint,
						direction,
						method,
						body,
						headers
					);

					Swal.fire({
						icon: "success",
						title: "Operación exitosa!",
						text: "Archivo eliminado exitosamente.",
						showConfirmButton: false,
						timer: 2500,
					});

					setTimeout(() => {}, 2500);
					await fetchArchivos();
				}
			} catch (error) {
				console.error("Error deleting image:", error);
			}
		}
	};

	const normalizeFileName = (originalName) => {
		// Reemplazar caracteres acentuados y espacios
		const normalized = originalName
			.toLowerCase()
			.replace(/[áÁ]/g, "a")
			.replace(/[éÉ]/g, "e")
			.replace(/[íÍ]/g, "i")
			.replace(/[óÓ]/g, "o")
			.replace(/[úÚ]/g, "u")
			.replace(/[ñÑ]/g, "n")
			.replace(/ /g, "_");

		return normalized;
	};
	// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ ARCHIVOS ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

	return (
		<>
			<div
				className={`modal fade ${
					showModalSeguimiento ? "show" : ""
				} modal-seguimientos`}
				tabIndex="-1"
				style={{ display: showModalSeguimiento ? "block" : "none" }}
				id="staticBackdrop"
				data-bs-target="#staticBackdrop"
				data-bs-backdrop="static"
				data-bs-keyboard="false"
				aria-labelledby="staticBackdropLabel"
				aria-hidden={!showModalSeguimiento}>
				<div className="modal-dialog modal-xl modal-dialog-centered">
					<div className="modal-content bg-dark">
						<div
							className="modal-header p-2 px-3"
							style={{ background: "#efb68b" }}>
							<h5 className="modal-title text-white">
								{modalSeguimientoMode === "agregar"
									? "Agregar "
									: "Modificar "}
								seguimiento
							</h5>
							<button
								type="button"
								className="btn-close btn-close-white"
								aria-label="Close"
								onClick={() => {
									reset(initialState);
									setSelectedFiles([]);
									setArchivosSeguimiento([]);
									setData([]);
									closeModalSeguimiento(true);
								}}></button>
						</div>
						<div className="container-fluid mt-3">
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className="row mb-3">
									<div className="col-6">
										<label
											htmlFor="fecha"
											className="form-label">
											Fecha
											<span className="text-danger">
												*
											</span>
										</label>
										<input
											type="date"
											className="form-control"
											id="fecha"
											{...register("fecha", {
												required: true,
											})}
										/>
										{errors.fecha && (
											<span className="text-danger">
												El campo es requerido
											</span>
										)}
									</div>
									<div className="col-6">
										<label
											htmlFor="proximoSeguimiento"
											className="form-label">
											Próximo seguimiento
										</label>
										<input
											type="date"
											className="form-control"
											id="proximoSeguimiento"
											{...register("proximo_seguimiento")}
										/>
									</div>
								</div>
								<div className="mb-3">
									<label
										htmlFor="respuesta"
										className="form-label">
										Respuesta
										<span className="text-danger">*</span>
									</label>
									<textarea
										className="form-control"
										style={{ resize: "none" }}
										id="respuesta"
										{...register("respuesta", {
											required: true,
										})}
									/>
									{errors.respuesta && (
										<span className="text-danger">
											El campo es requerido
										</span>
									)}
								</div>
								{archivosSeguimiento &&
								archivosSeguimiento.length > 0 ? (
									<div className="card">
										<div className="card-header bg-warning opacity-75 text-bold py-0 d-flex">
											<label className="btn-sm position-relative m-0">
												Archivos almacenados
												{archivosSeguimiento.length >
													0 && (
													<span className="position-absolute ms-2 top-50 start-100 translate-middle badge rounded-pill bg-danger">
														{
															archivosSeguimiento.length
														}
													</span>
												)}
											</label>
											<button
												type="button"
												className="btn btn-warning btn-sm ml-auto"
												data-card-widget="collapse"
												title="Collapse">
												<i className="fas fa-minus"></i>
											</button>
										</div>
										<div className="card-body bg-secondary">
											<div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3 mb-3">
												{archivosSeguimiento.map(
													(archivo, index) => {
														const nombreArchivo =
															archivo.archivo;
														const getFileExtension =
															(nombreArchivo) => {
																return nombreArchivo
																	.split(".")
																	.pop()
																	.toLowerCase();
															};
														const fileExtension =
															getFileExtension(
																nombreArchivo
															);
														const fileIcon =
															fileExtension !==
															"pdf"
																? `/uploads/${nombreArchivo}`
														// : "../../../assets/img/icon_pdf_512.png";
																: `/assets/img/icon_pdf_512.png`;
														return (
															<div
																className="col-12 col-md-6 col-lg-4 col-xl-4"
																key={
																	archivo.id
																}>
																<div className="card shadow h-100">
																	<div className="row g-0 h-100">
																		<div className="col-md-2 p-1 d-flex flex-column justify-content-center align-items-center">
																			<img
																				style={{
																					borderRadius:
																						".25rem",
																					maxWidth:
																						"3.75rem",
																					maxHeight:
																						"3.75rem",
																					objectFit:
																						"cover",
																				}}
																				className="img-fluid rounded-start"
																				src={
																					fileIcon
																				}
																				alt={
																					fileExtension ===
																					"pdf"
																						? "PDF Icon"
																						: "IMG Preview"
																				}
																			/>
																			<div className="d-flex justify-content-around align-items-center mt-2 w-100">
																				<span
																					className="badge bg-danger d-flex justify-content-center align-items-center mb-2"
																					style={{
																						width: "1.35rem",
																						height: "1.35rem",
																						cursor: "pointer",
																					}}
																					onClick={() =>
																						deleteFilesSavedHandler(
																							archivo
																						)
																					}>
																					<i className="fa-solid fa-trash text-white"></i>
																				</span>
																				<span
																					className="badge bg-info d-flex justify-content-center align-items-center mb-2"
																					style={{
																						width: "1.35rem",
																						height: "1.35rem",
																						cursor: "pointer",
																					}}
																					onClick={() =>
																						window.open(
																							`/uploads/${nombreArchivo}`,
																							"_blank"
																						)
																					}>
																					<i className="fa-solid fa-eye text-white"></i>
																				</span>
																			</div>
																		</div>
																		<div className="col-md-10 d-flex flex-column">
																			<div className="card-body p-2 flex-grow-1">
																				<div className="d-flex justify-content-between align-items-center">
																					<h6
																						className="card-title"
																						style={{
																							overflow:
																								"hidden",
																							textOverflow:
																								"ellipsis",
																							whiteSpace:
																								"nowrap",
																							fontSize:
																								"smaller",
																						}}
																						title={
																							archivo.archivo
																						}>
																						{archivo.archivo.substring(
																							49
																						)}
																					</h6>
																				</div>
																				<span
																					className="form-control"
																					id={`archivo.descripcion${index}`}
																					style={{
																						minHeight:
																							"3.5rem",
																						maxHeight:
																							"3.5rem",
																						resize: "none",
																						fontSize:
																							"smaller",
																					}}>
																					{
																						archivo.archivo_descripcion
																					}
																				</span>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														);
													}
												)}
											</div>
										</div>
									</div>
								) : null}
								<div className="card">
									<div className="card-header bg-primary opacity-75 text-bold pt-1 pb-0 d-flex ">
										<label
											className="btn-sm position-relative m-0"
											style={{ cursor: "pointer" }}>
											<i className="fa-solid fa-square-plus fa-xl"></i>
											{"  "}
											Agregar archivos
											{selectedFiles.length > 0 && (
												<span className="position-absolute ms-2 top-50 start-100 translate-middle badge rounded-pill bg-danger">
													{selectedFiles.length}
												</span>
											)}
											<input
												type="file"
												name="files"
												onChange={onSelectFile}
												multiple
												accept="image/png , image/jpeg, image/webp, application/pdf"
												style={{
													display: "none",
												}}
											/>
										</label>
										<button
											type="button"
											className="btn btn-primary opacity-75 btn-sm ml-auto"
											data-card-widget="collapse"
											title="Collapse">
											<i className="fas fa-minus"></i>
										</button>
									</div>
									<div className="card-body bg-secondary py-0">
										{selectedFiles &&
											selectedFiles.length > 0 && (
												<div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3 mt-0 mb-3">
													{selectedFiles &&
														selectedFiles.map(
															(file, index) => {
																const fileIcon =
																	file.type.includes(
																		"pdf"
																	)
																		? "../../../assets/img/icon_pdf_512.png"
																		: "../../../assets/img/icon_img_512.png";
																return (
																	<div
																		className="col-12 col-md-6 col-lg-4 col-xl-4"
																		key={
																			file.url
																		}>
																		<div className="card shadow h-100">
																			<div className="row g-0 h-100">
																				<div className="col-md-2 p-1 justify-content-center align-items-center">
																					<img
																						style={{
																							borderRadius:
																								".25rem",
																							maxWidth:
																								"3rem",
																							maxHeight:
																								"3rem",
																							objectFit:
																								"cover",
																						}}
																						className="img-fluid rounded-start"
																						src={
																							fileIcon
																						}
																						alt={
																							file.type.includes(
																								"pdf"
																							)
																								? "PDF Icon"
																								: "IMG Icon"
																						}
																					/>
																				</div>
																				<div className="col-md-10 d-flex flex-column">
																					<div className="card-body p-2 flex-grow-1">
																						<div className="d-flex justify-content-between align-items-center">
																							<h6
																								className="card-title"
																								style={{
																									overflow:
																										"hidden",
																									textOverflow:
																										"ellipsis",
																									whiteSpace:
																										"nowrap",
																									fontSize:
																										"smaller",
																								}}
																								title={
																									file.name
																								}>
																								{
																									file.name
																								}
																							</h6>

																							<span
																								className="badge rounded-circle bg-danger d-flex justify-content-center align-items-center mb-2"
																								style={{
																									width: "1.65rem",
																									height: "1.65rem",
																									cursor: "pointer",
																								}}
																								onClick={() =>
																									deleteFilesSelectedHandler(
																										file.url
																									)
																								}>
																								<i className="fa-solid fa-trash text-white fa-lg"></i>
																							</span>
																						</div>
																						<textarea
																							className="form-control"
																							id={`descripcion${index}`}
																							{...register(
																								`descripcion${index}`
																							)}
																							value={
																								file.descripcion
																							}
																							onChange={(
																								e
																							) =>
																								updateDescripcion(
																									index,
																									e
																										.target
																										.value
																								)
																							}
																							style={{
																								minHeight:
																									"3.5rem",
																								maxHeight:
																									"3.5rem",
																								resize: "none",
																								fontSize:
																									"smaller",
																							}}
																							placeholder="Descripción"></textarea>
																					</div>
																				</div>
																			</div>
																		</div>
																	</div>
																);
															}
														)}
												</div>
											)}
									</div>
								</div>
								<div className="modal-footer text-end">
									<button
										type="submit"
										className="btn btn-primary">
										Guardar
									</button>
									<button
										type="button"
										className="btn btn-secondary ms-2"
										onClick={() => {
											reset(initialState);
											setSelectedFiles([]);
											setArchivosSeguimiento([]);
											setData([]);
											closeModalSeguimiento(true);
										}}>
										Cancelar
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default DenunciasSeguimientosModal;
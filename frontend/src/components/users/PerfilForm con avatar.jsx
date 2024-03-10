import React, { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import { useNavigate } from "react-router-dom";

const Perfil = () => {
	const initialState = {
		email: "",
		password: "",
		nombre: "",
		apellido: "",
		rol: "",
		avatar: "",
		activo: false,
	};

	const navigate = useNavigate();

	// const [avatarPreview, setAvatarPreview] = useState("");
	// const [file, setFile] = useState();

	const [inputValues, setInputValues] = useState(initialState);

	const [user, setUser] = useState(null); //

	// const fileInputRef = useRef(null); // Referencia al input de tipo file

	useEffect(() => {
		// Función para cargar los datos del usuario desde el localStorage
		const loadUserFromLocalStorage = () => {
			const userString = localStorage.getItem("user");
			if (userString) {
				const user = JSON.parse(userString);
				setInputValues(user);
				setUser(user);
			}
		};

		// Llamar a la función para cargar los datos del usuario
		loadUserFromLocalStorage();
	}, []);

	// FUNCION PARA CONTROLAR EL CHECKBOX
	const handleSwitchChange = (e) => {
		const { name, checked } = e.target;
		setInputValues({
			...inputValues,
			[name]: checked,
		});
	};

	// const clearAvatarData = () => {
	// 	setAvatarPreview("");
	// 	setUser((prevUser) => ({
	// 		...prevUser,
	// 		avatar: "",
	// 	}));
	// 	setInputValues((prevInputValues) => ({
	// 		...prevInputValues,
	// 		avatar: "",
	// 	}));
	// 	localStorage.setItem("user", JSON.stringify({ ...user, avatar: "" }));
	// 	setFile(null);
	// 	if (fileInputRef.current) {
	// 		fileInputRef.current.value = "";
	// 	}
	// };

	// // FUNCION PARA MOSTRAR LA IMAGEN
	// const handleAvatarChange = (e) => {
	// 	const user = JSON.parse(localStorage.getItem("user"));
	// 	const selectedFile = e.target.files[0];

	// 	// Si no se selecciona ningún archivo, borramos la vista previa
	// 	if (!selectedFile) {
	// 		setAvatarPreview("");
	// 		return;
	// 	}

	// 	// Verificar si el archivo es una imagen
	// 	const acceptedImageTypes = ["image/jpeg", "image/png", "image/gif"]; // Agrega los tipos MIME de las imágenes permitidas
	// 	if (!acceptedImageTypes.includes(selectedFile.type)) {
	// 		Swal.fire({
	// 			icon: "error",
	// 			title: "Tipo de archivo incorrecto",
	// 			text: "Por favor, selecciona un archivo de imagen válido (JPEG, PNG o GIF).",
	// 		});
	// 		return;
	// 	}

	// 	// Verificar el tamaño del archivo (1MB = 1048576 bytes)
	// 	const maxSize = 1048576; // Tamaño máximo permitido en bytes
	// 	if (selectedFile.size > maxSize) {
	// 		Swal.fire({
	// 			icon: "error",
	// 			title: "Tamaño de archivo excedido",
	// 			text: "El tamaño del archivo seleccionado supera el límite de 1MB.",
	// 		});
	// 		return;
	// 	}

	// 	inputValues.avatar =
	// 		"img_avatar_" + user.id + "." + selectedFile.name.split(".").pop();

	// 	setFile(selectedFile);

	// 	const file = e.target.files[0];

	// 	const reader = new FileReader();
	// 	reader.onloadend = () => {
	// 		setAvatarPreview(reader.result);
	// 	};
	// 	reader.readAsDataURL(selectedFile);
	// };

	// const handleRemoveAvatar = async () => {
	// 	try {
	// 		const result = await Swal.fire({
	// 			title: "¿Estás seguro?",
	// 			text: "Esta acción no podrá deshacerse",
	// 			icon: "warning",
	// 			showConfirmButton: true,
	// 			confirmButtonColor: "#3085d6",
	// 			cancelButtonColor: "#d33",
	// 			confirmButtonText: "Sí, eliminar",
	// 			showCancelButton: true,
	// 			cancelButtonText: "Cancelar",
	// 		});

	// 		if (result.isConfirmed) {
	// 			if (user.avatar) {
	// 				try {
	// 					// Verificar la existencia del archivo antes de intentar eliminarlo
	// 					const checkResponse = await fetch(
	// 						`http://localhost:5000/api/checkimage/${user.avatar}`
	// 					);
	// 					if (checkResponse.ok) {
	// 						const checkData = await checkResponse.json();
	// 						if (checkData.exists) {
	// 							// Si el archivo existe, proceder con la eliminación
	// 							const deleteResponse = await fetch(
	// 								`http://localhost:5000/api/deleteimage/${user.avatar}`,
	// 								{
	// 									method: "DELETE",
	// 									headers: {
	// 										"Content-Type": "application/json",
	// 										Authorization:
	// 											localStorage.getItem("token"),
	// 									},
	// 									body: JSON.stringify({
	// 										filename: user.avatar,
	// 									}),
	// 								}
	// 							);
	// 							if (deleteResponse.ok) {
	// 								// Si la eliminación fue exitosa, actualizar la interfaz de usuario
	// 								console.log(
	// 									"Archivo eliminado exitosamente"
	// 								);
	// 								// Guardar en la base de datos el campo imagen vacío
	// 								const endpoint =
	// 									"http://127.0.0.1:5000/api/usuarios/";
	// 								const direction = `${user.id}`;
	// 								const method = "PATCH";
	// 								const body = {
	// 									avatar: "",
	// 								};

	// 								const headers = {
	// 									"Content-Type": "application/json",
	// 									Authorization:
	// 										localStorage.getItem("token"),
	// 								};

	// 								const patchResponse = await apiConnection(
	// 									endpoint,
	// 									direction,
	// 									method,
	// 									body,
	// 									headers
	// 								);
	// 								if (patchResponse) {
	// 									// Actualizar el estado local y la vista previa del avatar
	// 									clearAvatarData();
	// 								} else {
	// 									console.error(
	// 										"Error al guardar en la base de datos"
	// 									);
	// 								}
	// 							} else {
	// 								console.error(
	// 									"Error al eliminar el archivo:",
	// 									deleteResponse.statusText
	// 								);
	// 							}
	// 						} else {
	// 							console.warn(
	// 								"El archivo no existe en el servidor"
	// 							);
	// 						}
	// 					} else {
	// 						console.warn(
	// 							"Error en la solicitud HTTP:",
	// 							checkResponse.statusText,
	// 							". No se pudo verificar la existencia del archivo"
	// 						);
	// 					}
	// 				} catch (error) {
	// 					console.error("Error en la solicitud HTTP:", error);
	// 				}
	// 			} else {
	// 				console.warn("El usuario no tiene un avatar asociado");
	// 				// Manejar el caso en el que el usuario no tiene un avatar asociado
	// 			}
	// 			// Actualizar el estado local y la vista previa del avatar
	// 			clearAvatarData();
	// 		}
	// 	} catch (error) {
	// 		console.error("Error al eliminar el archivo:", error);
	// 	}
	// };

	// // FUNCION PARA SUBIR LA IMAGEN
	// const handleUpload = async () => {
	// 	if (!file) {
	// 		return false;
	// 	}

	// 	const user = JSON.parse(localStorage.getItem("user"));

	// 	const formFile = new FormData();
	// 	formFile.append("file", file);

	// 	const fileExtension = file.name.split(".").pop();

	// 	const fileName = `img_avatar_${user.id}.${fileExtension}`;

	// 	formFile.set("file", file, fileName);

	// 	try {
	// 		const response = await fetch(
	// 			"http://localhost:5000/api/loadimage/",
	// 			{
	// 				method: "POST",
	// 				body: formFile,
	// 			}
	// 		);

	// 		if (response.ok) {
	// 			Swal.fire({
	// 				icon: "success",
	// 				title: "Imagen subida correctamente",
	// 				text: "La imagen se ha subido exitosamente a la base de datos",
	// 				timer: 2500,
	// 				showConfirmButton: false,
	// 			});
	// 			return fileName; // Devolver el nombre de archivo
	// 		} else {
	// 			Swal.fire({
	// 				icon: "error",
	// 				title: "Error al subir la imagen",
	// 				text: "Hubo un error al subir la imagen a la base de datos",
	// 				timer: 2500,
	// 				showConfirmButton: false,
	// 			});
	// 			return false; // Devolver falso si hubo un error al subir la imagen
	// 		}
	// 	} catch (error) {
	// 		console.error("Error de red:", error);
	// 		return false; // Devolver falso si hubo un error de red
	// 	}
	// };

	const handleCancel = () => {
		setInputValues({
			nombre: "",
			apellido: "",
			rol: "",
			email: "",
			activo: false,
			avatar: "",
		});
		navigate("/");
	};

	const handleSave = async () => {
		const user = JSON.parse(localStorage.getItem("user"));
		const endpoint = "http://localhost:5000/api/usuarios/";
		const direction = user.id;
		const method = "PATCH";
		const body = inputValues;

		const headers = {
			"Content-Type": "application/json",
			Authorization: localStorage.getItem("token"),
		};

		try {
			const response = await apiConnection(
				endpoint,
				direction,
				method,
				body,
				headers
			);

			if (response) {
				localStorage.setItem("user", JSON.stringify(body));
				setUser(body);

				// // Subir la imagen
				// if (file) {
				// 	await handleUpload();
				// }

				// Swal.fire({
				// 	icon: "success",
				// 	title: "Operación exitosa!",
				// 	text: "Registro guardado exitosamente.",
				// 	showConfirmButton: false,
				// 	timer: 2500,
				// });
				// setTimeout(() => {
				// 	navigate("/");
				// }, 2500);
			}
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Error al guardar el registro",
				text: "Ocurrió un error al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.",
				showConfirmButton: false,
				timer: 2500,
			});
		}
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		const newValue = type === "checkbox" ? checked : value;
		setInputValues((prevState) => ({
			...prevState,
			[name]: newValue,
		}));
	};

	// useEffect(() => {
	// 	if (user) {
	// 		if (user.id && user.avatar !== "") {
	// 			setAvatarPreview(`./../../public/uploads/${user.avatar}`);
	// 		}
	// 	}
	// }, [user]);

	return (
		<>
			<div className="content-wrapper">
				<div className="content-header">
					<div className="container-fluid">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1 className="m-0">Perfil</h1>
							</div>
						</div>
					</div>
				</div>
				<section className="container justify-content-center w-50">
					<div className="row mb-3">
						<div className="col-6">
							<label htmlFor="nombre">Nombre</label>
							<input
								type="text"
								className="form-control"
								id="nombre"
								name="nombre"
								value={inputValues.nombre}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="col-6">
							<label htmlFor="apellido">Apellido</label>
							<input
								type="text"
								className="form-control"
								id="apellido"
								name="apellido"
								value={inputValues.apellido}
								onChange={handleChange}
								required
							/>
						</div>
					</div>
					<div className="row mb-3">
						<div className="col-3">
							<label htmlFor="rol">Rol</label>
							<input
								type="text"
								className="form-control"
								id="rol"
								name="rol"
								value={inputValues.rol}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="col-7">
							<label htmlFor="email">Email</label>
							<input
								type="email"
								className="form-control"
								id="email"
								name="email"
								value={inputValues.email}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="col-2 text-center">
							<label htmlFor="activo" className="form-label mb-0">
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
									onChange={handleSwitchChange}
								/>
							</div>
						</div>
					</div>
					{/* Imagen */}
					{/* <div className="row mb-3 align-items-center">
						<label className="form-label">
							Avatar
						</label>
						<div className="col-auto p-1 m-0">
							{avatarPreview && (
								<>
									<div className="d-flex justify-content-center align-items-center">
										<img
											name="vista_previa"
											src={avatarPreview}
											alt="Vista previa"
											className="img-fluid rounded mx-auto"
											style={{
												maxHeight: "5.0rem",
											}}
										/>
									</div>
								</>
							)}
						</div>
						<div
							className={
								avatarPreview ? "col-auto mx-3" : "col-auto p-0"
							}>
							{avatarPreview && (
								<button
									type="button"
									className="btn btn-danger ms-md-auto"
									onClick={handleRemoveAvatar}>
									<i className="fa-solid fa-ban me-2"></i>
									Eliminar Imagen
								</button>
							)}
							{!avatarPreview && (
								<label
									htmlFor="fileInput"
									className="btn btn-outline-info form-control m-0">
									<i className="fa-solid fa-upload"></i> Subir
									imagen...
									<input
										className="mb-0"
										type="file"
										id="fileInput"
										ref={fileInputRef}
										name="file"
										style={{
											display: "none",
										}}
										onChange={handleAvatarChange}
										accept="image/*"
									/>
								</label>
							)}
						</div>
						<div className="col">
							<input
								type="hidden"
								value={inputValues.avatar || ""}
								name="avatar"
							/>
						</div>
					</div> */}
					{/* Botones */}
					<div className="row mb-3 justify-content-end">
						<div className="col-auto">
							<button
								type="button"
								className="btn btn-secondary me-2"
								onClick={handleCancel}>
								<i className="fas fa-times me-1"></i> Cancelar
							</button>
						</div>
						<div className="col-auto">
							<button
								type="button"
								className="btn btn-primary"
								onClick={handleSave}>
								<i className="fas fa-save me-1"></i> Guardar
							</button>
						</div>
					</div>
				</section>
			</div>
		</>
	);
};

export default Perfil;

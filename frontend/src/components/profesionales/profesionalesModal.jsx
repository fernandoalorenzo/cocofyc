import React, { useState } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";

const ProfesionalesModal = ({
	showModal,
	closeModal,
	data,
	updateParentData,
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
	const [errorMessage, setErrorMessage] = useState("");

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
		let value = event.target.value.replace(/\D/g, "");
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

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		// Aquí puedes manejar el archivo como desees, por ejemplo, mostrar una vista previa o almacenarlo en el estado
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Remover el guion del CUIT y los puntos del DNI
		const cuitSinGuion = formData.cuit.replace(/-/g, "");
		const dniSinPuntos = formData.dni.replace(/\./g, "");

		// Crear una copia del formData con los valores transformados
		const formDataToSend = {
			...formData,
			cuit: cuitSinGuion,
			dni: dniSinPuntos,
		};

		try {
			const endpoint = "http://127.0.0.1:5000/profesionales/";
			const direction = data ? `/${data.id}` : ""; // Si hay data, es una actualización, de lo contrario, es una creación
			const method = data ? "PUT" : "POST"; // Método dependiendo de si es una actualización o una creación
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
			updateParentData(formDataToSend);

			if (response.data) {
				// MOSTRAR SWEET ALERT
				Swal.fire({
					icon: "success",
					title: "¡Registro guardado exitosamente!",
					showConfirmButton: false,
					timer: 2500, // Cierra automáticamente después de 2.5 segundos
				});

				// CERRAR MODAL
				setTimeout(() => {
					closeModalAndResetData();
				}, 2500);

				console.log("Operación exitosa");
				console.log("Datos del profesional:", response.data);
			} else {
				console.error("Error en la operación:", response.error);
			}
		} catch (error) {
			if (error.message.includes("duplicado")) {
				setErrorMessage(
					"El valor que está intentando guardar ya existe en la base de datos."
				);
			} else {
				setErrorMessage(
					"Ocurrió un error al procesar su solicitud. Por favor, inténtelo de nuevo más tarde."
				);
			}

			console.error("Errorrrrr:", error.message);
			// Verificar si el error es debido a un DNI duplicado
			if (error.response && error.response.status === 409) {
				Swal.fire({
					icon: "error",
					title: "Error al guardar el registro",
					text: "El DNI ingresado ya existe en la base de datos.",
					confirmButtonText: "Aceptar",
				});
			} else {
				Swal.fire({
					icon: "error",
					title: "Error al guardar el registro",
					text: "Ocurrió un error al intentar guardar el registro. Por favor, inténtelo de nuevo más tarde.",
					confirmButtonText: "Aceptar",
				});
			}
		}
	};

	const closeModalAndResetData = () => {
		closeModal();
		setFormData(initialState);
	};

	return (
		<div
			className={`modal ${showModal ? "show" : ""}`}
			tabIndex="-1"
			style={{ display: showModal ? "block" : "none" }}
			id="staticBackdrop"
			data-bs-target="#staticBackdrop">
			<div className="modal-dialog modal-xl">
				<div className="modal-content">
					<div className="modal-header bg-primary">
						<h5 className="modal-title">
							{data ? "Editar Profesional" : "Nuevo Profesional"}
						</h5>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={closeModalAndResetData}></button>
					</div>
					<form onSubmit={handleSubmit}>
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
											value={formData.nombre}
											onChange={handleChangeNombre}
											required
										/>
									</div>
									{/* DNI */}
									<div className="col-2 mb-3">
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
											value={formData.dni}
											onChange={handleChangeDni}
											required
										/>
									</div>
									{/* CUIT */}
									<div className="col-2 mb-3">
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
											value={formData.cuit}
											onChange={handleChangeCuit}
										/>
									</div>
									{/* Matrícula */}
									<div className="col-2 mb-3">
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
											value={formData.matricula}
											onChange={handleChange}
											required
										/>
									</div>
								</div>
								<div className="row">
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
											value={formData.fecha_nacimiento}
											onChange={handleChange}
										/>
									</div>
									{/* Teléfono */}
									<div className="col-2 mb-3">
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
											value={formData.telefono}
											onChange={handleChange}
										/>
									</div>
									{/* E-Mail */}
									<div className="col-3 mb-3">
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
											value={formData.email}
											onChange={handleChange}
										/>
									</div>
									{/* Activo */}
									<div className="col-2 mb-3 text-center">
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
												checked={formData.activo}
												onChange={(e) =>
													setFormData({
														...formData,
														activo: e.target
															.checked,
													})
												}
											/>
										</div>
									</div>
									{/* Estado de Matrícula */}
									<div className="col mb-3">
										<label
											htmlFor="estado_matricula_id"
											className="form-label mb-0">
											Estado de Matrícula
										</label>
										<select
											className="form-select"
											id="estado_matricula_id"
											name="estado_matricula_id"
											value={formData.estado_matricula_id}
											onChange={handleChange}>
											{/* Opciones del select */}
										</select>
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
											value={formData.domicilio}
											onChange={handleChange}
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
											value={formData.localidad}
											onChange={handleChange}
										/>
									</div>
								</div>
								<div className="row">
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
											onChange={handleFileChange}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer">
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
								{data ? "Guardar Cambios" : "Crear"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ProfesionalesModal;

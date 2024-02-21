import React, { useState } from "react";

const ProfesionalesModal = ({ showModal, closeModal, data }) => {
	const [formData, setFormData] = useState({
		nombre: "",
		dni: "",
		cuit: "",
		telefono: "",
		email: "",
		matricula: "",
		domicilio: "",
		localidad: "",
		fecha_nacimiento: "",
		imagen: null, // Puedes inicializar este campo según tus necesidades
		activo: false,
		estado_matricula_id: "", // Asegúrate de inicializarlo con el valor adecuado
	});

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
		try {
			const endpoint = "http://127.0.0.1:5000/profesionales/";
			const direction = data ? `/${data.id}` : ""; // Si hay data, es una actualización, de lo contrario, es una creación
			const method = data ? "PUT" : "POST"; // Método dependiendo de si es una actualización o una creación
			const body = JSON.stringify(formData);
			const headers = {
				"Content-Type": "application/json",
				// Authorization: localStorage.getItem("token"),
			};

			const response = await fetch(endpoint + direction, {
				method,
				headers,
				body,
			});

			if (response.ok) {
				// Aquí puedes manejar el éxito de la operación, como cerrar el modal o actualizar la lista de profesionales
				console.log("Operación exitosa");
			} else {
				console.error("Error en la operación:", response.statusText);
			}
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	return (
		<div
			className={`modal ${showModal ? "show" : ""}`}
			tabIndex="-1"
			style={{ display: showModal ? "block" : "none" }}>
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header bg-primary">
						<h5 className="modal-title">
							{data ? "Editar Profesional" : "Nuevo Profesional"}
						</h5>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={closeModal}></button>
					</div>
					<form onSubmit={handleSubmit}>
						<div className="modal-body">
							<div className="row">
								{/* Nombre Completo */}
								<div className="col mb-3">
									<label
										htmlFor="nombre"
										className="form-label">
										Nombre Completo
									</label>
									<input
										type="text"
										className="form-control"
										id="nombre"
										name="nombre"
										value={formData.nombre}
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className="row">
								{/* DNI */}
								<div className="col mb-3">
									<label htmlFor="dni" className="form-label">
										DNI
									</label>
									<input
										type="text"
										className="form-control"
										id="dni"
										name="dni"
										value={formData.dni}
										onChange={handleChange}
									/>
								</div>
								{/* CUIT */}
								<div className="col mb-3">
									<label
										htmlFor="cuit"
										className="form-label">
										CUIT
									</label>
									<input
										type="text"
										className="form-control"
										id="cuit"
										name="cuit"
										value={formData.cuit}
										onChange={handleChange}
									/>
								</div>
								{/* Matrícula */}
								<div className="col mb-3">
									<label
										htmlFor="matricula"
										className="form-label">
										Matrícula
									</label>
									<input
										type="text"
										className="form-control"
										id="matricula"
										name="matricula"
										value={formData.matricula}
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className="row">
								{/* Teléfono */}
								<div className="col mb-3">
									<label
										htmlFor="telefono"
										className="form-label">
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
								<div className="col mb-3">
									<label
										htmlFor="email"
										className="form-label">
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
							</div>
							<div className="row">
								{/* Domicilio */}
								<div className="col mb-3">
									<label
										htmlFor="domicilio"
										className="form-label">
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
										className="form-label">
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
								{/* Fecha de Nacimiento */}
								<div className="col mb-3">
									<label
										htmlFor="fecha_nacimiento"
										className="form-label">
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

								{/* Activo */}
								<div className="col mb-3 form-check">
									<input
										type="checkbox"
										className="form-check-input"
										id="activo"
										name="activo"
										checked={formData.activo}
										onChange={handleChange}
									/>
									<label
										className="form-check-label"
										htmlFor="activo">
										Activo
									</label>
								</div>
								{/* Estado de Matrícula */}
								<div className="col mb-3">
									<label
										htmlFor="estado_matricula_id"
										className="form-label">
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
								<div className="row">
									{/* Imagen */}
									<div className="col mb-3">
										<label
											htmlFor="imagen"
											className="form-label">
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
								className="btn btn-secondary"
								onClick={closeModal}>
								Cancelar
							</button>
							<button type="submit" className="btn btn-primary">
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

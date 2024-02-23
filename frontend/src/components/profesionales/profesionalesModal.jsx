import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";

const ProfesionalesModal = ({
	showModal,
	setShowModal,
	profesional,
	onClose,
	modalMode,
}) => {
	const [estadosMatriculas, setEstadosMatriculas] = useState([]);
	const [editProfesionalData, setEditProfesionalData] = useState(null); // Datos del registro a editar

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

	const closeModalAndResetData = () => {
		setShowModal(false);
		onClose();
		// Aquí puedes agregar cualquier lógica adicional para restablecer los datos del formulario si es necesario
	};

	if (!profesional) {
		return <div>Loading...</div>;
	}

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
					{/* <form onSubmit={handleSubmit}> */}
					<form>
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
											// defaultValue={profesional.nombre}
											// readOnly
											value={
												modalMode === "editar"
													? nombre
													: profesional.nombre
											}
											readOnly={modalMode === "mostrar"}
											onChange={(e) =>
												setNombre(e.target.value)
											}
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
											defaultValue={profesional.dni}
											readOnly
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
											defaultValue={profesional.cuit}
											readOnly
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
											defaultValue={profesional.matricula}
											readOnly
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
											defaultValue={
												profesional.fecha_nacimiento
											}
											readOnly
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
											defaultValue={profesional.telefono}
											readOnly
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
											defaultValue={profesional.email}
											readOnly
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
												checked={profesional.activo}
												readOnly

												// checked={formData.activo}
												// onChange={(e) =>
												// 	setFormData({
												// 		...formData,
												// 		activo: e.target
												// 			.checked,
												// 	})
												// }
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
										{/* <select
											className="form-select"
											id="estado_matricula_id"
											name="estado_matricula_id"
											defaultValue={profesional.cuit}
											readOnly
											// onChange={handleChange}
										> */}
										{/* {!data && ( */}

										{/* <option value="">
												Seleccionar
											</option> */}

										{/* )} */}

										{/* {estadosMatriculas.map((estado) => (
												<option
													key={estado.id}
													value={estado.id}>
													{estado.estado}
												</option>
											))}
										</select> */}
										<select
											className="form-select"
											id="estado_matricula_id"
											name="estado_matricula_id"
											defaultValue={
												profesional.estado_matricula_id
											} // Usar defaultValue en lugar de value
											readOnly // Asegura que el campo sea de solo lectura
										>
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
											// onChange={handleChange}
											defaultValue={profesional.domicilio}
											readOnly
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
											// onChange={handleChange}
											defaultValue={profesional.localidad}
											readOnly
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
											// defaultValue={profesional.imagen}
											// readOnly
											// onChange={handleFileChange}
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
								className="btn btn-primary col-md-2"
								// LO MUESTRA SI EDITA O NUEVO REGISTRO
								style={{
									display:
										modalMode != "mostrar"
											? "block"
											: "none",
								}}>
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

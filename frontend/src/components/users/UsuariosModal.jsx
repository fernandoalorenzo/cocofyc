import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";

const UsuariosModal = ({
	showModal,
	closeModal,
	data,
	modalMode,
	fetchUsuarios,
}) => {
	const initialState = {
		nombre: "",
		apellido: "",
		email: "",
		password: "",
		administrador: false,
		activo: false,
		// rol: "",
	};

	const [formData, setFormData] = useState(initialState);
	const [validationErrors, setValidationErrors] = useState({});

	// const [roles, setRoles] = useState([]);
	// const [selectedRolId, setSelectedRolId] = useState("");

	// DEFINE EL TITULO DEL MODAL
	let modalTitle = "";
	if (modalMode === "mostrar") {
		modalTitle = "Mostrar Usuario";
	} else if (modalMode === "editar") {
		modalTitle = "Editar Usuario";
	} else if (modalMode === "agregar") {
		modalTitle = "Agregar Nuevo Usuario";
	}

	// FUNCION PARA CARGAR LOS DATOS DEL USUARIO A EDITAR
	useEffect(() => {
		if (modalMode === "agregar") {
			setFormData(initialState);
			// setSelectedRolId("");
		} else if (data) {
			setFormData(data);
			// setSelectedRolId(data.rol);
		} else {
			setFormData(initialState);
		}
	}, [modalMode, data]);

	// useEffect(() => {
	// 	fetchRoles();
	// }, []);

	// FUNCION PARA ACTUALIZAR LOS DATOS
	const handleFormSubmit = async (e) => {
		// if (!isRolSelected()) {
		// 	Swal.fire({
		// 		icon: "error",
		// 		title: "Error al guardar el registro",
		// 		text: "Por favor, selecciona un rol antes de guardar.",
		// 		showConfirmButton: true,
		// 	});
		// 	return;
		// }

		// VALIDAR CAMPOS OBLIGATORIOS

		console.log(formData);
		
		if (!formData.nombre || !formData.apellido || !formData.email) {
			Swal.fire({
				icon: "error",
				title: "Error al guardar el registro",
				text: "Por favor, completa todos los campos obligatorios.",
				showConfirmButton: true,
			});

			const errors = {};
			if (!formData.nombre) {
				errors.nombre = "El nombre es requerido";
			}
			if (!formData.apellido) {
				errors.apellido = "El apellido es requerido";
			}
			if (!formData.email) {
				errors.email = "El email es requerido";
			}

			// Comprueba si hay errores
			if (Object.keys(errors).length > 0) {
				setValidationErrors(errors);
				return;
			}

			return;
		}

		e.preventDefault();

		try {
			const endpoint = "http://127.0.0.1:5000/api/usuarios/";
			const direction = data ? `${data.id}` : "";
			const method = data ? "PATCH" : "POST";
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

			if (response) {
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

	// FUNCION PARA CONTROLAR LOS INPUTS
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});

		// Limpiar errores al cambiar el valor del campo
		setValidationErrors({
			...validationErrors,
			[name]: undefined,
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

	// FUNCION PARA CONTROLAR EL SELECT
	// const handleRolChange = (e) => {
	// 	const selectedRoleId = e.target.value;
	// 	setSelectedRolId(selectedRoleId);
	// 	setFormData({
	// 		...formData,
	// 		rol: selectedRoleId,
	// 	});
	// };

	// FUNCION PARA OBTENER LOS ROLES
	// const fetchRoles = async () => {
	// 	try {
	// 		const endpoint = "http://127.0.0.1:5000/api/roles";
	// 		const direction = "";
	// 		const method = "GET";
	// 		const body = false;
	// 		const headers = {
	// 			"Content-Type": "application/json",
	// 			Authorization: localStorage.getItem("token"),
	// 		};

	// 		const response = await apiConnection(
	// 			endpoint,
	// 			direction,
	// 			method,
	// 			body,
	// 			headers
	// 		);

	// 		setRoles(response.data);
	// 	} catch (error) {
	// 		console.error("Error:", error.message);
	// 	}
	// };

	// CERRAR MODAL
	const closeModalAndResetData = () => {
		setFormData(initialState);
		closeModal();
		// setSelectedRolId("");
		fetchUsuarios();
	};

	// // FUNCION DE VALIDACION DE ROL SELECCIONADO
	// const isRolSelected = () => {
	// 	return !!selectedRolId; // Devuelve true si selectedRolId no es nulo ni vacío
	// };

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
					<div className="modal-body">
						<div className="container-fluid">
							<div className="row mb-3">
								<div className="col-6">
									<label htmlFor="nombre">Nombre</label>
									<input
										type="text"
										// className="form-control"
										className={`form-control ${
											validationErrors.nombre &&
											"is-invalid"
										}`}
										id="nombre"
										name="nombre"
										readOnly={modalMode === "mostrar"}
										value={formData.nombre}
										onChange={handleInputChange}
										required
									/>
								</div>
								<div className="col-6">
									<label htmlFor="apellido">Apellido</label>
									<input
										type="text"
										// className="form-control"
										className={`form-control ${
											validationErrors.apellido &&
											"is-invalid"
										}`}
										id="apellido"
										name="apellido"
										readOnly={modalMode === "mostrar"}
										value={formData.apellido}
										onChange={handleInputChange}
										required
									/>
								</div>
							</div>
							<div className="row mb-3">
								{/* <div className="col-3">
									<label htmlFor="rol">Rol</label>
									<select
										className="form-select"
										id="rol"
										name="rol"
										disabled={modalMode === "mostrar"}
										value={selectedRolId}
										onChange={handleRolChange}
										required>
										<option value="">
											Selecciona un rol
										</option>
										{roles.map((rol) => (
											<option key={rol.id} value={rol.id}>
												{rol.rol}
											</option>
										))}
									</select>
								</div> */}
								<div className="col-7">
									<label htmlFor="email">Email</label>
									<input
										type="email"
										// className="form-control"
										className={`form-control ${
											validationErrors.email &&
											"is-invalid"
										}`}
										id="email"
										name="email"
										readOnly={modalMode === "mostrar"}
										value={formData.email}
										onChange={handleInputChange}
										required
									/>
								</div>
								<div className="col-2 text-center">
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
											value={setFormData.activo}
											checked={formData.activo}
											onChange={
												modalMode !== "mostrar"
													? handleSwitchChange
													: () => false
											}
										/>
									</div>
								</div>
								<div className="col-2 text-center">
									<label
										htmlFor="administrador"
										className="form-label mb-0">
										Administrador
									</label>
									<div className="form-switch">
										<input
											type="checkbox"
											className="form-check-input"
											id="administrador"
											name="administrador"
											value={setFormData.administrador}
											checked={formData.administrador}
											onChange={
												modalMode !== "mostrar"
													? handleSwitchChange
													: () => false
											}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/* Botones */}
					<div
						className="modal-footer bg-dark"
						// LO MUESTRA SI ESTA EDITANDO O AGREGANDO REGISTROS
						style={{
							display: modalMode != "mostrar" ? "" : "none",
						}}>
						<div className="row mb-3 justify-content-end">
							<div className="col-auto">
								<button
									type="button"
									className="btn btn-secondary me-2"
									onClick={closeModalAndResetData}>
									<i className="fas fa-times me-1"></i>{" "}
									Cancelar
								</button>
							</div>
							<div className="col-auto">
								<button
									type="button"
									className="btn btn-primary"
									onClick={handleFormSubmit}>
									<i className="fas fa-save me-1"></i> Guardar
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default UsuariosModal;

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";

const Roles = () => {
	const [roles, setRoles] = useState([]);
	const [selectedRol, setSelectedRol] = useState(null);
	const [selectedRolValue, setSelectedRolValue] = useState("");
	const [editing, setEditing] = useState(false);
	const [inputValues, setInputValues] = useState({
		rol: "",
	});

	const fetchRoles = async () => {
		try {
			const endpoint = "http://127.0.0.1:5000/api/roles";
			const direction = "";
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

			setRoles(response.data);
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	// OBTENER LISTA DE REGISTROS
	useEffect(() => {
		fetchRoles();
	}, []);

	const handleChange = (e) => {
		const selectedId = e.target.value;
		const selectedRole = roles.find((role) => role.id === selectedId);
		setSelectedRol(selectedRole); // Actualiza el rol seleccionado
		setSelectedRolValue(selectedRol); // Actualiza el valor del rol seleccionado
	};

	const handleEdit = (rol) => {
		setSelectedRol(rol); // Establece el rol seleccionado como el objeto rol
		setSelectedRolValue(rol.rol); // Establece el valor del rol seleccionado
		setEditing(true); // Establece editing a true para habilitar la edición
	};

	const handleSave = async () => {
		try {
			// if (!selectedRol) {
			// 	console.error("No se ha seleccionado ningún rol.");
			// 	return;
			// }

			const endpoint = `http://127.0.0.1:5000/api/roles/`;
			const direction = selectedRol ? `${selectedRol.id}` : "";
			const method = selectedRol ? "PUT" : "POST";
			const body = { rol: selectedRolValue };

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
			} else {
				console.error("Error en la operación:", response.error);
			}

			// ACTUALIZA LISTA DE ROLES
			await fetchRoles();
			setSelectedRol(null);
			setEditing(false);
		} catch (error) {
			console.error("Error al guardar el rol:", error.message);
			Swal.fire({
				title: "Error",
				text: "Ha ocurrido un error al intentar guardar el rol",
				icon: "error",
			});
		}
	};

	const handleCancel = () => {
		setSelectedRol(null);
		setEditing(false);
		setInputValues({
			rol: "",
		});
	};

	const handleEliminar = async (id) => {
		const result = await Swal.fire({
			title: "¿Estás seguro?",
			text: "Esta acción no se puede deshacer",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#FF0000",
			cancelButtonColor: "9B9B9B",
			confirmButtonText: "Eliminar",
			cancelButtonText: "Cancelar",
		});

		// Si el usuario confirma la eliminación
		if (result.isConfirmed) {
			try {
				const endpoint = "http://127.0.0.1:5000/api/roles/";
				const direction = id;
				const method = "DELETE";
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

				Swal.fire({
					title: "Eliminado",
					text: "El registro ha sido eliminado correctamente",
					icon: "success",
					showConfirmButton: false,
					timer: 2500,
				});

				// Actualizar la tabla llamando a fetchRoles

				setTimeout(() => {
					fetchRoles();
				}, 2500);
			} catch (error) {
				console.error("Error al eliminar el registro:", error.message);

				Swal.fire({
					title: "Error",
					text: "Ha ocurrido un error al intentar eliminar el registro",
					icon: "error",
				});
			}
		}
	};

	return (
		<>
			<div className="content-wrapper">
				<div className="content-header">
					<div className="container-fluid">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1 className="m-0">Roles</h1>
							</div>
						</div>
					</div>
				</div>
				<div>
					<section className="content">
						<div className="container-fluid">
							<div className="row align-self-end">
								<div className="col-3">
									<label
										htmlFor="rol"
										className="form-label mb-0">
										Roles
									</label>
									{editing ? (
										<>
											<input
												id="rol"
												name="rol"
												type="text"
												className="form-control fade-in"
												value={selectedRolValue}
												onChange={(e) =>
													setSelectedRolValue(
														e.target.value
													)
												}
											/>
											<button
												className="btn btn-secondary mt-2 me-2"
												onClick={() => handleCancel()}>
												Cancelar
											</button>
											<button
												className="btn btn-primary mt-2"
												onClick={handleSave}>
												Guardar
											</button>
										</>
									) : (
										<select
											className="form-select fade-in"
											id="rol"
											name="rol"
											required
											disabled={editing}
											value={
												selectedRol
													? selectedRol.id
													: ""
											}
											onChange={handleChange}>
											<option value="">
												Seleccionar
											</option>
											{roles.map((rol) => (
												<option
													key={rol.id}
													value={rol.id}>
													{rol.rol}
												</option>
											))}
										</select>
									)}
									{selectedRol &&
										selectedRol !== "Seleccionar" &&
										!editing && (
											<>
												<button
													className="btn btn-danger mt-2 me-2"
													onClick={() =>
														handleEliminar(
															selectedRol.id
														)
													}>
													Eliminar
												</button>
												<button
													className="btn btn-primary mt-2"
													onClick={() =>
														handleEdit(selectedRol)
													}>
													Editar
												</button>
											</>
										)}
								</div>
								{!selectedRol && !editing && (
									<>
										<div className="col align-self-end">
											<button
												type="button"
												className="btn btn-primary"
												id="agregar"
												onClick={() => {
													setEditing(true);
													setSelectedRolValue("");
												}}>
												<i className="fa-regular fa-square-plus"></i>{" "}
												Agregar
											</button>
										</div>
									</>
								)}
							</div>
						</div>
					</section>
				</div>
			</div>
		</>
	);
};

export default Roles;

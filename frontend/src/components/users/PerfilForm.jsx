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
	const [inputValues, setInputValues] = useState(initialState);
	const [user, setUser] = useState(null); //
	const [roles, setRoles] = useState([]);
	const [selectedRol, setSelectedRol] = useState("");
	const [selectedRolId, setSelectedRolId] = useState("");

	
	useEffect(() => {
		// Función para cargar los datos del usuario desde el localStorage
		const loadUserFromLocalStorage = () => {
			const userString = localStorage.getItem("user");
			if (userString) {
				const user = JSON.parse(userString);
				setInputValues(user);
				setUser(user);
				setSelectedRolId(user.rol);
			}
		};

		// Llamar a la función para cargar los datos del usuario
		loadUserFromLocalStorage();
		// fetchRoles();
	}, []);

	// FUNCION PARA CONTROLAR EL CHECKBOX
	const handleSwitchChange = (e) => {
		const { name, checked } = e.target;
		setInputValues({
			...inputValues,
			[name]: checked,
		});
	};

	const handleRolChange = (e) => {
		const selectedRoleId = e.target.value;
		setSelectedRolId(selectedRoleId);
		if (selectedRoleId) {
			const selectedRole = roles.find((rol) => rol.id === selectedRoleId);
			setInputValues((prevState) => ({
				...prevState,
				rol: selectedRole.id, // Actualiza inputValues.rol con el ID del rol seleccionado
			}));
		} else {
			setInputValues((prevState) => ({
				...prevState,
				rol: "", // Si el valor seleccionado es undefined, establece el ID del rol como una cadena vacía
			}));
		}
	};

	const isRolSelected = () => {
		return !!selectedRolId; // Devuelve true si selectedRolId no es nulo ni vacío
	};

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

		if (!isRolSelected()) {
			// Si no se ha seleccionado un rol válido, muestra un mensaje de error y no guarda
			Swal.fire({
				icon: "error",
				title: "Error al guardar el registro",
				text: "Por favor, selecciona un rol antes de guardar.",
				showConfirmButton: false,
				timer: 2500,
			});
			return; // Salir de la función handleSave si no se ha seleccionado un rol válido
		}
		
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

				Swal.fire({
					icon: "success",
					title: "Operación exitosa!",
					text: "Registro guardado exitosamente.",
					showConfirmButton: false,
					timer: 2500,
				});
				setTimeout(() => {
					navigate("/");
				}, 2500);
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

	// const fetchRoles = async () => {
	// 	try {
	// 		const endpoint = "http://localhost:5000/api/roles";
	// 		const direction = "";
	// 		const method = "GET";
	// 		const body = false;
	// 		const headers = {
	// 			"Content-Type": "application/json",
	// 			// Authorization: localStorage.getItem("token"),
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
						{/* <div className="col-3">
							<label htmlFor="rol">Rol</label>
							<select
								className="form-select"
								id="rol"
								name="rol"
								value={inputValues.rol}
								onChange={handleRolChange}
								required>
								<option value="">Selecciona un rol</option>
								<option value="Administrador">Administrador</option>
								<option value="Usuario">Usuario</option>
							</select>
						</div> */}
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
						<div className="col-2 text-centea">
							<label htmlFor="administrador" className="form-label mb-0">
								Administrador
							</label>
							<div className="form-switch">
								<input
									type="checkbox"
									className="form-check-input"
									id="administrador"
									name="administrador"
									value={setInputValues.administrador}
									checked={inputValues.administrador}
									onChange={handleSwitchChange}
								/>
							</div>
						</div>
					</div>
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

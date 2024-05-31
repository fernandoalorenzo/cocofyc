import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import { useNavigate } from "react-router-dom";

const Perfil = ( {API_ENDPOINT} ) => {
	const initialState = {
		email: "",
		password: "",
		nombre: "",
		apellido: "",
		avatar: "",
		activo: false,
		administrador: false,
	};

	const navigate = useNavigate();
	const [inputValues, setInputValues] = useState(initialState);
	const [user, setUser] = useState(initialState); //

	// Función para cargar los datos del usuario desde el localStorage
	const loadUserFromLocalStorage = () => {
		const userString = localStorage.getItem("user");
		if (userString) {
			const user = JSON.parse(userString);
			setInputValues(user); // Actualiza inputValues con los datos del usuario
			setUser(user);
		}
	};
	
	useEffect(() => {
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

	const handleCancel = () => {
        setInputValues(initialState);
		navigate("/");
	};

	const handleSave = async () => {
		// const user = JSON.parse(localStorage.getItem("user"));
		const endpoint = `${API_ENDPOINT}/usuarios/`;
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

	return (
		<>
			<div className="content-wrapper">
				<div className="content-header">
					<div className="container-fluid container-md w-50">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1 className="m-0">Perfil</h1>
							</div>
						</div>
					</div>
				</div>
				<div className="container justify-content-center w-50">
					<div className="card">
						<div className="card-header text-start bg-secondary fst-italic">
							<strong>
								{user && user.nombre} {user && user.apellido}
							</strong>
						</div>
						<div className="card-body py-1">
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
											checked={inputValues.activo}
											onChange={handleSwitchChange}
											/>
									</div>
								</div>
								<div className="col-2 text-centea">
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
											checked={inputValues.administrador}
											onChange={handleSwitchChange}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="card-header">
							{/* Botones */}
							<div className="row mb-3 justify-content-end">
								<div className="col-auto">
									<button
										type="button"
										className="btn btn-secondary me-2"
										onClick={handleCancel}>
										<i className="fas fa-times me-1"></i>{" "}
										Cancelar
									</button>
								</div>
								<div className="col-auto">
									<button
										type="button"
										className="btn btn-primary"
										onClick={handleSave}>
										<i className="fas fa-save me-1"></i>{" "}
										Guardar
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Perfil;

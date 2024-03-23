import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import apiConnection from "../../../../backend/functions/apiConnection";
import { useForm } from "react-hook-form";

const Parametros = () => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();

	const [registro, setRegistro] = useState(null);
	const [mediosDePago, setMediosDePago] = useState([]);
	const [nuevoMedioPago, setNuevoMedioPago] = useState("");
	const [mostrarNuevoMedio, setMostrarNuevoMedio] = useState(false);
	const navigate = useNavigate();

	const fetchMediosDePago = async () => {
		try {
			const endpoint = "http://localhost:5000/api/mediosdepago/";
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

			if (response) {
				setMediosDePago(response.data);
			} else {
				console.error(
					"Error al obtener los datos de los medios de pago:",
					response.statusText
				);
			}
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	const agregarMedioPago = async () => {
		try {
			const endpoint = "http://localhost:5000/api/mediosdepago/";
			const method = "POST";
			const body = { medio: nuevoMedioPago };

			const headers = {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			};

			const response = await apiConnection(
				endpoint,
				"",
				method,
				body,
				headers
			);

			if (response.data) {
				// Agregar el nuevo medio de pago al estado local
				setMediosDePago([...mediosDePago, response.data]);

				setNuevoMedioPago("");
				setMostrarNuevoMedio(false);

				Swal.fire({
					icon: "success",
					title: "Medio de pago agregado!",
					text: "El nuevo medio de pago ha sido agregado exitosamente.",
				});
			} else {
				console.error(
					"Error al agregar el medio de pago:",
					response.error
				);
			}
		} catch (error) {
			console.error("Error al agregar el medio de pago:", error.message);
		}
	};

	const fetchParametros = async () => {
		try {
			const endpoint = "http://localhost:5000/api/parametros/";
			const direction = "1";
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

			if (response) {
				setRegistro(response.data); // Guarda los datos del registro en el estado
				// Setea los valores de los inputs usando setValue
				setValue("titular", response.data.titular);
				setValue("domicilio", response.data.domicilio);
				setValue("localidad", response.data.localidad);
				setValue("cuit", response.data.cuit);
				setValue("telefono", response.data.telefono);
				setValue("email", response.data.email);
				setValue("importe_cuota", response.data.importe_cuota);
			} else {
				console.error(
					"Error al obtener los datos de los parametros:",
					response.statusText
				);
			}
		} catch (error) {
			console.error(
				"Error al obtener los datos de los parametros:",
				error
			);
		}
	};

	useEffect(() => {
		fetchParametros();
		fetchMediosDePago();
	}, []);

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

	// FUNCION PARA ACTUALIZAR LOS DATOS
	const onSubmit = async (formData) => {
		try {
			const endpoint = "http://localhost:5000/api/parametros/";
			const direction = "1";
			const method = "PATCH";
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
				// Actualizar el valor del importe de matrícula en el localStorage
				localStorage.setItem(
					"parametros",
					JSON.stringify(response.data)
				);

				// Mostrar una notificación de éxito
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

	return (
		<>
			<div className="content-wrapper">
				<div className="content-header">
					<div className="container-fluid container-md">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1 className="m-0">Parámetros</h1>
							</div>
						</div>
					</div>
				</div>
				<div>
					<section className="content">
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="container-fluid container-md px-5">
								<div className="row justify-content-center text-center bg-secondary mb-3">
									<h6 className="fst-italic my-1">
										Información General
									</h6>
								</div>
								<div className="row">
									{/* Titular */}
									<div className="col mb-3">
										<label
											htmlFor="titular"
											className="form-label mb-0">
											Titular{" "}
											<span className="text-danger">
												*
											</span>
										</label>
										<input
											type="text"
											className="form-control"
											id="titular"
											{...register("titular", {
												required: true,
											})}
										/>
										{errors.titular && (
											<span className="text-danger">
												Este campo es requerido
											</span>
										)}
									</div>
									{/* Domicilio */}
									<div className="col mb-3">
										<label
											htmlFor="domicilio"
											className="form-label mb-0">
											Domicilio{" "}
											<span className="text-danger">
												*
											</span>
										</label>
										<input
											type="text"
											className="form-control"
											id="domicilio"
											{...register("domicilio", {
												required: true,
											})}
										/>
										{errors.domicilio && (
											<span className="text-danger">
												Este campo es requerido
											</span>
										)}
									</div>
									{/* Localidad */}
									<div className="col mb-3">
										<label
											htmlFor="localidad"
											className="form-label mb-0">
											Localidad{" "}
											<span className="text-danger">
												*
											</span>
										</label>
										<input
											type="text"
											className="form-control"
											id="localidad"
											{...register("localidad", {
												required: true,
											})}
										/>
										{errors.localidad && (
											<span className="text-danger">
												Este campo es requerido
											</span>
										)}
									</div>
								</div>
								<div className="row mb-3">
									{/* CUIT */}
									<div className="col-2 mb-3">
										<label
											htmlFor="cuit"
											className="form-label mb-0">
											CUIT{" "}
											<span className="text-danger">
												*
											</span>
										</label>
										<input
											type="text"
											className="form-control"
											id="cuit"
											maxLength="13"
											{...register("cuit", {
												required: true,
											})}
											onChange={handleCUITChange}
										/>
										{errors.cuit && (
											<span className="text-danger">
												Este campo es requerido
											</span>
										)}
									</div>
									{/* Teléfono */}
									<div className="col-4 mb-3">
										<label
											htmlFor="telefono"
											className="form-label mb-0">
											Teléfono
										</label>
										<input
											type="text"
											className="form-control"
											id="telefono"
											{...register("telefono")}
										/>
									</div>
									{/* E-Mail */}
									<div className="col mb-3">
										<label
											htmlFor="email"
											className="form-label mb-0">
											E-Mail{" "}
											<span className="text-danger">
												*
											</span>
										</label>
										<input
											type="email"
											className="form-control"
											id="email"
											autoComplete="off"
											{...register("email", {
												required: true,
											})}
										/>
										{errors.email && (
											<span className="text-danger">
												Este campo es requerido
											</span>
										)}
									</div>
								</div>
								<div className="row justify-content-center text-center bg-secondary mb-3">
									<h6 className="fst-italic my-1">
										Parámetros Generales
									</h6>
								</div>
								<div className="row mb-3">
									{/* Importe de cuota */}
									<div className="col-2 mb-3">
										<label
											htmlFor="importe_cuota"
											className="form-label mb-0">
											Importe de cuota
										</label>
										<div className="input-group mb-3">
											<span className="input-group-text bg-secondary">
												$
											</span>
											<input
												type="text"
												className="form-control"
												id="importe_cuota"
												{...register("importe_cuota")}
											/>
										</div>
									</div>
									{/* Medios de pago */}
									<div className="col-6">
										<label
											htmlFor="medio_pago"
											className="form-label mb-0">
											Medios de pago
										</label>
										<select
											className="form-select"
											id="medio_pago"
											{...register("medio_pago")}
											hidden={mostrarNuevoMedio}>
											{mediosDePago.map((medio) => (
												<option
													key={medio.id}
													value={medio.id}>
													{medio.medio}
												</option>
											))}
										</select>
										<input
											type="text"
											className="form-control"
											id="nuevo_medio_pago"
											{...register("nuevo_medio_pago")}
											hidden={!mostrarNuevoMedio}
											onChange={(e) =>
												setNuevoMedioPago(
													e.target.value
												)
											}
										/>
									</div>
									<div className="col-4">
										{!mostrarNuevoMedio && (
											<button
												type="button"
												className="btn btn-primary rounded-circle"
												onClick={() =>
													setMostrarNuevoMedio(true)
												}>
												<i className="fa-regular fa-plus"></i>
											</button>
										)}
									</div>
									<div className="col-2">
										{mostrarNuevoMedio && (
											<button
												type="button"
												className="btn btn-primary rounded-circle"
												onClick={agregarMedioPago}>
												<i className="fa-regular fa-save"></i>
											</button>
										)}
									</div>
								</div>
								<div className="row justify-content-end">
									<div className="col-auto">
										<button
											type="button"
											className="btn btn-secondary mx-2"
											onClick={() => navigate("/")}>
											<i className="fa-solid fa-ban me-2"></i>
											Cancelar
										</button>
										<button
											type="submit"
											className="btn btn-primary ">
											<i className="fa-regular fa-floppy-disk me-2"></i>
											Guardar
										</button>
									</div>
								</div>
							</div>
						</form>
					</section>
				</div>
			</div>
		</>
	);
};
export default Parametros;

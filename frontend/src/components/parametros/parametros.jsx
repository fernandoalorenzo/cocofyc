import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import { useForm } from "react-hook-form";

const Parametros = ({ API_ENDPOINT }) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
		watch,
	} = useForm();

	const [registro, setRegistro] = useState(null);
	// Medios de pago
	const [mediosDePago, setMediosDePago] = useState([]);
	const [nuevoMedioPago, setNuevoMedioPago] = useState("");
	const [mostrarNuevoMedio, setMostrarNuevoMedio] = useState(false);
	const [editandoMedioPago, setEditandoMedioPago] = useState(false);
	const [selectedMedioPago, setSelectedMedioPago] = useState("");
	// Aranceles
	const [aranceles, setAranceles] = useState([]);
	const [nuevoArancel, setNuevoArancel] = useState("");
	const [mostrarNuevoArancel, setMostrarNuevoArancel] = useState(false);
	const [editandoArancel, setEditandoArancel] = useState(false);
	const [selectedArancel, setSelectedArancel] = useState("");

	const importeCuotaModificado = watch("importe_cuota", "");

	/////////////////////////////////// Medios de Pago //////////////////////////////////////////
	const fetchMediosDePago = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/mediosdepago`;
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
				// Ordenar los medios de pago alfabéticamente por su nombre
				const mediosOrdenados = response.data.sort((a, b) =>
					a.medio.localeCompare(b.medio)
				);
				setMediosDePago(mediosOrdenados);
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
			// Verificar si se está editando un medio de pago existente
			if (editandoMedioPago) {
				await handleActualizarMedioPago();
			} else {
				// Agregar un nuevo medio de pago
				const endpoint = `${API_ENDPOINT}/mediosdepago`;
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
					const nuevosMediosDePago = [...mediosDePago, response.data];

					// Ordenar los nuevos medios de pago alfabéticamente por su nombre
					const mediosOrdenados = nuevosMediosDePago.sort((a, b) =>
						a.medio.localeCompare(b.medio)
					);

					Swal.fire({
						icon: "success",
						title: "Medio de pago agregado!",
						text: "El nuevo medio de pago ha sido agregado exitosamente.",
						timer: 2500,
						showConfirmButton: false,
					});

					setTimeout(() => {
						setMediosDePago(mediosOrdenados);
						setNuevoMedioPago("");
						setMostrarNuevoMedio(false);
					}, 2500);
				} else {
					console.error(
						"Error al agregar el medio de pago:",
						response.error
					);
				}
			}
		} catch (error) {
			console.error("Error al agregar el medio de pago:", error.message);
		}
	};

	const handleMedioPagoChange = (event) => {
		const selectedId = event.target.value;
		if (selectedId === "") {
			setMostrarNuevoMedio(true);
			setSelectedMedioPago(null);
			setEditandoMedioPago(false);
		} else {
			const selectedMedio = mediosDePago.find(
				(medio) => medio.id === selectedId
			);
			setSelectedMedioPago(selectedMedio);
			setMostrarNuevoMedio(false);
		}
	};

	const handleEditarMedioPago = (event) => {
		setMostrarNuevoMedio(true);
		setNuevoMedioPago(selectedMedioPago?.medio);
		setEditandoMedioPago(true);
	};

	const handleActualizarMedioPago = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/mediosdepago/${selectedMedioPago.id}`;
			const method = "PATCH";
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
				// Actualizar el medio de pago en la lista local
				const mediosActualizados = mediosDePago.map((medio) =>
					medio.id === selectedMedioPago.id
						? { ...medio, medio: nuevoMedioPago }
						: medio
				);

				// Ordenar los medios de pago actualizados alfabéticamente por su nombre
				const mediosOrdenados = mediosActualizados.sort((a, b) =>
					a.medio.localeCompare(b.medio)
				);

				Swal.fire({
					icon: "success",
					title: "Cambios guardados!",
					text: "Los cambios del medio de pago han sido guardados exitosamente.",
					timer: 2500,
					showConfirmButton: false,
				});

				setTimeout(() => {
					setMediosDePago(mediosOrdenados);
					setNuevoMedioPago("");
					setMostrarNuevoMedio(false);
					setEditandoMedioPago(false);

					// Resetear el estado del select y el input
					setSelectedMedioPago(null);
					setMostrarNuevoMedio(false);
					setNuevoMedioPago("");
					// Establecer el valor del select como vacío
					const selectElement = document.getElementById("medio_pago");
					selectElement.value = ""; // Esto restablece el valor seleccionado del select
				}, 2500);
			} else {
				console.error(
					"Error al guardar los cambios del medio de pago:",
					response.error
				);
			}
		} catch (error) {
			console.error(
				"Error al guardar los cambios del medio de pago:",
				error.message
			);
		}
	};

	const fetchAranceles = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/aranceles`;
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
				const arancelesOrdenados = response.data.sort((a, b) =>
					a.arancel.localeCompare(b.arancel)
				);
				setAranceles(arancelesOrdenados);
			} else {
				console.error(
					"Error al obtener los datos de los aranceles:",
					response.statusText
				);
			}
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	const agregarArancel = async () => {
		try {
			// Verificar si se está editando un arancel existente
			if (editandoArancel) {
				await handleActualizarArancel();
			} else {
				const endpoint = `${API_ENDPOINT}/aranceles`;
				const method = "POST";
				const body = { arancel: nuevoArancel };

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
					// Agregar el nuevo arancel al estado local
					const nuevosAranceles = [...aranceles, response.data];

					const arancelesOrdenados = nuevosAranceles.sort((a, b) =>
						a.arancel.localeCompare(b.arancel)
					);

					Swal.fire({
						icon: "success",
						title: "Arancel agregado!",
						text: "El nuevo arancel ha sido agregado exitosamente.",
						timer: 2500,
						showConfirmButton: false,
					});

					setTimeout(() => {
						setAranceles(arancelesOrdenados);
						setNuevoArancel("");
						setMostrarNuevoArancel(false);
					}, 2500);
				} else {
					console.error(
						"Error al agregar el arancel:",
						response.error
					);
				}
			}
		} catch (error) {
			console.error("Error al agregar el arancel:", error.message);
		}
	};

	const handleArancelChange = (event) => {
		const selectedIdArancel = event.target.value;
		if (selectedIdArancel === "") {
			setMostrarNuevoArancel(true);
			setSelectedArancel(null);
			setEditandoArancel(false);
		} else {
			const selectedArancel = aranceles.find(
				(arancel) => arancel.id === selectedIdArancel
			);
			setSelectedArancel(selectedArancel);
			setMostrarNuevoArancel(false);
		}
	};

	const handleEditarArancel = (event) => {
		setMostrarNuevoArancel(true);
		setNuevoArancel(selectedArancel?.arancel);
		setEditandoArancel(true);
	};

	const handleActualizarArancel = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/aranceles/${selectedArancel.id}`;
			const method = "PATCH";
			const body = { arancel: nuevoArancel };

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
				// Actualizar el arancel en la lista local
				const arancelesActualizados = aranceles.map((arancel) =>
					arancel.id === selectedArancel.id
						? { ...arancel, arancel: nuevoArancel }
						: arancel
				);

				// Ordenar los aranceles actualizados alfabéticamente por su nombre
				const arancelesOrdenados = arancelesActualizados.sort((a, b) =>
					a.arancel.localeCompare(b.arancel)
				);

				Swal.fire({
					icon: "success",
					title: "Cambios guardados!",
					text: "Los cambios del arancel han sido guardados exitosamente.",
					timer: 2500,
					showConfirmButton: false,
				});

				setTimeout(() => {
					setAranceles(arancelesOrdenados);
					setNuevoArancel("");
					setMostrarNuevoArancel(false);
					setEditandoArancel(false);
					setSelectedArancel(null);
					setMostrarNuevoArancel(false);
					setNuevoArancel("");
					const selectElement = document.getElementById("arancel");
					selectElement.value = "";
				}, 2500);
			} else {
				console.error(
					"Error al guardar los cambios del arancel:",
					response.error
				);
			}
		} catch (error) {
			console.error(
				"Error al guardar los cambios del arancel:",
				error.message
			);
		}
	};

	const handleGuardarImporteCuota = async () => {
		try {
			const formData = {
				importe_cuota: importeCuotaModificado,
			};

			const endpoint = `${API_ENDPOINT}/parametros/`;
			const direction = "1";
			const method = "PATCH";

			const headers = {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			};

			const response = await apiConnection(
				endpoint,
				direction,
				method,
				formData,
				headers
			);

			if (response.data) {
				Swal.fire({
					icon: "success",
					title: "Operación exitosa!",
					text: "Importe de cuota guardado exitosamente.",
					showConfirmButton: false,
					timer: 2500,
				});
			} else {
				console.error("Error en la operación:", response.error);
			}
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Error al guardar el importe de cuota",
				text: "Ocurrió un error al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.",
				showConfirmButton: false,
				timer: 2500,
			});
			console.error("Error:", error.message);
		}
	};

	const fetchParametros = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/parametros/sinToken/`;
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
				setValue("birthday_hora", response.data.birthday_hora);
				setValue("birthday_minutos", response.data.birthday_minutos);
				setValue("aviso_cuota_hora", response.data.aviso_cuota_hora);
				setValue("aviso_cuota_minutos", response.data.aviso_cuota_minutos);
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
		fetchAranceles();
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
			const endpoint = `${API_ENDPOINT}/parametros/`;
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
						<div className="row mb-1">
							<div className="col-sm-6">
								<h1 className="m-0 ">Parámetros</h1>
							</div>
						</div>
					</div>
				</div>
				<div>
					<section className="content">
						<div className="container-fluid container-md pb-3">
							<div className="card">
								<form onSubmit={handleSubmit(onSubmit)}>
									<div className="card-header text-center bg-secondary fst-italic">
										<strong>Información General</strong>
									</div>
									<div className="card-body">
										<div className="row">
											{/* Titular */}
											<div className="col mb-3">
												<label
													htmlFor="titular"
													className="form-label mb-0">
													Titular{" "}
												</label>
												<input
													type="text"
													className="form-control"
													id="titular"
													{...register("titular", {
													})}
												/>
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
									</div>
									<span className="text-center fst-italic bg-secondary d-flex py-2 justify-content-center align-items-center">
										<strong>
											Configuración Horarios de Envíos
										</strong>
									</span>
									<div className="card-body">
										<div className="row">
											{/* Saludo de Cumpleaños */}
											<div className="col-2 align-self-center text-center justify-content-center">
												<label
													htmlFor="birthday_hora"
													className="form-label mb-0">
													Saludo de Cumpleaños
												</label>
												<div className="input-group mb-3 align-self-center">
													<select
														style={{
															minWidth: "5em",
															maxWidth: "5em",
															textAlign: "center",
														}}
														className="form-select"
														id="birthday_hora"
														defaultValue="00"
														{...register(
															"birthday_hora"
														)}>
														{[
															...Array(24).keys(),
														].map((hour) => (
															<option
																key={hour}
																value={String(
																	hour
																).padStart(
																	2,
																	"0"
																)}>
																{String(
																	hour
																).padStart(
																	2,
																	"0"
																)}
															</option>
														))}
													</select>
													<span className="input-group-text bg-white py-0">
														:
													</span>
													<select
														style={{
															minWidth: "5em",
															maxWidth: "5em",
															textAlign: "center",
														}}
														className="form-select"
														id="birthday_minutos"
														defaultValue="00"
														{...register(
															"birthday_minutos"
														)}>
														{[
															...Array(60).keys(),
														].map((minute) => (
															<option
																key={minute}
																value={String(
																	minute
																).padStart(
																	2,
																	"0"
																)}>
																{String(
																	minute
																).padStart(
																	2,
																	"0"
																)}
															</option>
														))}
													</select>
												</div>
											</div>
											{/* Aviso de Vencimiento de	Cuotas */}
											<div className="col-2 align-self-center text-center justify-content-center">
												<label
													htmlFor="aviso_cuota_hora"
													className="form-label mb-0">
													Aviso Venc. Cuotas
												</label>
												<div className="input-group mb-3 align-self-center text-center justify-content-center">
													<select
														style={{
															minWidth: "5em",
															maxWidth: "5em",
															textAlign: "center",
														}}
														className="form-select"
														id="aviso_cuota_hora"
														defaultValue="00"
														{...register(
															"aviso_cuota_hora"
														)}>
														{[
															...Array(24).keys(),
														].map((hour) => (
															<option
																key={hour}
																value={String(
																	hour
																).padStart(
																	2,
																	"0"
																)}>
																{String(
																	hour
																).padStart(
																	2,
																	"0"
																)}
															</option>
														))}
													</select>
													<span className="input-group-text bg-white py-0">
														:
													</span>
													<select
														style={{
															minWidth: "5em",
															maxWidth: "5em",
															textAlign: "center",
														}}
														className="form-select"
														id="aviso_cuota_minutos"
														defaultValue="00"
														{...register(
															"aviso_cuota_minutos"
														)}>
														{[
															...Array(60).keys(),
														].map((minute) => (
															<option
																key={minute}
																value={String(
																	minute
																).padStart(
																	2,
																	"0"
																)}>
																{String(
																	minute
																).padStart(
																	2,
																	"0"
																)}
															</option>
														))}
													</select>
												</div>
											</div>
										</div>
									</div>
									<div className="card-footer text-muted text-end">
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
								</form>
							</div>
						</div>
						{/* ********************************************************* */}
						<div className="container-fluid container-md pt-3">
							<div className="card">
								<div className="card-header text-center bg-secondary fst-italic">
									<strong>Variables Generales</strong>
								</div>
								<div className="card-body">
									<div className="row gx-5">
										{/* IMPORTE DE CUOTA */}
										<div className="col-3 border-right mx-0 pe-0">
											<div className="row">
												<div className="col-md-8">
													<label
														htmlFor="importe_cuota"
														className="form-label mb-0">
														Importe de cuota
													</label>
													<div className="input-group">
														<span className="input-group-text bg-secondary">
															$
														</span>
														<input
															type="text"
															step="0.01"
															className="form-control"
															id="importe_cuota"
															{...register(
																"importe_cuota"
															)}
														/>
													</div>
												</div>
												<div className="col-md-3 d-flex align-items-end mx-0 px-0">
													<button
														type="button"
														title="Guardar cambios de importe de cuota"
														id="guardar_importe_cuota"
														className="btn btn-primary me-2"
														onClick={
															handleGuardarImporteCuota
														}>
														<i className="fa-solid fa-save"></i>
													</button>
												</div>
											</div>
										</div>
										{/* MEDIOS DE PAGO */}
										<div className="col-4 border-right ms-3">
											<div className="row">
												<div className="col-md-8">
													<label
														htmlFor="medio_pago"
														className="form-label mb-0">
														Medios de pago
													</label>
													<select
														className="form-select"
														id="medio_pago"
														onChange={(e) => {
															handleMedioPagoChange(
																e
															);
															// Restablecer los estados de los botones al seleccionar "Seleccionar"
															if (
																e.target
																	.value ===
																""
															) {
																setMostrarNuevoMedio(
																	false
																);
																setSelectedMedioPago(
																	null
																);
																setNuevoMedioPago(
																	""
																);
															}
														}}
														hidden={
															mostrarNuevoMedio
														}>
														<option
															value=""
															className="fst-italic">
															Añadir nuevo...
														</option>
														{mediosDePago.map(
															(medio) => (
																<option
																	key={
																		medio.id
																	}
																	value={
																		medio.id
																	}>
																	{
																		medio.medio
																	}
																</option>
															)
														)}
													</select>
													<input
														type="text"
														className="form-control"
														id="nuevo_medio_pago"
														value={nuevoMedioPago}
														onChange={(e) =>
															setNuevoMedioPago(
																e.target.value
															)
														}
														hidden={
															!mostrarNuevoMedio
														}
													/>
												</div>
												<div className="col-md-4 d-flex align-items-end justify-content-start ps-0">
													{mostrarNuevoMedio && (
														<>
															<button
																type="button"
																title="Guardar"
																className="btn btn-primary me-2"
																onClick={
																	agregarMedioPago
																}>
																<i className="fa-regular fa-save"></i>
															</button>
															<button
																type="button"
																title="Cancelar"
																className="btn btn-secondary"
																onClick={() =>
																	setMostrarNuevoMedio(
																		false
																	)
																}>
																<i className="fa-solid fa-ban"></i>
															</button>
														</>
													)}
													{!mostrarNuevoMedio &&
														selectedMedioPago && (
															<button
																type="button"
																title="Editar"
																className="btn btn-warning"
																onClick={
																	handleEditarMedioPago
																}>
																<i className="fa-solid fa-edit"></i>
															</button>
														)}
													{!mostrarNuevoMedio &&
														!selectedMedioPago && (
															<button
																type="button"
																title="Agregar"
																className="btn btn-primary me-2"
																onClick={() => {
																	setMostrarNuevoMedio(
																		true
																	);
																	setSelectedMedioPago(
																		null
																	);
																	setNuevoMedioPago(
																		""
																	);
																}}>
																<i className="fa-regular fa-plus"></i>
															</button>
														)}
												</div>
											</div>
										</div>
										{/* ARANCELES */}
										<div className="col-4 ms-3">
											<div className="row">
												<div className="col-md-8">
													<label
														htmlFor="arancel"
														className="form-label mb-0">
														Aranceles
													</label>
													<select
														className="form-select"
														id="arancel"
														onChange={(e) => {
															handleArancelChange(
																e
															);
															// Restablecer los estados de los botones al seleccionar "Seleccionar"
															if (
																e.target
																	.value ===
																""
															) {
																setMostrarNuevoArancel(
																	false
																);
																setSelectedArancel(
																	null
																);
																setNuevoArancel(
																	""
																);
															}
														}}
														hidden={
															mostrarNuevoArancel
														}>
														<option
															value=""
															className="fst-italic">
															Añadir nuevo...
														</option>
														{aranceles.map(
															(arancel) => (
																<option
																	key={
																		arancel.id
																	}
																	value={
																		arancel.id
																	}>
																	{
																		arancel.arancel
																	}
																</option>
															)
														)}
													</select>
													<input
														type="text"
														className="form-control"
														id="nuevo_arancel"
														value={nuevoArancel}
														onChange={(e) =>
															setNuevoArancel(
																e.target.value
															)
														}
														hidden={
															!mostrarNuevoArancel
														}
													/>
												</div>
												<div className="col-3 d-flex align-items-end justify-content-start ps-0">
													{mostrarNuevoArancel && (
														<>
															<button
																type="button"
																title="Guardar"
																className="btn btn-primary me-2"
																onClick={
																	agregarArancel
																}>
																<i className="fa-regular fa-save"></i>
															</button>
															<button
																type="button"
																title="Cancelar"
																className="btn btn-secondary"
																onClick={() =>
																	setMostrarNuevoArancel(
																		false
																	)
																}>
																<i className="fa-solid fa-ban"></i>
															</button>
														</>
													)}
													{!mostrarNuevoArancel &&
														selectedArancel && (
															<button
																type="button"
																title="Editar"
																className="btn btn-warning"
																onClick={
																	handleEditarArancel
																}>
																<i className="fa-solid fa-edit"></i>
															</button>
														)}
													{!mostrarNuevoArancel &&
														!selectedArancel && (
															<button
																type="button"
																title="Agregar"
																className="btn btn-primary me-2"
																onClick={() => {
																	setMostrarNuevoArancel(
																		true
																	);
																	setSelectedArancel(
																		null
																	);
																	setNuevoArancel(
																		""
																	);
																}}>
																<i className="fa-regular fa-plus"></i>
															</button>
														)}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</>
	);
};
export default Parametros;

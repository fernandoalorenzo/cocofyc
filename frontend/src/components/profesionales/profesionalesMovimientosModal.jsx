import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import FormularioCargarPago from "./formularioCargarPago";

const GestionesModal = ({ showModal, closeModal, data }) => {
	const [gestiones, setGestiones] = useState([]);
	const [selectedGestion, setSelectedGestion] = useState("");

	const user = JSON.parse(localStorage.getItem("user"));

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

	const onSubmit = async (data) => {
		console.log(data);
		// Agregar el campo tipo_operacion con el valor "INGRESO"
		const newData = {
			...data,
			tipo_operacion: "INGRESO",
			user_id: user.id,
		};
		try {
			const endpoint = "http://localhost:5000/api/movimientos/";
			const direction = "";
			const method = "POST";
			const body = newData;
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

			Swal.fire({
				title: "Éxito",
				text: "El registro fue creado exitosamente",
				icon: "success",
				timer: 2500,
			});
		} catch (error) {
			console.error("Error al guardar el registro:", error.message);
			Swal.fire({
				title: "Error",
				text: "Ha ocurrido un error al intentar guardar el registro",
				icon: "error",
			});
		}
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setArchivoSeleccionado(file);
	};

	// const fetchMovimientos = async () => {
	// 	try {
	// 		const endpoint = "http://localhost:5000/api/movimientos/";
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

	// 		if (response && response.data) {
	// 			// Ordenar los movimientos alfabéticamente por nombre antes de establecer el estado
	// 			const sortedGestiones = response.data.sort((a, b) =>
	// 				a.movimiento.localeCompare(b.movimiento)
	// 			);
	// 			setGestiones(sortedGestiones);
	// 		} else {
	// 			console.error(
	// 				"Error fetching movimientos: ",
	// 				response.statusText
	// 			);
	// 		}
	// 	} catch (error) {
	// 		console.error("Error fetching movimientos: ", error);
	// 	}
	// };

	// useEffect(() => {
	// 	if (data) {
	// 		fetchGestiones();
	// 	}
	// }, [data]);

	// const handleGestionChange = (e) => {
	// 	setSelectedGestion(e.target.value);
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
			<div className="modal-dialog modal-lg">
				<div className="modal-content">
					<div className="modal-header bg-primary">
						<h5 className="modal-title">
							Gestión de cuenta
							{data && data.nombre ? (
								<span>
									{" "}
									de{" "}
									<span className="text-warning">
										{data.nombre}
									</span>
								</span>
							) : (
								<span></span>
							)}
						</h5>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={closeModal}></button>
					</div>
					<div className="modal-body">
						{/* ********************* PESTAÑAS ********************* */}
						<ul className="nav nav-tabs" id="myTab" role="tablist">
							<li className="nav-item" role="presentation">
								<button
									className="nav-link active"
									id="cargarPago-tab"
									data-bs-toggle="tab"
									data-bs-target="#cargarPago"
									type="button"
									role="tab"
									aria-controls="cargarPago"
									aria-selected="true">
									Cargar Pago
								</button>
							</li>
							<li className="nav-item" role="presentation">
								<button
									className="nav-link"
									id="generarCuota-tab"
									data-bs-toggle="tab"
									data-bs-target="#generarCuota"
									type="button"
									role="tab"
									aria-controls="generarCuota"
									aria-selected="false">
									Generar Cuota
								</button>
							</li>
							<li className="nav-item" role="presentation">
								<button
									className="nav-link"
									id="cuotasPendientes-tab"
									data-bs-toggle="tab"
									data-bs-target="#cuotasPendientes"
									type="button"
									role="tab"
									aria-controls="cuotasPendientes"
									aria-selected="false">
									Cuotas pendientes
								</button>
							</li>
							<li className="nav-item" role="presentation">
								<button
									className="nav-link"
									id="movimientos-tab"
									data-bs-toggle="tab"
									data-bs-target="#movimientos"
									type="button"
									role="tab"
									aria-controls="movimientos"
									aria-selected="false">
									Movimientos
								</button>
							</li>
							<li className="nav-item" role="presentation">
								<button
									className="nav-link"
									id="denuncias-tab"
									data-bs-toggle="tab"
									data-bs-target="#denuncias"
									type="button"
									role="tab"
									aria-controls="denuncias"
									aria-selected="false">
									Denuncias
								</button>
							</li>
						</ul>
						{/* ********************* CONTENIDO ********************* */}
						<div className="tab-content" id="myTabContent">
							{/* ********************* PAGOS ********************* */}
							<div
								className="tab-pane fade show active"
								id="cargarPago"
								role="tabpanel"
								aria-labelledby="cargarPago-tab">
								<form
									id="cargar-pago"
									onSubmit={handleSubmit(onSubmit)}>
									{/* user_id obtenido del localStorage */}
									<input
										type="hidden"
										{...register("user_id")}
										value={
											localStorage.getItem("user_id") ||
											""
										}
									/>
									<div className="row mt-2">
										{/* fecha */}
										<div className="col">
											<label htmlFor="fecha">
												Fecha:
											</label>
											<input
												type="date"
												id="fecha"
												className="form-control"
												{...register("fecha", {
													required: true,
												})}
											/>
											{errors.fecha && (
												<span>
													Este campo es requerido
												</span>
											)}
										</div>
										{/* importe */}
										<div className="col">
											<label htmlFor="importe">
												Importe:
											</label>
											<input
												type="number"
												id="importe"
												className="form-control"
												{...register("importe", {
													required: true,
												})}
											/>
											{errors.importe && (
												<span>
													Este campo es requerido
												</span>
											)}
										</div>
										{/* medio_id */}
										<div className="col">
											<label htmlFor="medio_id">
												Medio:
											</label>
											<select
												className="form-select"
												id="medio_id"
												{...register("medio_id", {
													required: true,
												})}>
												<option value="">
													Selecciona un medio
												</option>
												<option value="1">
													EFECTIVO
												</option>
												<option value="2">
													TRANSFERENCIA
												</option>
											</select>
											{errors.medio_id && (
												<span>
													Este campo es requerido
												</span>
											)}
										</div>
									</div>
									<div className="row mt-2">
										{/* concepto */}
										<div className="col">
											<label htmlFor="concepto">
												Concepto:
											</label>
											<input
												type="text"
												className="form-control"
												id="concepto"
												{...register("concepto", {
													required: true,
												})}
											/>
											{errors.concepto && (
												<span>
													Este campo es requerido
												</span>
											)}
										</div>

										{/* comprobante */}
										<div className="col">
											<label htmlFor="comprobante">
												Comprobante:
											</label>
											<input
												type="file"
												className="form-control"
												id="comprobante"
												onChange={handleFileChange}
											/>
											{archivoSeleccionado && (
												<img
													src={URL.createObjectURL(
														archivoSeleccionado
													)}
													alt="Vista previa"
												/>
											)}
										</div>
									</div>
									<div className="my-4 border-top border-secondary border-opacity-25">
										<div className="row mt-3 mb-0 d-flex justify-content-end">
											<button
												type="button"
												className="btn btn-secondary col-md-2 mx-2"
												onClick={closeModal}>
												Cancelar
											</button>
											<button
												type="submit"
												className="btn btn-primary col-md-2 mx-2">
												Guardar
											</button>
										</div>
									</div>
									{/* <div className="row mt-2 d-flex justify-content-end">
										<div className="col d-flex justify-content-start">
										</div>
										<div className="col d-flex justify-content-end">
										</div>
									</div> */}
								</form>
							</div>
							{/* ********************* GENERAR CUOTA ********************* */}
							<div
								className="tab-pane fade"
								id="generarCuota"
								role="tabpanel"
								aria-labelledby="generarCuota-tab">
								<p>Generar cuota</p>
							</div>
							{/* ********************* CUOTAS PENDIENTES ********************* */}
							<div
								className="tab-pane fade"
								id="cuotasPendientes"
								role="tabpanel"
								aria-labelledby="cuotasPendientes-tab">
								<p>Cuotas pendientes</p>
							</div>
							{/* ********************* MOVIMIENTOS ********************* */}
							<div
								className="tab-pane fade"
								id="movimientos"
								role="tabpanel"
								aria-labelledby="movimientos-tab">
								<p>Movimientos</p>
							</div>
							{/* ********************* DENUNCIAS ********************* */}
							<div
								className="tab-pane fade"
								id="denuncias"
								role="tabpanel"
								aria-labelledby="denuncias-tab">
								<p>Denuncias</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GestionesModal;

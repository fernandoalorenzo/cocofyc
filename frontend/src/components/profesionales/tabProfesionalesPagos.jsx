import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";

const CargarPagosTab = ({
	profesionalId,
	toggleCardBodyForm,
	updateMovimientos,
	API_ENDPOINT,
	activeTab,
}) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
		watch,
	} = useForm();

	const [mediosDePago, setMediosDePago] = useState([]);
	const [aranceles, setAranceles] = useState([]);
	const [cuotasGeneradas, setCuotasGeneradas] = useState([]);
	const [tipoAsignacion, setTipoAsignacion] = useState("");
	const [importeCuotaSeleccionada, setImporteCuotaSeleccionada] =
		useState(null);

	const user = JSON.parse(localStorage.getItem("user"));

	// Obtener la fecha actual en formato YYYY-MM-DD
	const getCurrentDate = () => {
		const now = new Date();
		const year = now.getFullYear();
		let month = now.getMonth() + 1;
		let day = now.getDate();
		if (month < 10) month = "0" + month;
		if (day < 10) day = "0" + day;
		return `${year}-${month}-${day}`;
	};

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

	useEffect(() => {
		if (activeTab === "cargarPago") {
			setImporteCuotaSeleccionada(null);
			setTipoAsignacion("");
			reset();
		}
	}, [activeTab]);

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
					"Error al obtener los datos de los aranceles de pago:",
					response.statusText
				);
			}
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	useEffect(() => {
		fetchMediosDePago();
		fetchAranceles();
	}, []);

	useEffect(() => {
		if (profesionalId) {
			fetchCuotasGeneradas(profesionalId);
		}

	}, [profesionalId]);

	const onSubmitCargarPago = async (data) => {
		const newData = {
			...data,
			tipo_operacion: "INGRESO",
			user_id: user.id,
			profesional_id: profesionalId,
		};

		try {
			const endpoint = `${API_ENDPOINT}/movimientos`;
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
				title: "Operación exitosa",
				text: "El registro fue creado exitosamente",
				icon: "success",
				showConfirmButton: false,
				timer: 2500,
			});

			if (newData.cuotasGeneradas) {
				await asignarMovimientoACuota(
					newData.cuotasGeneradas,
					response.data.id
				);
			}
			// Forzar la actualización del componente MovimientosTab
			updateMovimientos();

			// Resetear el formulario después de guardar los cambios
			reset();

			// Ocultar el formulario
			toggleCardBodyForm(false);
		} catch (error) {
			console.error("Error al guardar el registro:", error.message);
			Swal.fire({
				title: "Error",
				text: "Ha ocurrido un error al intentar guardar el registro",
				icon: "error",
			});
		}
	};

	const asignarMovimientoACuota = async (cuotaId, movimientoId) => {
		try {
			const endpoint = `${API_ENDPOINT}/profesionales/asignar-movimiento-a-cuota/`;
			const direction = `${cuotaId}/${movimientoId}`;
			const method = "PATCH";
			const body = { id: cuotaId, movimiento_id: movimientoId };
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

			if (!response) {
				console.error(
					"Error al asignar movimiento a cuota: ",
					response.statusText
				);
			}
		} catch (error) {
			console.error("Error al asignar movimiento a cuota: ", error);
		}
	};

	const fetchCuotasGeneradas = async (profesionalId) => {
		try {
			const endpoint = `${API_ENDPOINT}/profesionales/cuotas-generadas-profesional/${profesionalId}`;
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

			if (response && response.data) {
				// Para cada cuota generada, obtenemos los detalles de la cuota
				const cuotasWithDetails = await Promise.all(
					response.data.map(async (cuotaGenerada) => {
						const cuotaDetails = await fetchCuotaDetails(
							cuotaGenerada.cuota_id
						);
						return { ...cuotaGenerada, ...cuotaDetails };
					})
				);

				// Filtrar las cuotas generadas que no tienen movimiento_id
				const cuotasSinMovimiento = cuotasWithDetails.filter(
					(cuota) => !cuota.movimiento_id
				);
				setCuotasGeneradas(cuotasSinMovimiento);
			} else {
				console.error(
					"Error fetching cuotas generadas: ",
					response.statusText
				);
			}
		} catch (error) {
			console.error("Error fetching cuotas generadas: ", error);
		}
	};

	const fetchCuotaDetails = async (cuotaId) => {
		if (!cuotaId) return;
		try {
			const endpoint = `${API_ENDPOINT}/cuotas/${cuotaId}`;
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

			if (response && response.data) {
				return {
					cuota: response.data.cuota,
					vencimiento: response.data.vencimiento,
					importe: response.data.importe,
				};
			} else {
				console.error(
					"Error fetching cuota details: ",
					response.statusText
				);
			}
		} catch (error) {
			console.error("Error fetching cuota details: ", error);
		}
	};

	const handleCancelar = () => {
		reset();
		toggleCardBodyForm(false);
	};

	const handleTipoAsignacionChange = async (e) => {
		setTipoAsignacion(e.target.value);
		setImporteCuotaSeleccionada(null);
		if (e.target.value === "cuota" && profesionalId) {
			await fetchCuotasGeneradas(profesionalId);
		}
	};

	const handleCuotaChange = (e) => {
		const selectedCuota = cuotasGeneradas.find(
			(cuota) => cuota.id === e.target.value
		);
		setImporteCuotaSeleccionada(
			selectedCuota ? selectedCuota.importe : null
		);
	};

	return (
		<div className="container-fluid">
			<div className="card">
				<div className="card-header bg-primary bg-opacity-50 align-items-center text-center">
					<h5 className="card-title fw-bold text-center">
						Cargar nuevo pago
					</h5>
				</div>
				<form
					id="cargar-pago"
					onSubmit={handleSubmit(onSubmitCargarPago)}>
					<div className="card-body">
						<input
							type="hidden"
							{...register("user_id")}
							value={localStorage.getItem("user_id") || ""}
						/>
						<div className="row mt-2">
							{/* fecha */}
							<div className="col">
								<label htmlFor="fecha">
									Fecha
									<span className="text-danger"> *</span>
								</label>
								<input
									type="date"
									id="fecha"
									className="form-control"
									defaultValue={getCurrentDate()}
									{...register("fecha", {
										required: true,
									})}
								/>
								{errors.fecha?.type === "required" && (
									<span className="row text-danger m-1">
										El campo es requerido
									</span>
								)}
							</div>
							{/* importe */}
							<div className="col">
								<label htmlFor="importe">
									Importe{" "}
									<span className="text-danger"> *</span>
								</label>
								<input
									type="number"
									id="importe"
									className="form-control"
									{...register("importe", {
										required: true,
									})}
								/>
								{errors.importe?.type === "required" && (
									<span className="row text-danger m-1">
										El campo es requerido
									</span>
								)}
							</div>
							{/* medio_id */}
							<div className="col">
								<label htmlFor="medio_id">
									Medio de pago{" "}
									<span className="text-danger"> *</span>
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
									{mediosDePago.map((medio) => (
										<option key={medio.id} value={medio.id}>
											{medio.medio}
										</option>
									))}
								</select>
								{errors.medio_id?.type === "required" && (
									<span className="row text-danger m-1">
										El campo es requerido
									</span>
								)}
							</div>
						</div>
						<div className="row mt-2">
							{/* concepto */}
							<div className="col-5">
								<label htmlFor="concepto">
									Concepto{" "}
									<span className="text-danger"> *</span>
								</label>
								<input
									type="text"
									className="form-control"
									id="concepto"
									{...register("concepto", {
										required: true,
									})}
								/>
								{errors.concepto?.type === "required" && (
									<span className="row text-danger m-1">
										El campo es requerido
									</span>
								)}
							</div>
							{/* Seleccionar tipo de asignación */}
							<div className="col-4">
								<label htmlFor="tipoAsignacion">
									Asignar a
								</label>
								<select
									className="form-select"
									id="tipoAsignacion"
									{...register("tipoAsignacion", {
										onChange: handleTipoAsignacionChange,
									})}>
									<option value="">
										Seleccione una opción
									</option>
									<option value="cuota">Cuota</option>
									<option value="arancel">
										Arancel Extraordinario
									</option>
								</select>
							</div>
							{/* cuotas para asignar al pago */}
							{tipoAsignacion === "cuota" && (
								<div className="col-3">
									<label htmlFor="cuotasGeneradas">
										Seleccione una cuota
									</label>
									<select
										className="form-select"
										id="cuotasGeneradas"
										{...register("cuotasGeneradas", {
											required:
												tipoAsignacion === "cuota",
											onChange: handleCuotaChange,
										})}>
										<option value="">
											Seleccione una opción
										</option>
										{cuotasGeneradas.map(
											(cuotaGenerada) => (
												<option
													key={cuotaGenerada.id}
													value={cuotaGenerada.id}>
													{cuotaGenerada.cuota}
												</option>
											)
										)}
									</select>
									{errors.cuotasGeneradas && (
										<span className="row text-danger m-1">
											El campo es requerido
										</span>
									)}
									{importeCuotaSeleccionada && (
										<span className="badge bg-warning mt-2 d-block w-100">
											<strong>
												Importe: $
												{importeCuotaSeleccionada}
											</strong>
										</span>
									)}
								</div>
							)}
							{/* arancel extraordinario para aplicar pago*/}
							{tipoAsignacion === "arancel" && (
								<div className="col-3">
									<label htmlFor="arancel_id">
										Seleccionar Arancel
									</label>
									<select
										className="form-select"
										id="arancel_id"
										{...register("arancel_id", {
											required:
												tipoAsignacion === "arancel",
										})}>
										<option value="">
											Seleccione una opción
										</option>
										{aranceles.map((arancel) => (
											<option
												key={arancel.id}
												value={arancel.id}>
												{arancel.arancel}
											</option>
										))}
									</select>
									{errors.arancel_id && (
										<span className="row text-danger m-1">
											El campo es requerido
										</span>
									)}
								</div>
							)}
						</div>
					</div>
					<div className="card-footer text-muted">
						<div className="row d-flex justify-content-end">
							<button
								type="button"
								className="btn btn-secondary col-md-2 mx-2"
								onClick={handleCancelar}>
								Cancelar
							</button>
							<button
								type="submit"
								className="btn btn-primary col-md-2 mx-2">
								Guardar
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CargarPagosTab;

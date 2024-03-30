import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";

const CargarPagosTab = ({ profesionalId }) => {
	const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
	const [mediosDePago, setMediosDePago] = useState([]);

	// const [cuotas, setCuotas] = useState([]);
	const [selectedCuota, setSelectedCuota] = useState("");
	const [cuotasGeneradas, setCuotasGeneradas] = useState([]);

	const user = JSON.parse(localStorage.getItem("user"));

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

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

	useEffect(() => {
		fetchMediosDePago();
	}, []);

	useEffect(() => {
		fetchCuotasGeneradas();
	}, [profesionalId]);

	const onSubmitCargarPago = async (data) => {
		// Agregar el campo tipo_operacion con el valor "INGRESO"
		const newData = {
			...data,
			tipo_operacion: "INGRESO",
			user_id: user.id,
			profesional_id: profesionalId,
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

			// Asignar el ID del movimiento al campo movimiento_id de la cuota seleccionada
			if (selectedCuota) {
				await asignarMovimientoACuota(selectedCuota, response.data.id);
			}
			
			// Resetear el formulario después de guardar los cambios
			reset();
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
		console.log("movimientoId:", movimientoId, " / cuotaId:", cuotaId);
		try {
			const endpoint = `http://localhost:5000/api/profesionales/asignar-movimiento-a-cuota/`;
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

			if (response) {
				console.log("Asignación exitosa");
			} else {
				console.error(
					"Error al asignar movimiento a cuota: ",
					response.statusText
				);
			}
		} catch (error) {
			console.error("Error al asignar movimiento a cuota: ", error);
		}
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setArchivoSeleccionado(file);
	};

	useEffect(() => {
		if (profesionalId) {
			fetchCuotasGeneradas(profesionalId);
		}
	}, [profesionalId]);
	
	const fetchCuotasGeneradas = async (profesionalId) => {
		try {
			const endpoint = `http://localhost:5000/api/profesionales/cuotas-generadas-profesional/${profesionalId}`;
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
		try {
			const endpoint = `http://localhost:5000/api/cuotas/${cuotaId}`;
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

	return (
		<div className="container-fluid">
			<form id="cargar-pago" onSubmit={handleSubmit(onSubmitCargarPago)}>
				{/* user_id obtenido del localStorage */}
				<input
					type="hidden"
					{...register("user_id")}
					value={localStorage.getItem("user_id") || ""}
				/>
				<div className="row mt-2">
					{/* fecha */}
					<div className="col">
						<label htmlFor="fecha">Fecha:</label>
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
								Este campo es requerido
							</span>
						)}
					</div>
					{/* importe */}
					<div className="col">
						<label htmlFor="importe">Importe:</label>
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
								Este campo es requerido
							</span>
						)}
					</div>
					{/* medio_id */}
					<div className="col">
						<label htmlFor="medio_id">Medio:</label>
						<select
							className="form-select"
							id="medio_id"
							{...register("medio_id", { required: true })}>
							<option value="">Selecciona un medio</option>
							{mediosDePago.map((medio) => (
								<option key={medio.id} value={medio.id}>
									{medio.medio}
								</option>
							))}
						</select>
						{errors.medio_id?.type === "required" && (
							<span className="row text-danger m-1">
								Este campo es requerido
							</span>
						)}
					</div>
				</div>
				<div className="row mt-2">
					{/* concepto */}
					<div className="col">
						<label htmlFor="concepto">Concepto:</label>
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
								Este campo es requerido
							</span>
						)}
					</div>

					{/* comprobante */}
					<div className="col">
						<label htmlFor="comprobante">Comprobante:</label>
						<input
							type="file"
							className="form-control"
							id="comprobante"
							onChange={handleFileChange}
						/>
						{archivoSeleccionado && (
							<img
								src={URL.createObjectURL(archivoSeleccionado)}
								alt="Vista previa"
							/>
						)}
					</div>
					<div className="row mt-2">
						{/* cuotas generadas para asignar al pago */}
						<div className="col-6">
							<label htmlFor="cuotas">Asignar Pago a Cuota</label>
							<select
								className="form-select"
								id="cuotasGeneradas"
								onChange={(e) =>
									setSelectedCuota(e.target.value)
								}
								value={selectedCuota}
								{...register("cuotasGeneradas")}>
								<option value="">Seleccione una Cuota</option>
								{cuotasGeneradas.map((cuotaGenerada) => (
									<option
										key={cuotaGenerada.id}
										value={cuotaGenerada.id}>
										{cuotaGenerada.cuota}
									</option>
								))}
							</select>
							{errors.concepto?.type === "required" && (
								<span className="row text-danger m-1">
									Este campo es requerido
								</span>
							)}
						</div>
					</div>
				</div>
				<div className="my-4 border-top border-secondary border-opacity-25">
					<div className="row mt-3 mb-0 d-flex justify-content-end">
						<button
							type="submit"
							className="btn btn-primary col-md-2 mx-2">
							Guardar
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default CargarPagosTab;
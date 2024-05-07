import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import { useForm } from "react-hook-form";

const PagosModal = ({ showModal, closeModal, data, modalMode }) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm();

	const user = JSON.parse(localStorage.getItem("user")) || {};
	const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
	const [mediosDePago, setMediosDePago] = useState([]);
	const [selectedMedioId, setSelectedMedioId] = useState("");
	const [selectedMedio, setSelectedMedio] = useState("");

	// DEFINE EL TITULO DEL MODAL
	let modalTitle = "";
	if (modalMode === "mostrar") {
		modalTitle = "Mostrar Pago";
	} else if (modalMode === "editar") {
		modalTitle = "Editar Pago";
	} else if (modalMode === "agregar") {
		modalTitle = "Agregar Pago";
	}

	// Obtener la fecha actual
	const getCurrentDate = () => {
		const now = new Date();
		const year = now.getFullYear();
		let month = now.getMonth() + 1;
		let day = now.getDate();
		if (month < 10) month = "0" + month;
		if (day < 10) day = "0" + day;
		return `${year}-${month}-${day}`;
	};

	const fechaActual = getCurrentDate();

useEffect(() => {
	if (data) {
		reset(data);
		// Busca el medio de pago correspondiente en la lista de medios de pago
		const medioSeleccionado = mediosDePago.find(
			(medio) => medio.id === data.medio_id
		);
		// Si se encuentra el medio de pago correspondiente, establece su ID como el valor seleccionado
		if (medioSeleccionado) {
			setSelectedMedioId(medioSeleccionado.id);
			setSelectedMedio(medioSeleccionado);
		}
	}
}, [data, reset, mediosDePago]);

	const initialState = {
		fecha: fechaActual,
		importe: "",
		medio_id: "",
		concepto: "",
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
		if (modalMode === "agregar") {
			reset(initialState);
		} else if (data) {
			if (data.fecha == "0000-00-00") {
				data.fecha = "";
			}
			if (data.fecha_cierre == "0000-00-00") {
				data.fecha_cierre = "";
			}
			reset(data);
		}
	}, [modalMode, data]);

	const onSubmit = async (formData, id) => {
		const newData = {
			...formData,
			user_id: user.id,
			tipo_operacion: "EGRESO",
		};

		try {
			const endpoint = "http://localhost:5000/api/movimientos/";
			const direction = newData.id ? `${newData.id}` : "";
			const method = newData.id ? "PUT" : "POST";
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

			if (response.data) {
				Swal.fire({
					icon: "success",
					title: "Operación exitosa!",
					text: "Registro guardado exitosamente.",
					showConfirmButton: false,
					timer: 2500,
				});

				// CERRAR MODAL
				setTimeout(() => {
					closeModal();
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

	useEffect(() => {
		fetchMediosDePago();
	}, []);

	// const handleFileChange = (event) => {
	// 	const file = event.target.files[0];
	// 	setArchivoSeleccionado(file);
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
				<div className="modal-content bg-secondary">
					<div className="modal-header bg-primary">
						<h5 className="modal-title">{modalTitle}</h5>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={closeModal}></button>
					</div>
					<form id="cargar-pago" onSubmit={handleSubmit(onSubmit)}>
						<div className="modal-body">
							<div className="container-fluid">
								<div className="row mt-2">
									{/* FECHA */}
									<div className="col">
										<label htmlFor="fecha">
											Fecha
											{modalMode !== "mostrar" && (
												<span className="text-warning">
													{" "}
													*
												</span>
											)}
										</label>
										<input
											type="date"
											id="fecha"
											className="form-control"
											readOnly={modalMode === "mostrar"}
											defaultValue={
												modalMode === "agregar"
													? getCurrentDate()
													: data && data.fecha
											}
											{...register("fecha", {
												required: true,
											})}
										/>
										{errors.fecha?.type === "required" && (
											<span className="row text-warning m-1">
												El campo es requerido
											</span>
										)}
									</div>
									{/* IMPORTE */}
									<div className="col">
										<label htmlFor="importe">
											Importe
											{modalMode !== "mostrar" && (
												<span className="text-warning">
													{" "}
													*
												</span>
											)}
										</label>
										<input
											type="text"
											id="importe"
											className="form-control"
											readOnly={modalMode === "mostrar"}
											{...register("importe", {
												required: true,
												pattern: {
													value: /^\d+(\.\d{1,2})?$/,
													message:
														"Ingrese un número decimal válido",
												},
											})}
										/>
										{errors.importe?.type ===
											"required" && (
											<span className="row text-warning m-1">
												El campo es requerido
											</span>
										)}
									</div>
								</div>
								<div className="row mt-2">
									{/* MEDIO DE PAGO */}
									<div className="col-6">
										<label htmlFor="medio_id">
											Medio de Pago
											{modalMode !== "mostrar" && (
												<span className="text-warning">
													{" "}
													*
												</span>
											)}
										</label>
										<select
											className="form-select"
											disabled={modalMode === "mostrar"}
											id="medio_id"
											{...register("medio_id", {
												required: true,
											})}>
											<option value="">
												Selecciona un medio
											</option>
											{mediosDePago.map((medio) => (
												<option
													key={medio.id}
													value={medio.id}>
													{medio.medio}
												</option>
											))}
										</select>
										{errors.medio_id?.type ===
											"required" && (
											<span className="row text-warning m-1">
												El campo es requerido
											</span>
										)}
									</div>
									{/* CONCEPTO */}
									<div className="col-6">
										<label htmlFor="concepto">
											Concepto
											{modalMode !== "mostrar" && (
												<span className="text-warning">
													{" "}
													*
												</span>
											)}
										</label>
										<input
											type="text"
											className="form-control"
											id="concepto"
											readOnly={modalMode === "mostrar"}
											{...register("concepto", {
												required: true,
											})}
										/>
										{errors.concepto?.type ===
											"required" && (
											<span className="row text-warning m-1">
												El campo es requerido
											</span>
										)}
									</div>
								</div>
							</div>
						</div>
						<div
							className="modal-footer bg-dark"
							// LO MUESTRA SI ESTA EDITANDO O AGREGANDO REGISTROS
							style={{
								display: modalMode != "mostrar" ? "" : "none",
							}}>
							<button
								type="button"
								className="btn btn-secondary col-md-2"
								onClick={closeModal}>
								<i className="fa-solid fa-ban me-2"></i>
								Cancelar
							</button>
							<button
								type="submit"
								className="btn btn-primary col-md-2">
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
export default PagosModal;

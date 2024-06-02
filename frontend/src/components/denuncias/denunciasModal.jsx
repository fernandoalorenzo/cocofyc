import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import { useForm } from "react-hook-form";

const DenunciasModal = ({
	showModal,
	closeModal,
	data,
	modalMode,
	API_ENDPOINT,
}) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm();

	const user = JSON.parse(localStorage.getItem("user")) || {};
	const [establecimientos, setEstablecimientos] = useState([]);
	const [establecimientoId, setEstablecimientoId] = useState("");
	const [profesionales, setProfesionales] = useState([]);
	const [profesionalId, setProfesionalId] = useState("");

	// DEFINE EL TITULO DEL MODAL
	let modalTitle = "";
	if (modalMode === "mostrar") {
		modalTitle = "Mostrar Denuncia";
	} else if (modalMode === "editar") {
		modalTitle = "Editar Denuncia";
	} else if (modalMode === "agregar") {
		modalTitle = "Agregar Denuncia";
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

	const fetchProfesionales = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/profesionales/`;
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

			const datos = response.data;
			datos.sort((a, b) => {
				if (a.nombre < b.nombre) {
					return -1;
				}
				if (a.nombre > b.nombre) {
					return 1;
				}
				return 0;
			});
			setProfesionales(datos);
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	const fetchEstablecimientos = async (profesionalId) => {
		try {
			const endpoint = `${API_ENDPOINT}/establecimientos/asignados/${profesionalId}`;
			const method = "GET";
			const headers = {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			};

			const response = await apiConnection(
				endpoint,
				"",
				method,
				false,
				headers
			);

			if (response) {
				const establecimientos = response.sort((a, b) => {
					if (a.establecimiento < b.establecimiento) {
						return -1;
					}
					if (a.establecimiento > b.establecimiento) {
						return 1;
					}
					return 0;
				});
				setEstablecimientos(establecimientos);
				return establecimientos;
			}
			return []; // Devolver una lista vacía si no hay datos
		} catch (error) {
			console.error("Error fetching establecimientos:", error.message);
			throw error;
		}
	};

	useEffect(() => {
		if (profesionalId) {
			fetchEstablecimientos(profesionalId);
		}
	}, [profesionalId]);

	useEffect(() => {
		if (data) {
			fetchEstablecimientos(data.profesional_id);
			reset(data);
		}
	}, [data, reset]);

	const initialState = {
		fecha: fechaActual,
		nro_acta: "",
		profesional_id: "",
		establecimiento_id: "",
		infraccion: "",
		comentario: "",
		fecha_cierre: null,
	};

	useEffect(() => {
		if (modalMode === "agregar") {
			reset(initialState);
			setEstablecimientoId("");
		} else if (data) {
			if (data.fecha == "0000-00-00") {
				data.fecha = "";
			}
			if (data.fecha_cierre == "0000-00-00") {
				data.fecha_cierre = "";
			}
			reset(data);
		}
		if (modalMode !== "agregar" && data && data.establecimiento_id) {
			fetchEstablecimientos(data.profesional_id)
				.then((establecimientos) => {
					if (establecimientos) {
						const establecimientoSeleccionado =
							establecimientos.find(
								(establecimiento) =>
									establecimiento.id ===
									data.establecimiento_id
							);
						if (establecimientoSeleccionado) {
							setEstablecimientoId(data.establecimiento_id);
						}
						setEstablecimientos(establecimientos);
					}
				})
				.catch((error) => {
					console.error("Error fetching establecimientos:", error);
				});
		}
	}, [modalMode, data]);

	const onSubmit = async (formData, id) => {
		const newData = {
			...formData,
			user_id: user.id,
		};
		try {
			const endpoint = `${API_ENDPOINT}/denuncias/`;
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
		fetchProfesionales();
	}, []);

	useEffect(() => {
		if (data && data.establecimiento_id) {
			fetchEstablecimientos(data.profesional_id)
				.then((establecimientos) => {
					const establecimientoSeleccionado = establecimientos.find(
						(establecimiento) =>
							establecimiento.id === data.establecimiento_id
					);
					if (establecimientoSeleccionado) {
						setEstablecimientoId(data.establecimiento_id);
					}
				})
				.catch((error) => {
					console.error("Error fetching establecimientos:", error);
				});
		}
	}, [data]);

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
									{/* Nº ACTA */}
									<div className="col">
										<label htmlFor="nro_acta">
											Nº de Acta
											{modalMode !== "mostrar" && (
												<span className="text-warning">
													*
												</span>
											)}
										</label>
										<input
											type="text"
											id="nro_acta"
											className="form-control"
											readOnly={modalMode === "mostrar"}
											{...register("nro_acta", {
												required: true,
											})}
										/>
										{errors.nro_acta?.type ===
											"required" && (
											<span className="row text-warning m-1">
												Campo requerido
											</span>
										)}
									</div>
									{/* PROFESIONAL */}
									<div className="col-3">
										<label htmlFor="profesional_id">
											Profesional
											{modalMode !== "mostrar" && (
												<span className="text-warning">
													*
												</span>
											)}
										</label>
										<select
											className="form-select"
											disabled={modalMode === "mostrar"}
											id="profesional_id"
											{...register("profesional_id", {
												required: true,
											})}
											onChange={(e) =>
												setProfesionalId(e.target.value)
											}>
											<option value="">
												Selecciona un profesional
											</option>
											{profesionales.map(
												(profesional) => (
													<option
														key={profesional.id}
														value={profesional.id}>
														{profesional.nombre}
													</option>
												)
											)}
										</select>
										{errors.profesional_id?.type ===
											"required" && (
											<span className="row text-warning m-1">
												El campo es requerido
											</span>
										)}
									</div>
									{/* ESTABLECIMIENTO */}
									<div className="col-3">
										<label htmlFor="establecimiento_id">
											Establecimiento
										</label>
										<select
											className="form-select"
											disabled={modalMode === "mostrar"}
											id="establecimiento_id"
											{...register("establecimiento_id")}
											value={establecimientoId}
											onChange={(e) =>
												setEstablecimientoId(
													e.target.value
												)
											}>
											<option value="">
												Selecciona un establecimiento
											</option>
											{establecimientos.map(
												(establecimiento) => (
													<option
														key={establecimiento.id}
														value={
															establecimiento.id
														}>
														{
															establecimiento.establecimiento
														}
													</option>
												)
											)}
										</select>
									</div>
									{/* FECHA DE CIERRE */}
									<div className="col">
										<label htmlFor="fecha">
											Fecha de Cierre
										</label>
										<input
											type="date"
											id="fecha_cierre"
											className="form-control"
											readOnly={modalMode === "mostrar"}
											{...register("fecha_cierre")}
										/>
									</div>
								</div>
								<div className="row mt-2">
									{/* INFRACCION */}
									<div className="col">
										<label htmlFor="infraccion">
											Infracción
											{modalMode !== "mostrar" && (
												<span className="text-warning">
													*
												</span>
											)}
										</label>
										<textarea
											className="form-control"
											readOnly={modalMode === "mostrar"}
											id="infraccion"
											rows="3"
											{...register("infraccion", {
												required: true,
											})}></textarea>
										{errors.infraccion?.type ===
											"required" && (
											<span className="row text-warning m-1">
												El campo es requerido
											</span>
										)}
									</div>
									{/* COMENTARIO */}
									<div className="col">
										<label htmlFor="comentario">
											Comentario
										</label>
										<textarea
											className="form-control"
											readOnly={modalMode === "mostrar"}
											id="comentario"
											rows="3"
											{...register(
												"comentario"
											)}></textarea>
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
export default DenunciasModal;

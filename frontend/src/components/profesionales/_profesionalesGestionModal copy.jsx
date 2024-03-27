import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import EstablecimientosTab from "./profesionalesEstablecimientosTab";
import CargarPagosTab from "./profesionalesPagosTab";
import MovimientosTab from "./profesionalesMovimientosTab";

const GestionesModal = ({ showModal, closeModal, data }) => {
	const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
	const [profesionalId, setProfesionalId] = useState(null);
	const [activeTab, setActiveTab] = useState("cargarPago");

	const handleTabChange = (tabId) => {
		setActiveTab(tabId);
	};

	useEffect(() => {
		if (showModal) {
			// Establecer la pestaña por defecto como "cargarPago" cuando showModal sea true
			setActiveTab("cargarPago");
		}
	}, [showModal]);

	const user = JSON.parse(localStorage.getItem("user"));

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmitCargarPago = async (data) => {
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

	useEffect(() => {
		if (data) {
			setProfesionalId(data.id);
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
				<div className="modal-content">
					<div className="modal-header bg-primary">
						<h5 className="modal-title">
							Gestión de
							{data && data.nombre ? (
								<span>
									{" "}
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
						<ul
							className="nav nav-tabs bg-secondary-subtle"
							id="myTab"
							role="tablist">
							{/********************** CARGAR PAGO **********************/}
							<li className="nav-item" role="presentation">
								<button
									className={`nav-link ${
										activeTab === "cargarPago"
											? "active"
											: ""
									}`}
									onClick={() =>
										handleTabChange("cargarPago")
									}
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
							{/********************** MOVIMIENTOS **********************/}
							<li className="nav-item" role="presentation">
								<button
									className={`nav-link ${
										activeTab === "movimientos"
											? "active"
											: ""
									}`}
									onClick={() =>
										handleTabChange("movimientos")
									}
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
							{/********************** ASIGNAR ESTABLECIMIENTOS **********************/}
							<li className="nav-item" role="presentation">
								<button
									className={`nav-link ${
										activeTab === "establecimientos"
											? "active"
											: ""
									}`}
									onClick={() =>
										handleTabChange("establecimientos")
									}
									id="establecimientos-tab"
									data-bs-toggle="tab"
									data-bs-target="#establecimientos"
									type="button"
									role="tab"
									aria-controls="establecimientos"
									aria-selected="true">
									Establecimientos
								</button>
							</li>
							{/********************** GENERAR CUOTA **********************/}
							<li className="nav-item" role="presentation">
								<button
									className={`nav-link ${
										activeTab === "generarCuota"
											? "active"
											: ""
									}`}
									onClick={() =>
										handleTabChange("generarCuota")
									}
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
							{/********************** CUOTAS PENDIENTES **********************/}
							<li className="nav-item" role="presentation">
								<button
									className={`nav-link ${
										activeTab === "cuotasPendientes"
											? "active"
											: ""
									}`}
									onClick={() =>
										handleTabChange("cuotasPendientes")
									}
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
							{/********************** DENUNCIAS **********************/}
							<li className="nav-item" role="presentation">
								<button
									className={`nav-link ${
										activeTab === "denuncias"
											? "active"
											: ""
									}`}
									onClick={() => handleTabChange("denuncias")}
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
								// className="tab-pane fade show active bg-dark-subtle p-2"
								className={`tab-pane fade ${
									activeTab === "cargarPago"
										? "show active"
										: ""
								}`}
								id="cargarPago"
								role="tabpanel"
								aria-labelledby="cargarPago-tab">
								<CargarPagosTab profesionalId={profesionalId} />
							</div>
							{/* ********************* ASIGNAR ESTABLECIMIENTOS ********************* */}
							<div
								// className="tab-pane fade bg-dark-subtle p-2"
								className={`tab-pane fade ${
									activeTab === "establecimientos"
										? "show active"
										: ""
								}`}
								id="establecimientos"
								role="tabpanel"
								aria-labelledby="establecimientos-tab">
								<EstablecimientosTab
									profesionalId={profesionalId}
								/>
							</div>
							{/* ********************* GENERAR CUOTA ********************* */}
							<div
								// className="tab-pane fade"
								className={`tab-pane fade ${
									activeTab === "generarCuota"
										? "show active"
										: ""
								}`}
								id="generarCuota"
								role="tabpanel"
								aria-labelledby="generarCuota-tab">
								<p>Generar cuota</p>
							</div>
							{/* ********************* CUOTAS PENDIENTES ********************* */}
							<div
								// className="tab-pane fade"
								className={`tab-pane fade ${
									activeTab === "cuotasPendientes"
										? "show active"
										: ""
								}`}
								id="cuotasPendientes"
								role="tabpanel"
								aria-labelledby="cuotasPendientes-tab">
								<p>Cuotas pendientes</p>
							</div>
							{/* ********************* MOVIMIENTOS ********************* */}
							<div
								// className="tab-pane fade"
								className={`tab-pane fade ${
									activeTab === "movimientos"
										? "show active"
										: ""
								}`}
								id="movimientos"
								role="tabpanel"
								aria-labelledby="movimientos-tab">
								<MovimientosTab
									profesionalId={profesionalId}
									onTabChange={handleTabChange}
								/>
							</div>
							{/* ********************* DENUNCIAS ********************* */}
							<div
								// className="tab-pane fade"
								className={`tab-pane fade ${
									activeTab === "denuncias"
										? "show active"
										: ""
								}`}
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
import React, { useState, useEffect, useMemo, useRef } from "react";
import CargarPagosTab from "./tabProfesionalesPagos";
import MovimientosTab from "./tabProfesionalesMovimientos";
import EstablecimientosTab from "./tabProfesionalesEstablecimientos.jsx";
import GenerarCuotaTab from "./tabProfesionalesCuotas.jsx";

const GestionesModal = ({ showModal, closeModal, data, movimientos, fetchMovimientos, API_ENDPOINT }) => {
	const profesionalId = data ? data.id : null;
	const [activeTab, setActiveTab] = useState("cargarPago"); // Estado local para controlar la pestaña activa
	const user = JSON.parse(localStorage.getItem("user")) || {};
	const [cardBodyFormToggle, setCardBodyFormToggle] = useState(false);
	const [isBotonAgregarEnabled, setIsBotonAgregarEnabled] = useState(true);

	useEffect(() => {
		if (showModal) {
			// Cuando el modal se muestra, establece la pestaña "Cargar Pago" como activa
			setActiveTab("cargarPago");
		}
	}, [showModal]);

	const handleTabChange = (tabId) => {
		setActiveTab(tabId); // Función para cambiar la pestaña activa
	};

	const updateMovimientos = () => {
		// Actualizar los movimientos, por ejemplo, volviendo a llamar a fetchMovimientos
		fetchMovimientos(data);
	};

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
									aria-controls="cargarPago">
									Cargar Pago
								</button>
							</li>
							{/********************** GENERAR CUOTA **********************/}
							<li className="nav-item" role="presentation">
								<button
									className={`nav-link ${
										activeTab === "generar-cuota"
											? "active"
											: ""
									}`}
									onClick={() =>
										handleTabChange("generar-cuota")
									}
									id="generar-cuota-tab"
									data-bs-toggle="tab"
									data-bs-target="#generar-cuota"
									type="button"
									role="tab"
									aria-controls="generar-cuota">
									Cuotas
								</button>
							</li>
							{/********************** ESTABLECIMIENTOS **********************/}
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
									aria-controls="establecimientos">
									Establecimientos
								</button>
							</li>
						</ul>
						{/* ********************* CONTENIDO ********************* */}
						<div className="tab-content" id="myTabContent">
							{/* ********************* PAGOS ********************* */}
							<div
								className={`tab-pane fade ${
									activeTab === "cargarPago"
										? "show active"
										: ""
								} bg-dark-subtle p-2`}
								id="cargarPago"
								role="tabpanel"
								aria-labelledby="cargarPago-tab">
								<div className="card">
									<div
										className="card-header bg-white"
										hidden={cardBodyFormToggle}>
										<div className="justify-content-end text-end d-flex">
											<button
												type="button"
												className="btn btn-primary"
												id="abrirModalAgregar"
												disabled={
													!isBotonAgregarEnabled
												}
												onClick={() => {
													setCardBodyFormToggle(true);
												}}>
												<i className="fa-regular fa-square-plus"></i>{" "}
												Agregar
											</button>
										</div>
									</div>
									<div
										className="card-body"
										id="cardBodyForm"
										hidden={!cardBodyFormToggle}>
										<CargarPagosTab
											profesionalId={profesionalId}
											toggleCardBodyForm={
												setCardBodyFormToggle
											}
											updateMovimientos={
												updateMovimientos
											} // Pasamos la función de actualización como prop
											API_ENDPOINT={API_ENDPOINT}
											/>
									</div>
									<div
										className="card-body"
										id="cardBodyForm"
										hidden={cardBodyFormToggle}>
										<MovimientosTab
											profesionalId={profesionalId}
											data={data}
											movimientos={movimientos}
											API_ENDPOINT={API_ENDPOINT}
										/>
									</div>
								</div>
							</div>
							{/* ********************* GENERAR CUOTA ********************* */}
							<div
								className={`tab-pane fade ${
									activeTab === "generar-cuota"
										? "show active"
										: ""
								} bg-dark-subtle p-2`}
								id="generar-cuota"
								role="tabpanel"
								aria-labelledby="generar-cuota-tab">
								<GenerarCuotaTab
									profesionalId={profesionalId}
									userId={user.id}
									API_ENDPOINT={API_ENDPOINT}
								/>
							</div>
							{/* ********************* ESTABLECIMIENTOS ********************* */}
							<div
								className={`tab-pane fade ${
									activeTab === "establecimientos"
										? "show active"
										: ""
								} bg-dark-subtle p-2`}
								id="establecimientos"
								role="tabpanel"
								aria-labelledby="establecimientos-tab">
								<EstablecimientosTab
									profesionalId={profesionalId}
									API_ENDPOINT={API_ENDPOINT}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GestionesModal;

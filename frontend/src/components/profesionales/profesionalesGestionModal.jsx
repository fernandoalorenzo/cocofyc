import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import CargarPagosTab from "./tabProfesionalesPagos";
import MovimientosTab from "./tabProfesionalesMovimientos";
import EstablecimientosTab from "./tabProfesionalesEstablecimientos.jsx";
import GenerarCuotaTab from "./tabProfesionalesCuotas.jsx";
import DenunciasTab from "./tabProfesionalesDenuncias.jsx";

const GestionesModal = ({ showModal, closeModal, data, movimientos }) => {
	const profesionalId = data ? data.id : null;
	const [activeTab, setActiveTab] = useState("cargarPago"); // Estado local para controlar la pestaña activa
	const user = JSON.parse(localStorage.getItem("user")) || {};

	useEffect(() => {
		if (showModal) {
			// Cuando el modal se muestra, establece la pestaña "Cargar Pago" como activa
			setActiveTab("cargarPago");
		}
	}, [showModal]);

	const handleTabChange = (tabId) => {
		setActiveTab(tabId); // Función para cambiar la pestaña activa
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
									aria-controls="movimientos">
									Pagos
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
									aria-controls="establecimientos">
									Denuncias
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
								<CargarPagosTab profesionalId={profesionalId} />
							</div>
							{/* ********************* MOVIMIENTOS ********************* */}
							<div
								className={`tab-pane fade ${
									activeTab === "movimientos"
										? "show active"
										: ""
								} bg-dark-subtle p-2`}
								id="movimientos"
								role="tabpanel"
								aria-labelledby="movimientos-tab">
								<MovimientosTab
									profesionalId={profesionalId}
									movimientos={movimientos}
								/>
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
								/>
							</div>
							{/* ********************* DENUNCIAS ********************* */}
							<div
								className={`tab-pane fade ${
									activeTab === "denuncias"
										? "show active"
										: ""
								} bg-dark-subtle p-2`}
								id="denuncias"
								role="tabpanel"
								aria-labelledby="denuncias-tab">
								<DenunciasTab
									profesionalId={profesionalId}
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

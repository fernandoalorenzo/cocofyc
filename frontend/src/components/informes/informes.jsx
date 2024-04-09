import React, { useState } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import ProfesionalesActivosReport from "./profesionales/profesionalesActivosReport";
import ProfesionalesMatriculadosReport from "./profesionales/profesionalesMatriculadosReport";
import ProfesionalesMorososReport from "./profesionales/profesionalesMorososReport";
import ProfesionalesInactivosReport from "./profesionales/profesionalesInactivosReport";
import ProfesionalesAlDiaReport from "./profesionales/profesionalesAlDiaReport";
import ProfesionalesSinMatricularReport from "./profesionales/profesionalesSinMatricularReport";

const Informes = () => {
	const [showInforme, setShowInforme] = useState(false);
	const [nombreInforme, setNombreInforme] = useState("");
	const [informeComponent, setInformeComponent] = useState(null);

	const handleGenerateReport = (nombreInforme, componenteInforme) => {
		setNombreInforme(nombreInforme);
		setInformeComponent(
			React.cloneElement(componenteInforme, { nombreInforme })
		); // Pasar nombreInforme como una prop al componente

		setShowInforme(true);
	};

	const renderInforme = () => {
		if (showInforme && informeComponent) {
			return (
				<div className="card" id="card-profesionales-report">
					<div className="card-body">
						<PDFViewer
							style={{
								width: "100%",
								height: "350px",
							}}
							showToolbar={false}>
							{informeComponent}
						</PDFViewer>
					</div>
					<div className="card-footer">
						<PDFDownloadLink
							document={informeComponent}
							fileName={`${nombreInforme}.pdf`}
							className="btn btn-danger">
							{({ loading }) =>
								loading ? (
									"Generando PDF..."
								) : (
									<>
										<i className="far fa-file-pdf" />{" "}
										Descargar
									</>
								)
							}
						</PDFDownloadLink>
					</div>
				</div>
			);
		}
		return null;
	};

	return (
		<>
			<div className="content-wrapper">
				<div className="content-header">
					<div className="container-fluid container-md w-75">
						<div className="row mb-1">
							<div className="col-sm-6">
								<h1 className="m-0 ">Informes</h1>
							</div>
						</div>
					</div>
				</div>
				<div className="container-fluid container-md pb-3 w-75">
					<div className="card">
						<div className="card-header text-start bg-secondary fst-italic">
							<strong>Rango de fechas</strong>
						</div>
						<div className="card-body">
							<div className="row">
								<div className="col-sm-2">
									<label htmlFor="fechaDesde">
										Fecha desde
									</label>
									<input
										type="date"
										id="fechaDesde"
										className="form-control"
										placeholder="Fecha inicial"
									/>
								</div>
								<div className="col-sm-2">
									<label htmlFor="fechaHasta">
										Fecha hasta
									</label>
									<input
										type="date"
										id="fechaHasta"
										className="form-control"
										placeholder="Fecha final"
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="card">
						<div className="card-header text-start bg-secondary fst-italic">
							<strong>Seleccione el Informe</strong>
						</div>
						<div className="card-body">
							{/* <!-- Nav tabs --> */}
							<ul
								className="nav nav-tabs"
								id="myTab"
								role="tablist">
								<li className="nav-item" role="presentation">
									<button
										className="nav-link active"
										id="profesionales-tab"
										data-bs-toggle="tab"
										data-bs-target="#profesionales"
										type="button"
										role="tab"
										aria-controls="profesionales"
										aria-selected="true">
										Profesionales
									</button>
								</li>
								<li className="nav-item" role="presentation">
									<button
										className="nav-link"
										id="profile-tab"
										data-bs-toggle="tab"
										data-bs-target="#profile"
										type="button"
										role="tab"
										aria-controls="profile"
										aria-selected="false">
										Profile
									</button>
								</li>
								<li className="nav-item" role="presentation">
									<button
										className="nav-link"
										id="messages-tab"
										data-bs-toggle="tab"
										data-bs-target="#messages"
										type="button"
										role="tab"
										aria-controls="messages"
										aria-selected="false">
										Messages
									</button>
								</li>
							</ul>

							{/* <!-- Tab panes --> */}
							<div className="tab-content">
								{/* ******************* PROFESIONALES ******************* */}
								<div
									className="tab-pane active"
									id="profesionales"
									role="tabpanel"
									aria-labelledby="profesionales-tab">
									<div className="row my-2 mx-1 border border-1 border-secondary-light rounded p-2 d-flex">
										<div className="col flex-grow-1">
											<button
												type="button"
												className="btn btn-primary w-100"
												onClick={() =>
													handleGenerateReport(
														"Profesionales Activos",
														<ProfesionalesActivosReport />
													)
												}>
												Activos
											</button>
										</div>
										<div className="col flex-grow-1">
											<button
												type="button"
												className="btn btn-primary w-100"
												onClick={() =>
													handleGenerateReport(
														"Profesionales Inactivos",
														<ProfesionalesInactivosReport />
													)
												}>
												Inactivos
											</button>
										</div>
										<div className="col flex-grow-1">
											<button
												type="button"
												className="btn btn-primary w-100"
												onClick={() =>
													handleGenerateReport(
														"Profesionales Matriculados",
														<ProfesionalesMatriculadosReport />
													)
												}>
												Matriculados
											</button>
										</div>
										<div className="col flex-grow-1">
											<button
												type="button"
												className="btn btn-primary w-100"
												onClick={() =>
													handleGenerateReport(
														"Profesionales Sin Matricular",
														<ProfesionalesSinMatricularReport />
													)
												}>
												Sin Matricular
											</button>
										</div>
										<div className="col flex-grow-1">
											<button
												type="button"
												className="btn btn-primary w-100"
												onClick={() =>
													handleGenerateReport(
														"Profesionales Morosos",
														<ProfesionalesMorososReport />
													)
												}>
												Morosos
											</button>
										</div>
										<div className="col flex-grow-1">
											<button
												type="button"
												className="btn btn-primary w-100"
												onClick={() =>
													handleGenerateReport(
														"Profesionales al Día",
														<ProfesionalesAlDiaReport />
													)
												}>
												Al Día
											</button>
										</div>
									</div>
								</div>
								{renderInforme()}
								{/* ******************* DENUNCIAS ******************* */}
								<div
									className="tab-pane"
									id="profile"
									role="tabpanel"
									aria-labelledby="profile-tab">
									profile
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Informes;

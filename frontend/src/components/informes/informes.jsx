import React, { useState } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import ProfesionalesActivosReport from "./profesionalesActivosReport";
import ProfesionalesMatriculadosReport from "./profesionalesMatriculadosReport";
import ProfesionalesMorososReport from "./profesionalesMorososReport";

const Informes = () => {
	const [showInforme, setShowInforme] = useState(false);
	const [nombreInforme, setNombreInforme] = useState("");

	const handleGenerateReport = (nombreInforme) => {
		setNombreInforme(nombreInforme);
		setShowInforme(true);
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
									<div className="row my-2 mx-1 border border-1 border-secondary-light rounded p-2">
										<div className="col">
											<button
												type="button"
												className="btn btn-primary"
												onClick={() =>
													handleGenerateReport(
														"Profesionales Activos"
													)
												}>
												Activos
											</button>
										</div>
										<div className="col">
											<button
												type="button"
												className="btn btn-primary"
												onClick={() =>
													handleGenerateReport(
														"Profesionales Matriculados"
													)
												}>
												Matriculados
											</button>
										</div>
										<div className="col">
											<button
												type="button"
												className="btn btn-primary"
												onClick={() =>
													handleGenerateReport(
														"Profesionales Morosos"
													)
												}>
												Morosos
											</button>
										</div>
									</div>
									{showInforme &&
										nombreInforme ==
											"Profesionales Activos" && (
											<div
												className="card"
												id="card-profesionales-report">
												<div className="card-body">
													<PDFViewer
														style={{
															width: "100%",
															height: "200px",
														}}
														showToolbar={false}>
														<ProfesionalesActivosReport
															nombreInforme={
																nombreInforme
															}
														/>
													</PDFViewer>
												</div>
												<div className="card-footer">
													<PDFDownloadLink
														document={
															<ProfesionalesActivosReport
																nombreInforme={
																	nombreInforme
																}
															/>
														}
														fileName={`${nombreInforme}.pdf`}
														className="btn btn-danger">
														{({
															blob,
															url,
															loading,
															error,
														}) =>
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
										)}
									{showInforme &&
										nombreInforme ==
											"Profesionales Matriculados" && (
											<div
												className="card"
												id="card-profesionales-report">
												<div className="card-body">
													<PDFViewer
														style={{
															width: "100%",
															height: "200px",
														}}
														showToolbar={false}>
														<ProfesionalesMatriculadosReport
															nombreInforme={
																nombreInforme
															}
														/>
													</PDFViewer>
												</div>
												<div className="card-footer">
													<PDFDownloadLink
														document={
															<ProfesionalesMatriculadosReport
																nombreInforme={
																	nombreInforme
																}
															/>
														}
														fileName={`${nombreInforme}.pdf`}
														className="btn btn-danger">
														{({
															blob,
															url,
															loading,
															error,
														}) =>
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
										)}
									{showInforme &&
										nombreInforme ==
											"Profesionales Morosos" && (
											<div
												className="card"
												id="card-profesionales-report">
												<div className="card-body">
													<PDFViewer
														style={{
															width: "100%",
															height: "200px",
														}}
														showToolbar={false}>
														<ProfesionalesMorososReport
															nombreInforme={
																nombreInforme
															}
														/>
													</PDFViewer>
												</div>
												<div className="card-footer">
													<PDFDownloadLink
														document={
															<ProfesionalesMorososReport
																nombreInforme={
																	nombreInforme
																}
															/>
														}
														fileName={`${nombreInforme}.pdf`}
														className="btn btn-danger">
														{({
															blob,
															url,
															loading,
															error,
														}) =>
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
										)}
								</div>
								{/* ******************* DENUNCIAS ******************* */}
								<div
									className="tab-pane"
									id="profile"
									role="tabpanel"
									aria-labelledby="profile-tab">
									profile
								</div>
								<div
									className="tab-pane"
									id="messages"
									role="tabpanel"
									aria-labelledby="messages-tab">
									messages
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

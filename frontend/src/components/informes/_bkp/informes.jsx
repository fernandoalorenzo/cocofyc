import React, { useEffect, useState } from "react";
import moment from "moment"; // Importar moment
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import ProfesionalesActivosReport from "./profesionales/profesionalesActivosReport";
import ProfesionalesMatriculadosReport from "./profesionales/profesionalesMatriculadosReport";
import ProfesionalesMorososReport from "./profesionales/profesionalesMorososReport";
import ProfesionalesInactivosReport from "./profesionales/profesionalesInactivosReport";
import ProfesionalesAlDiaReport from "./profesionales/profesionalesAlDiaReport";
import ProfesionalesSinMatricularReport from "./profesionales/profesionalesSinMatricularReport";
import DenunciasActivasReport from "./denuncias/denunciasActivasReport";
import DenunciasActivasPorFechaReport from "./denuncias/denunciasActivasPorFechaReport";

const Informes = () => {
	const [showInforme, setShowInforme] = useState(false);
	const [nombreInforme, setNombreInforme] = useState("");
	const [informeComponent, setInformeComponent] = useState(null);
	const [fechaDesde, setFechaDesde] = useState("");
	const [fechaHasta, setFechaHasta] = useState("");

	useEffect(() => {
		// Establecer las fechas por defecto como el primer y último día del mes actual
		const firstDayOfMonth = moment().startOf("month").format("YYYY-MM-DD");
		const lastDayOfMonth = moment().endOf("month").format("YYYY-MM-DD");
		setFechaDesde(firstDayOfMonth);
		setFechaHasta(lastDayOfMonth);
	}, []);

	// Definir los tabs
	const tabs = [
		{
			id: "profesionales-tab",
			label: "Profesionales",
			target: "#profesionales",
			selected: true,
		},
		{
			id: "denuncias-tab",
			label: "Denuncias",
			target: "#denuncias",
			selected: false,
		},
	];

	// Función para generar los botones
	function generateButton(label, nombreInforme, reportComponent) {
		return (
			<div className="col flex-grow-1">
				<button
					type="button"
					className="btn btn-primary w-100"
					onClick={() =>
						handleGenerateReport(nombreInforme, reportComponent)
					}>
					{label}
				</button>
			</div>
		);
	}

	const handleGenerateReport = (nombreInforme, reportComponent) => {
		setNombreInforme(nombreInforme);
		setInformeComponent(reportComponent);
		setShowInforme(true);
	};

	const renderInforme = () => {
		// Verificar si el informe ha sido generado y el componente del informe no es null
		if (showInforme && informeComponent) {
			return (
				<div className="card" id="card-profesionales-report">
					<div className="card-body p-0">
						<PDFViewer
							style={{
								width: "100%",
								height: "320px",
							}}
							showToolbar={false}>
							{informeComponent}
						</PDFViewer>
					</div>
					<div className="card-footer p-1">
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
		// Si el informe no está generado o el componente es null, no mostrar nada
		return null;
	};

	return (
		<>
			<div className="content-wrapper">
				<div className="content-header pb-0">
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
						<div className="card-body py-1">
							<div className="row justify-content-evenly">
								<div className="col-sm-2 text-center">
									<label
										htmlFor="fechaDesde"
										className="mb-0">
										Fecha desde
									</label>
									<input
										type="date"
										id="fechaDesde"
										className="form-control text-center"
										placeholder="Fecha inicial"
										value={fechaDesde}
										onChange={(e) =>
											setFechaDesde(e.target.value)
										}
									/>
								</div>
								<div className="col-sm-2 text-center">
									<label
										htmlFor="fechaHasta"
										className="mb-0">
										Fecha hasta
									</label>
									<input
										type="date"
										id="fechaHasta"
										className="form-control text-center"
										placeholder="Fecha final"
										value={fechaHasta}
										onChange={(e) =>
											setFechaHasta(e.target.value)
										}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="card">
						<div className="card-header text-start bg-secondary fst-italic">
							<strong>Seleccione el Informe</strong>
						</div>
						<div className="card-body pb-0">
							{/* <!-- Nav tabs --> */}
							<ul
								className="nav nav-tabs"
								id="myTab"
								role="tablist">
								{tabs.map((tab, index) => (
									<li
										key={index}
										className="nav-item"
										role="presentation">
										<button
											className={`nav-link ${
												tab.selected ? "active" : ""
											}`}
											id={tab.id}
											data-bs-toggle="tab"
											data-bs-target={tab.target}
											type="button"
											role="tab"
											aria-controls={tab.target.substring(
												1
											)}
											aria-selected={tab.selected}>
											{tab.label}
										</button>
									</li>
								))}
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
										{generateButton(
											"Activos",
											"Profesionales Activos",
											<ProfesionalesActivosReport />
										)}
										{generateButton(
											"Inactivos",
											"Profesionales Inactivos",
											<ProfesionalesInactivosReport />
										)}
										{generateButton(
											"Matriculados",
											"Profesionales Matriculados",
											<ProfesionalesMatriculadosReport />
										)}
										{generateButton(
											"Sin Matricular",
											"Profesionales Sin Matricular",
											<ProfesionalesSinMatricularReport />
										)}
										{generateButton(
											"Morosos",
											"Profesionales Morosos",
											<ProfesionalesMorososReport />
										)}
										{generateButton(
											"Al Día",
											"Profesionales al Día",
											<ProfesionalesAlDiaReport />
										)}
									</div>
								</div>
								{/* ******************* DENUNCIAS ******************* */}
								<div
									className="tab-pane"
									id="denuncias"
									role="tabpanel"
									aria-labelledby="denuncias-tab">
									<div className="row my-2 mx-1 border border-1 border-secondary-light rounded p-2 d-flex">
										{generateButton(
											"Activas",
											"Denuncias Activas",
											<DenunciasActivasReport />
										)}
										{generateButton(
											"Activas por Fecha",
											"Denuncias Activas por Fecha",
											<DenunciasActivasPorFechaReport
												fechaDesde={fechaDesde}
												fechaHasta={fechaHasta}
											/>
										)}
									</div>
								</div>
								{renderInforme()}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Informes;
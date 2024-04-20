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
import DenunciasProximosSeguimientosReport from "./denuncias/denunciasProximosSeguimientosReport";
import MovimientosPorFechaReport from "./movimientos/MovimientosPorFechaReport";
import PagosRealizadosPorFechaReport from "./movimientos/PagosRealizadosPorFechaReport";
import CobranzasPorFechaReport from "./movimientos/CobranzaPorFechaReport";

const Informes = () => {
	const [showInforme, setShowInforme] = useState(false);
	const [nombreInforme, setNombreInforme] = useState("");
	const [informeComponent, setInformeComponent] = useState(null);
	const [fechaDesde, setFechaDesde] = useState("");
	const [fechaHasta, setFechaHasta] = useState("");
	const [refreshKey, setRefreshKey] = useState(0); // Para detectar click en boton y refrescar componente

	useEffect(() => {
		// Establecer las fechas por defecto como el primer y último día del mes actual
		const firstDayOfMonth = moment().startOf("month").format("YYYY-MM-DD");
		const lastDayOfMonth = moment().endOf("month").format("YYYY-MM-DD");
		setFechaDesde(firstDayOfMonth);
		setFechaHasta(lastDayOfMonth);
	}, []);

	const tabs = [
		{
			id: "profesionales-tab",
			target: "#profesionales",
			label: "Profesionales",
			selected: true,
			reports: [
				{
					label: "Activos",
					reportComponent: <ProfesionalesActivosReport />,
					title: "Profesionales Activos",
				},
				{
					label: "Inactivos",
					reportComponent: <ProfesionalesInactivosReport />,
					title: "Profesionales Inactivos",
				},
				{
					label: "Matriculados",
					reportComponent: <ProfesionalesMatriculadosReport />,
					title: "Profesionales Matriculados",
				},
				{
					label: "Sin Matricular",
					reportComponent: <ProfesionalesSinMatricularReport />,
					title: "Profesionales Sin Matricular",
				},
				{
					label: "Morosos",
					reportComponent: <ProfesionalesMorososReport />,
					title: "Profesionales Morosos",
				},
				{
					label: "Al Día",
					reportComponent: <ProfesionalesAlDiaReport />,
					title: "Profesionales Al Día",
				},
			],
		},
		{
			id: "denuncias-tab",
			target: "#denuncias",
			label: "Denuncias",
			selected: false,
			reports: [
				{
					label: "Activas",
					reportComponent: <DenunciasActivasReport />,
					title: "Denuncias Activas",
				},
				{
					label: "Activas por Fecha",
					reportComponent: (
						<DenunciasActivasPorFechaReport
							fechaDesde={fechaDesde}
							fechaHasta={fechaHasta}
							subtitle={`desde ${moment(fechaDesde).format(
								"DD-MM-YYYY"
							)} al ${moment(fechaHasta).format("DD-MM-YYYY")}`}
						/>
					),
					title: "Denuncias Activas",
				},
				{
					label: "Próx. Seguimientos",
					reportComponent: (
						<DenunciasProximosSeguimientosReport
							fechaDesde={fechaDesde}
							fechaHasta={fechaHasta}
							refreshKey={refreshKey}
							subtitle={`desde ${moment(fechaDesde).format(
								"DD-MM-YYYY"
							)} al ${moment(fechaHasta).format("DD-MM-YYYY")}`}
						/>
					),
					title: "Próximos Seguimientos",
				},
			],
		},
		{
			id: "movimientos-tab",
			target: "#movimientos",
			label: "Movimientos",
			selected: false,
			reports: [
				{
					label: "Movimientos por Fecha",
					reportComponent: (
						<MovimientosPorFechaReport
							fechaDesde={fechaDesde}
							fechaHasta={fechaHasta}
							refreshKey={refreshKey}
							subtitle={`desde ${moment(fechaDesde).format(
								"DD-MM-YYYY"
							)} al ${moment(fechaHasta).format("DD-MM-YYYY")}`}
						/>
					),
					title: "Movimientos",
				},
				{
					label: "Pagos Realizados por fecha",
					reportComponent: (
						<PagosRealizadosPorFechaReport
							fechaDesde={fechaDesde}
							fechaHasta={fechaHasta}
							refreshKey={refreshKey}
							subtitle={`desde ${moment(fechaDesde).format(
								"DD-MM-YYYY"
							)} al ${moment(fechaHasta).format("DD-MM-YYYY")}`}
						/>
					),
					title: "Pagos Realizados",
				},
				{
					label: "Cobranzas por fecha",
					reportComponent: (
						<CobranzasPorFechaReport
							fechaDesde={fechaDesde}
							fechaHasta={fechaHasta}
							refreshKey={refreshKey}
							subtitle={`desde ${moment(fechaDesde).format(
								"DD-MM-YYYY"
							)} al ${moment(fechaHasta).format("DD-MM-YYYY")}`}
						/>
					),
					title: "Cobranzas",
				},
			],
		},
	];

	const handleGenerateReport = (
		nombreInforme,
		componenteInforme,
		props = {}
	) => {
		setRefreshKey((prevKey) => prevKey + 1);
		setNombreInforme(props.title);
		setInformeComponent(
			React.cloneElement(componenteInforme, { ...props, nombreInforme })
		);
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
								height: "300px",
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
								{tabs.map((tab, index) => (
									<div
										key={index}
										className={`tab-pane ${
											tab.selected ? "active" : ""
										}`}
										id={tab.target.substring(1)}
										role="tabpanel"
										aria-labelledby={tab.id}>
										<div className="row my-2 mx-1 border border-1 border-secondary-light rounded p-2 d-flex">
											{tab.reports.map(
												(report, reportIndex) => (
													<div
														key={reportIndex}
														className="col flex-grow-1">
														<button
															type="button"
															className="btn btn-primary w-100"
															onClick={() =>
																handleGenerateReport(
																	report.label,
																	report.reportComponent,
																	{
																		title: report.title,
																	}
																)
															}>
															{report.label}
														</button>
													</div>
												)
											)}
										</div>
									</div>
								))}
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

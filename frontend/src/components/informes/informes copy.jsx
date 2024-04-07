import React, { useState } from "react";
import ProfesionalesActivosReport from "./profesionalesActivosReport";

const Informes = () => {
	const [showInforme, setShowInforme] = useState(false);

	const nombreInforme = "Profesionales Activos";

	const handleGenerateReport = () => {
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
								<div
									className="tab-pane active"
									id="profesionales"
									role="tabpanel"
									aria-labelledby="profesionales-tab">
									<div className="row my-4 mx-1 border border-1 border-secondary-light rounded p-2">
										<div className="col-sm me-3">
											<button
												type="button"
												className="btn btn-primary"
												onClick={handleGenerateReport} // Manejador de eventos para generar el informe al hacer clic en el botón
											>
												Activos
											</button>
										</div>
									</div>
									{showInforme && (
										<div
											className="card"
											id="card-profesionales-report">
											<ProfesionalesActivosReport
												nombreInforme={nombreInforme}
											/>
										</div>
									)}
								</div>
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

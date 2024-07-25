import React, { useState, useEffect, useMemo } from "react";
import apiConnection from "../../../../backend/functions/apiConnection";

const ProfesionalesModal = ({ showModal, closeModal, data, API_ENDPOINT, }) => {
	const [profesionales, setProfesionales] = useState([]);
	const [selectedProfesional, setSelectedProfesional] = useState("");
	const [profesionalesAsignados, setProfesionalesAsignados] = useState(
		[]
	);
	const [profesionalesDisponibles, setProfesionalesDisponibles] =
		useState([]);
	
	const obtenerProfesionalesAsignados = async (establecimientoId) => {
		try {
			const endpoint = `${API_ENDPOINT}/profesionales/profesionales-asignados/`;
			const direction = `${establecimientoId}`;
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

			if (response && Array.isArray(response)) {
				const sortedProfesionalesAsignados = response.sort((a, b) =>
					a.nombre.localeCompare(b.nombre)
				);
				setProfesionalesAsignados(sortedProfesionalesAsignados);
			}
		} catch (error) {
			console.error(
				"Error al obtener profesionales asignados:",
				error
			);
		}
	};

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

			if (response && response.data) {
				// Ordenar los profesionales alfabéticamente por nombre antes de establecer el estado
				const sortedProfesionales = response.data.sort((a, b) =>
					a.nombre.localeCompare(b.nombre)
				);
				setProfesionales(sortedProfesionales);
			} else {
				console.error(
					"Error fetching profesionales: ",
					response.statusText
				);
			}
		} catch (error) {
			console.error("Error fetching profesionales: ", error);
		}
	};

	useEffect(() => {
		setProfesionalesAsignados([]);
	}, [showModal]);

	useEffect(() => {
		if (data) {
			fetchProfesionales();
			obtenerProfesionalesAsignados(data.id);
		} else {
			setProfesionalesAsignados([]);
		}
	}, [data]);

	useEffect(() => {
		// Filtrar los profesionales para excluir aquellos ya asignados
		const disponibles = profesionales.filter(
			(prof) =>
				!profesionalesAsignados.some(
					(asignado) => asignado.id === prof.id
				)
		);
		setProfesionalesDisponibles(disponibles);
	}, [profesionales, profesionalesAsignados]);

	const handleProfesionalChange = (e) => {
		setSelectedProfesional(e.target.value);
	};

	const handleAsignarClick = async () => {
		if (selectedProfesional) {
			try {
				const endpoint = `${API_ENDPOINT}/profesionales/asignar-profesional`;
				const direction = "";
				const method = "POST";
				const headers = {
					"Content-Type": "application/json",
					Authorization: localStorage.getItem("token"),
				};
				const body = {
					establecimientoId: data.id,
					profesionalId: selectedProfesional,
				};

				const response = await apiConnection(
					endpoint,
					direction,
					method,
					body,
					headers
				);

				if (response) {
					obtenerProfesionalesAsignados(data.id);
					setSelectedProfesional("");
				} else {
					console.error(
						"Error al asignar profesional:",
						response.statusText
					);
				}
			} catch (error) {
				console.error("Error al asignar profesional:", error);
			}
		}
	};

	const handleDesvincularClick = async (profesionalId) => {
		try {
			const endpoint = `${API_ENDPOINT}/profesionales/desvincular-profesional/`;
			const direction = `${profesionalId}/${data.id}`;
			const method = "DELETE";
			const headers = {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			};
			const body = "";

			const response = await apiConnection(
				endpoint,
				direction,
				method,
				body,
				headers
			);

			if (response) {
				// Si la desvinculación fue exitosa, actualizar el estado para reflejar los cambios
				obtenerProfesionalesAsignados(data.id);
				setSelectedProfesional(""); // Limpiamos el select
			} else {
				// Manejar errores si la desvinculación no fue exitosa
				console.error("Error al desvincular el profesional");
			}
		} catch (error) {
			console.error("Error de red:", error);
		}
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
				<div className="modal-content bg-light ">
					<div className="modal-header bg-primary">
						<h5 className="modal-title">
							Asignar pofesionales
							{data && data.establecimiento ? (
								<span>
									{" "}
									a{" "}
									<span className="text-warning">
										{data.establecimiento}
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
						<div className="row mb-3 align-items-center">
							<div className="col-6">
								<select
									className="form-select"
									id="profesional"
									onChange={handleProfesionalChange}
									value={selectedProfesional}>
									<option value="">
										Selecciona un profesional
									</option>
									{profesionalesDisponibles.map((prof) => (
										<option key={prof.id} value={prof.id}>
											{prof.nombre}
										</option>
									))}
								</select>
							</div>
							<div className="col-6">
								<button
									type="button"
									className="btn btn-primary btn-sm"
									onClick={handleAsignarClick}>
									<i className="fa-solid fa-link"></i> Asignar
								</button>
							</div>
						</div>
						<div className="row">
							<table className="table table-hover table-striped table-responsive-sm table-sm table-borderless align-middle">
								<thead className="table-dark">
									<tr>
										<th>Nombre</th>
										<th>Domicilio</th>
										<th>Localidad</th>
										<th>Acciones</th>
									</tr>
								</thead>
								<tbody>
									{profesionalesAsignados.map((prof) => (
										<tr
											className="align-items-center align-middle"
											key={prof.id}>
											<td>{prof.nombre}</td>
											<td>{prof.domicilio}</td>
											<td>{prof.localidad}</td>
											<td>
												<button
													type="button"
													className="btn btn-danger btn-sm"
													onClick={() =>
														handleDesvincularClick(
															prof.id
														)
													}>
													<i className="fa-solid fa-link-slash"></i>{" "}
													Desvincular
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfesionalesModal;

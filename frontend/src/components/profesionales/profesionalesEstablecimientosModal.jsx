import React, { useState, useEffect, useMemo } from "react";
import apiConnection from "../../../../backend/functions/apiConnection";

const EstablecimientosModal = ({ showModal, closeModal, data }) => {
	const [establecimientos, setEstablecimientos] = useState([]);
	const [selectedEstablecimiento, setSelectedEstablecimiento] = useState("");
	const [establecimientosAsignados, setEstablecimientosAsignados] = useState(
		[]
	);
	const [establecimientosDisponibles, setEstablecimientosDisponibles] =
		useState([]);
	
	const obtenerEstablecimientosAsignados = async (profesionalId) => {
		try {
			const endpoint =
				"http://localhost:5000/api/establecimientos/asignados/";
			const direction = `${profesionalId}`;
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

			if (response) {
				// Ordenar los establecimientos asignados alfabéticamente por nombre antes de establecer el estado
				const sortedEstablecimientosAsignados = response.sort((a, b) =>
					a.establecimiento.localeCompare(b.establecimiento)
				);
				setEstablecimientosAsignados(sortedEstablecimientosAsignados);
			} else {
				console.error(
					"Error al obtener establecimientos asignados:",
					response.statusText
				);
			}
		} catch (error) {
			console.error(
				"Error al obtener establecimientos asignados:",
				error
			);
		}
	};

	const fetchEstablecimientos = async () => {
		try {
			const endpoint = "http://localhost:5000/api/establecimientos/";
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
				// Ordenar los establecimientos alfabéticamente por nombre antes de establecer el estado
				const sortedEstablecimientos = response.data.sort((a, b) =>
					a.establecimiento.localeCompare(b.establecimiento)
				);
				setEstablecimientos(sortedEstablecimientos);
			} else {
				console.error(
					"Error fetching establecimientos: ",
					response.statusText
				);
			}
		} catch (error) {
			console.error("Error fetching establecimientos: ", error);
		}
	};

	useEffect(() => {
		if (data) {
			fetchEstablecimientos();
			obtenerEstablecimientosAsignados(data.id);
		}
	}, [data]);

	useEffect(() => {
		// Filtrar los establecimientos para excluir aquellos ya asignados
		const disponibles = establecimientos.filter(
			(est) =>
				!establecimientosAsignados.some(
					(asignado) => asignado.id === est.id
				)
		);
		setEstablecimientosDisponibles(disponibles);
	}, [establecimientos, establecimientosAsignados]);

	const handleEstablecimientoChange = (e) => {
		setSelectedEstablecimiento(e.target.value);
	};

	const handleAsignarClick = async () => {
		if (selectedEstablecimiento) {
			try {
				const endpoint =
					"http://localhost:5000/api/establecimientos/asignar-establecimiento";
				const direction = "";
				const method = "POST";
				const headers = {
					"Content-Type": "application/json",
					Authorization: localStorage.getItem("token"),
				};
				const body = {
					profesionalId: data.id,
					establecimientoId: selectedEstablecimiento,
				};

				const response = await apiConnection(
					endpoint,
					direction,
					method,
					body,
					headers
				);

				if (response) {
					obtenerEstablecimientosAsignados(data.id);
					setSelectedEstablecimiento(""); // Limpiamos el select
				} else {
					console.error(
						"Error al asignar establecimiento:",
						response.statusText
					);
				}
			} catch (error) {
				console.error("Error al asignar establecimiento:", error);
			}
		}
	};

	const handleDesvincularClick = async (establecimientoId) => {
		try {
			const endpoint =
				"http://localhost:5000/api/establecimientos/desvincular-establecimiento/";
			const direction = `${data.id}/${establecimientoId}`;
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
				obtenerEstablecimientosAsignados(data.id);
				setSelectedEstablecimiento(""); // Limpiamos el select
			} else {
				// Manejar errores si la desvinculación no fue exitosa
				console.error("Error al desvincular el establecimiento");
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
				<div className="modal-content bg-secondary">
					<div className="modal-header bg-primary">
						<h5 className="modal-title">
							Asignar establecimientos
							{data && data.nombre ? (
								<span>
									{" "}
									a{" "}
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
						<div className="row mb-3 align-items-center">
							<div className="col-6">
								<select
									className="form-select"
									id="establecimiento"
									onChange={handleEstablecimientoChange}
									value={selectedEstablecimiento}>
									<option value="">
										Selecciona un establecimiento
									</option>
									{establecimientosDisponibles.map((est) => (
										<option key={est.id} value={est.id}>
											{est.establecimiento}
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
							<table className="table bg-light table-hover table-striped table-responsive-sm table-sm table-borderless align-middle ">
								<thead className="bg-primary">
									<tr>
										<th>Nombre</th>
										<th>Domicilio</th>
										<th>Localidad</th>
										<th>Acciones</th>
									</tr>
								</thead>
								<tbody>
									{establecimientosAsignados.map((est) => (
										<tr
											className="align-items-center align-middle"
											key={est.id}>
											<td>{est.establecimiento}</td>
											<td>{est.domicilio}</td>
											<td>{est.localidad}</td>
											<td>
												<button
													type="button"
													className="btn btn-danger btn-sm"
													onClick={() =>
														handleDesvincularClick(
															est.id
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

export default EstablecimientosModal;

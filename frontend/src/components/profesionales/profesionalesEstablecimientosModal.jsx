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
				setEstablecimientosAsignados(response);
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

			setEstablecimientos(response.data);
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
					"http://localhost:5000/api/asignar-establecimiento"; // Endpoint para asignar establecimiento
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
					"",
					method,
					body,
					headers
				);

				if (response) {
					// Si la asignación es exitosa, actualizamos la lista de establecimientos asignados y disponibles
					setEstablecimientosAsignados([
						...establecimientosAsignados,
						response.data,
					]);
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
	
	const handleDesvincularClick= () => {
		// if (selectedEstablecimiento) {
		// 	const establecimientoSeleccionado = establecimientosAsignados.find(
		// 		(est) => est.id === selectedEstablecimiento
		// 	);
		// 	setEstablecimientosAsignados(
		// 		establecimientosAsignados.filter(
		// 			(est) => est.id !== establecimientoSeleccionado.id
		// 		)
		// 	);
		// 	setSelectedEstablecimiento("");
		// }
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
							Asignar establecimientos
						</h5>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={closeModal}></button>
					</div>
					<div className="modal-body">
						<div className="row mb-3">
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
							<button
								type="button"
								className="btn btn-primary btn-sm"
								onClick={handleAsignarClick}>
								Asignar
							</button>
						</div>
						<div className="row">
							<table className="table table-hover table-striped table-responsive-sm table-sm table-borderless align-middle">
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
										<tr key={est.id}>
											<td>{est.establecimiento}</td>
											<td>{est.domicilio}</td>
											<td>{est.localidad}</td>
											<td>
												<button
													type="button"
													className="btn btn-danger btn-sm"
													onClick={
														handleDesvincularClick
													}
												>
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

import React, { useState, useEffect } from "react";
import apiConnection from "../../../../backend/functions/apiConnection";

const EstablecimientosTab = ({ profesionalId, API_ENDPOINT }) => {
	const [establecimientos, setEstablecimientos] = useState([]);
	const [selectedEstablecimiento, setSelectedEstablecimiento] = useState("");
	const [establecimientosAsignados, setEstablecimientosAsignados] = useState(
		[]
	);
	const [establecimientosDisponibles, setEstablecimientosDisponibles] =
		useState([]);

	const obtenerEstablecimientosAsignados = async (profesionalId) => {
		try {
			const endpoint = `${API_ENDPOINT}/establecimientos/asignados/`;
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

	useEffect(() => {
		if (profesionalId) {
			obtenerEstablecimientosAsignados(profesionalId);
		}
	}, [profesionalId]);

	const fetchEstablecimientos = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/establecimientos`;
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
		// Lógica para obtener los establecimientos disponibles desde la API
		fetchEstablecimientos();
	}, []); // Se ejecuta solo una vez al montar el componente

	const handleEstablecimientoChange = (event) => {
		setSelectedEstablecimiento(event.target.value);
	};

	useEffect(() => {
		// Filtrar los establecimientos disponibles excluyendo los establecimientos asignados
		const disponibles = establecimientos.filter(
			(est) =>
				!establecimientosAsignados.find(
					(asignado) => asignado.id === est.id
				)
		);
		setEstablecimientosDisponibles(disponibles);
	}, [establecimientos, establecimientosAsignados]);

	const handleAsignarClick = async () => {
		if (selectedEstablecimiento) {
			try {
				const endpoint = `${API_ENDPOINT}/establecimientos/asignar-establecimiento`;
				const direction = "";
				const method = "POST";
				const headers = {
					"Content-Type": "application/json",
					Authorization: localStorage.getItem("token"),
				};
				const body = {
					profesionalId: profesionalId,
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
					obtenerEstablecimientosAsignados(profesionalId);
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
			const endpoint = `${API_ENDPOINT}/establecimientos/desvincular-establecimiento/`;
			const direction = `${profesionalId}/${establecimientoId}`;
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
				obtenerEstablecimientosAsignados(profesionalId);
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
		<div>
			<div className="modal-body">
				<div className="row mb-3 align-items-center px-0">
					<div className="col-6 px-0">
						<select
							className="form-select"
							id="establecimiento"
							onChange={handleEstablecimientoChange}
							value={selectedEstablecimiento}>
							<option value="">
								Seleccione un establecimiento
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
					<table className="table table-hover table-responsive-sm table-sm align-middle">
						<thead className="table-warning">
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
												handleDesvincularClick(est.id)
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
	);
};

export default EstablecimientosTab;

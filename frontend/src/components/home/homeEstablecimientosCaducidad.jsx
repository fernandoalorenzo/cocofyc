import React, { useState, useEffect } from "react";
import apiConnection from "../../../../backend/functions/apiConnection";

const EstablecimientosCaducidad = ({ API_ENDPOINT }) => {
	const [establecimientos, setEstablecimientos] = useState([]);

	useEffect(() => {
		const fetchEstablecimientos = async () => {
			try {
				const endpoint = `${API_ENDPOINT}/establecimientos/`;
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

				// Obtener el mes y año actual
				const currentMonth = new Date().getMonth() + 1; // Enero es 0, por eso se suma 1
				const currentYear = new Date().getFullYear();

				// Filtrar los establecimientos según el mes y año de fecha_caducidad
				const filteredEstablecimientos = response.data.filter(
					(establecimiento) => {
						const caducidadDate = new Date(
							establecimiento.fecha_caducidad
						);
						const caducidadMonth = caducidadDate.getMonth() + 1;
						const caducidadYear = caducidadDate.getFullYear();
						return (
							caducidadMonth === currentMonth &&
							caducidadYear === currentYear
						);
					}
				);

				// Ordenar por fecha de caducidad
				filteredEstablecimientos.sort(
					(a, b) =>
						new Date(a.fecha_caducidad) -
						new Date(b.fecha_caducidad)
				);

				setEstablecimientos(filteredEstablecimientos);
			} catch (error) {
				console.error("Error fetching data: ", error);
			}
		};

		fetchEstablecimientos();
	}, [API_ENDPOINT]);

	const obtenerClaseFecha = (fechaCaducidad) => {
		let fecha_caducidad = "";
		const caducidadDate = fechaCaducidad.split("-");
		if (caducidadDate.length === 3) {
			fecha_caducidad = `${caducidadDate[2]}/${caducidadDate[1]}/${caducidadDate[0]}`
		};

		let fechaActual = "";
		const actualDate = new Date();
		const actualDateArray = actualDate
			.toISOString()
			.split("T")[0]
			.split("-");
		if (actualDateArray.length === 3) {
			fechaActual = `${actualDateArray[2]}/${actualDateArray[1]}/${actualDateArray[0]}`
		};

		if (fecha_caducidad < fechaActual) {
			return "table-danger";
		} else if (fecha_caducidad === fechaActual) {
			return "table-warning";
		} else {
			return "table-success";
		}
	};
		
	return (
		<>
			<div className="card-header border-1 shadow bg-primary">
				<h3 className="card-title">
					<strong>
						Establecimientos con fecha de caducidad durante el mes
						en curso
					</strong>
				</h3>
			</div>
			<div
				className="card-body m-0 p-0"
				style={{
					maxHeight: "30vh",
					minHeight: "30vh",
					overflow: "auto",
				}}>
				<div className="container-fluid m-0 p-0">
					<table
						id="tabla_establecimientos"
						className="table table-hover table-sm">
						<thead className="table-dark">
							<tr>
								<th>Establecimiento</th>
								<th>Teléfono</th>
								<th>eMail</th>
								<th>Caducidad</th>
							</tr>
						</thead>
						<tbody>
							{establecimientos.map((establecimiento, index) => (
								<tr
									key={index}
									className={obtenerClaseFecha(
										establecimiento.fecha_caducidad
									)}
								>
									<td>{establecimiento.establecimiento}</td>
									<td>{establecimiento.telefono}</td>
									<td>{establecimiento.email}</td>
									<td>
										{(() => {
											const parts =
												establecimiento.fecha_caducidad.split(
													"-"
												);
											if (parts.length === 3) {
												return `${parts[2]}/${parts[1]}/${parts[0]}`;
											}
											return establecimiento.fecha_caducidad;
										})()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};

export default EstablecimientosCaducidad;
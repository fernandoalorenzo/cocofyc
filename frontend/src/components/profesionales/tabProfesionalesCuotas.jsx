import React, { useState, useEffect, useRef } from "react";
import apiConnection from "../../../../backend/functions/apiConnection";
import Swal from "sweetalert2";
import {
	datatableLanguageConfig,
	datatableDomConfig,
} from "../../utils/dataTableConfig";

const GenerarCuotaTab = ({ profesionalId, userId, API_ENDPOINT }) => {
	const tablaCuotasAdeudadasRef = useRef(null);
	const dataTableRef = useRef(null);

	const [cuotas, setCuotas] = useState([]);
	const [selectedCuota, setSelectedCuota] = useState("");
	const [cuotasGeneradas, setCuotasGeneradas] = useState([]);
	const [cuotasAdeudadas, setCuotasAdeudadas] = useState([]);

	useEffect(() => {
		if (profesionalId) {
			fetchCuotasAdeudadas();
			fetchCuotasGeneradas();
		}
	}, [profesionalId]);

	useEffect(() => {
		if (dataTableRef.current) {
			dataTableRef.current.clear().rows.add(cuotasAdeudadas).draw();
		} else if (cuotasAdeudadas.length && tablaCuotasAdeudadasRef.current) {
			dataTableRef.current = $(tablaCuotasAdeudadasRef.current).DataTable(
				{
					data: cuotasAdeudadas,
					language: datatableLanguageConfig,
					buttons: [
						{
							extend: "pageLength",
							className: "btn bg-secondary-subtle text-dark",
						},
						{
							extend: "copy",
							className: "btn btn-dark",
							text: '<i class="fas fa-copy"></i>',
							titleAttr: "Copia de datos al portapapeles",
						},
					],
					...datatableDomConfig,
					columns: [
						{ data: "cuota", width: "31%" },
						{
							data: "vencimiento",
							render: function (data) {
								const date = new Date(data);
								const day = date
									.getDate()
									.toString()
									.padStart(2, "0");
								const month = (date.getMonth() + 1)
									.toString()
									.padStart(2, "0");
								const year = date.getFullYear();
								return `${day}/${month}/${year}`;
							},
							width: "31%",
						},
						{
							data: "importe",
							render: function (data) {
								return parseFloat(data).toLocaleString(
									"es-AR",
									{
										style: "currency",
										currency: "ARS",
									}
								);
							},
							width: "31%",
							className: "text-end pe-4",
						},

						{
							data: null,
							className: "text-center",
							render: function (data, type, row) {
								return `
                            <button class="btn btn-danger btn-sm eliminar-btn" title="Eliminar" data-id="${row.id}"><i class="fa-regular fa-trash-can"></i></button>
							
                        `;
							},
							orderable: false,
							searchable: false,
							width: "2%",
						},
					],
					lengthChange: true,
					lengthMenu: [
						[10, 25, 50, 100, -1],
						[
							"10 Registros",
							"25 Registros",
							"50 Registros",
							"100 Registros",
							"Mostrar Todos",
						],
					],
					responsive: true,
					autoWidth: false,
					paging: true,
					searching: true,
					ordering: true,
					order: [[0, "desc"]],
					info: true,
				}
			);
		}

		$(tablaCuotasAdeudadasRef.current).on(
			"click",
			".eliminar-btn",
			function () {
				const rowData = dataTableRef.current
					.row($(this).closest("tr"))
					.data();
				handleEliminar(rowData.id);
			}
		);

		fetchCuotas();
	}, [cuotasAdeudadas]);

	const fetchCuotas = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/cuotas/`;
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
				// Filtrar las cuotas que no están incluidas en cuotasGeneradas
				const filteredCuotas = response.data.filter(
					(cuota) =>
						!cuotasGeneradas.some(
							(cuotaGenerada) =>
								cuotaGenerada.cuota_id === cuota.id
						)
				);

				// Ordenar los registros alfabéticamente por nombre de forma DESCENDENTE
				const sortedRegistros = filteredCuotas.sort(
					(a, b) => b.cuota.localeCompare(a.cuota) // Ordenar por el campo "cuota" descendente
				);
				setCuotas(sortedRegistros);
			} else {
				console.error(
					"Error fetching registros: ",
					response.statusText
				);
			}
		} catch (error) {
			console.error("Error fetching registros: ", error);
		}
	};

	const fetchCuotasAdeudadas = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/profesionales/cuotas-generadas-profesional/${profesionalId}`;
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
				// Filtrar las cuotas generadas que NO tienen movimiento_id asignado
				const cuotasFiltradas = response.data.filter(
					(cuotaAdeudada) => !cuotaAdeudada.movimiento_id
				);

				// Para cada cuota generada con movimiento_id, obtenemos los detalles de la cuota
				const cuotasWithDetails = await Promise.all(
					cuotasFiltradas.map(async (cuotaAdeudada) => {
						const cuotaDetails = await fetchCuotaDetails(
							cuotaAdeudada.cuota_id
						);
						return { ...cuotaAdeudada, ...cuotaDetails };
					})
				);

				if (!cuotasWithDetails) {
					console.error(
						"Error fetching cuotas generadas: ",
						response.statusText
					);
					return;
				}

				// Ordenar los registros alfabéticamente por nombre de forma DESCENDENTE
				const sortedRegistros = cuotasWithDetails.sort(
					(a, b) => b.cuota.localeCompare(a.cuota) // Ordenar por el campo "cuota" descendente
				);

				setCuotasAdeudadas(sortedRegistros);
			} else {
				console.error(
					"Error fetching cuotas generadas: ",
					response ? response.statusText : "No hay respuesta"
				);
			}
		} catch (error) {
			console.error("Error fetching cuotas generadas: ", error);
		}
	};

	const fetchCuotasGeneradas = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/profesionales/cuotas-generadas-profesional/${profesionalId}`;
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
				// Para cada cuota generada con movimiento_id, obtenemos los detalles de la cuota
				const cuotasWithDetails = await Promise.all(
					response.data.map(async (cuotaGenerada) => {
						const cuotaDetails = await fetchCuotaDetails(
							cuotaGenerada.cuota_id
						);
						return { ...cuotaGenerada, ...cuotaDetails };
					})
				);

				if (!cuotasWithDetails) {
					console.error(
						"Error fetching cuotas generadas: ",
						response.statusText
					);
					return;
				}

				// Ordenar los registros alfabéticamente por nombre de forma DESCENDENTE
				const sortedRegistros = cuotasWithDetails.sort(
					(a, b) => b.cuota.localeCompare(a.cuota) // Ordenar por el campo "cuota" descendente
				);

				setCuotasGeneradas(sortedRegistros);
			} else {
				console.error(
					"Error fetching cuotas generadas: ",
					response ? response.statusText : "No hay respuesta"
				);
			}
		} catch (error) {
			console.error("Error fetching cuotas generadas: ", error);
		}
	};

	const fetchCuotaDetails = async (cuotaId) => {
		try {
			const endpoint = `${API_ENDPOINT}/cuotas/${cuotaId}`;
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
				return {
					cuota: response.data.cuota,
					vencimiento: response.data.vencimiento,
					importe: response.data.importe,
				};
			} else {
				console.error(
					"Error fetching cuota details: ",
					response.statusText
				);
			}
		} catch (error) {
			console.error("Error fetching cuota details: ", error);
		}
	};

	const handleGenerarClick = async () => {
		if (!selectedCuota) {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "Por favor, seleccione una cuota.",
				showConfirmButton: true,
				timer: 2500,
			});
			return;
		}

		try {
			const endpoint = `${API_ENDPOINT}/profesionales/generar-cuota`;
			const direction = "";
			const method = "POST";
			const body = {
				user_id: userId,
				profesional_id: profesionalId,
				cuota_id: selectedCuota,
			};

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

			if (response.data) {
				Swal.fire({
					icon: "success",
					title: "Cuota generada correctamente",
					text: "La cuota ha sido generada correctamente.",
					showConfirmButton: true,
					timer: 2500,
				});

				// Volver a dibujar la tabla y poblar el select con los nuevos datos
				fetchCuotasGeneradas();
				fetchCuotasAdeudadas();
				fetchCuotas();

				setSelectedCuota("");
			} else {
				console.error(
					"Error al generar la cuota: ",
					response.statusText
				);
			}
		} catch (error) {
			if (error.message.includes("400")) {
				// Manejar el error específico
				Swal.fire({
					icon: "error",
					title: "Error al generar la cuota",
					text: "La combinación de profesional y cuota ya existe.",
					showConfirmButton: true,
				});
			} else {
				// Manejar otros errores
				console.error("Error al generar la cuota: ", error.message);
			}
		}
	};

	const handleEliminar = async (id) => {
		try {
			const endpoint = `${API_ENDPOINT}/profesionales/cuotas-generadas/${id}`;
			const method = "DELETE";
			const headers = {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			};

			const response = await apiConnection(
				endpoint,
				"",
				method,
				false,
				headers
			);

			if (response.result) {
				Swal.fire({
					title: "Eliminado",
					text: "El registro ha sido eliminado correctamente",
					icon: "success",
					showConfirmButton: false,
					timer: 2500,
				});

				setTimeout(() => {
					fetchCuotas();
					fetchCuotasAdeudadas();
					fetchCuotasGeneradas();
				}, 2500);
			} else {
				Swal.fire({
					title: "Error",
					text: "Ha ocurrido un error al intentar eliminar el registro",
					icon: "error",
				});
			}
		} catch (error) {
			console.error("Error al eliminar el registro:", error.message);
			Swal.fire({
				title: "Error",
				text: "Ha ocurrido un error al intentar eliminar el registro",
				icon: "error",
			});
		}
	};

	return (
		<>
			<div className="modal-body">
				<div className="d-flex justify-content-center">
					{/* Contenedor centrado */}
					<div className="col-8 px-0">
						<div className="card">
							<div className="card-header bg-primary bg-opacity-50 align-items-center text-center">
								<h5 className="card-title fw-bold text-center">
									Generarle una Cuota al Profesional
								</h5>
							</div>
							<div className="card-body">
								<div className="row">
									<div className="col-6">
										<select
											className="form-select"
											id="cuotas"
											onChange={(e) =>
												setSelectedCuota(e.target.value)
											}
											value={selectedCuota}>
											<option value="">
												Seleccione una Cuota
											</option>
											{cuotas.map((cuota) => (
												<option
													key={cuota.id}
													value={cuota.id}>
													{cuota.cuota}
												</option>
											))}
										</select>
									</div>
									<div className="col-6">
										<button
											type="button"
											className="btn btn-primary btn-sm"
											onClick={handleGenerarClick}>
											<i className="fa-solid fa-link"></i>{" "}
											Generar
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="d-flex justify-content-center">
					{/* Contenedor centrado */}
					<div className="col-8 px-0">
						<div className="card">
							<div className="card-header bg-primary bg-opacity-50 align-items-center text-center">
								<h5 className="card-title fw-bold text-center">
									Cuotas pendientes de pago
								</h5>
							</div>
							<div className="card-body">
								<table
									ref={tablaCuotasAdeudadasRef}
									id="tablaCuotasAdeudadas"
									className="table table-hover table-sm">
									<thead className="table-warning">
										<tr>
											<th>Cuota</th>
											<th>Vencimiento</th>
											<th>Importe</th>
											<th></th>
										</tr>
									</thead>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default GenerarCuotaTab;
import React, { useState, useEffect, useRef } from "react";
import apiConnection from "../../../../backend/functions/apiConnection";
import Swal from "sweetalert2";

const GenerarCuotaTab = ({ profesionalId, userId }) => {
	const tablaCuotasGeneradasRef = useRef(null);
	const dataTableRef = useRef(null);

	const [cuotas, setCuotas] = useState([]);
	const [selectedCuota, setSelectedCuota] = useState("");
	const [cuotasGeneradas, setCuotasGeneradas] = useState([]);

	useEffect(() => {
		// Lógica para obtener los registros disponibles desde la API
		if (profesionalId) {
			fetchCuotasGeneradas();
		}
	}, [profesionalId]);

	useEffect(() => {
		if (dataTableRef.current) {
			dataTableRef.current.clear().rows.add(cuotasGeneradas).draw();
		} else if (cuotasGeneradas.length && tablaCuotasGeneradasRef.current) {
			dataTableRef.current = $(tablaCuotasGeneradasRef.current).DataTable(
				{
					data: cuotasGeneradas,
					language: {
						// url: "//cdn.datatables.net/plug-ins/2.0.3/i18n/es-AR.json",
						buttons: {
							copy: "Copiar",
							colvis: "Visibilidad",
							colvisRestore: "Restaurar visibilidad",
							copyTitle: "Copiar al portapapeles",
							csv: "CSV",
							excel: "Excel",
							pageLength: {
								"-1": "Mostrar todos los registros",
								_: "Mostrar %d registros",
							},
							pdf: "PDF",
							print: "Imprimir",
						},
						lengthMenu: "Mostrar _MENU_ registros",
						zeroRecords: "No se encontraron resultados",
						infoEmpty:
							"Mostrando registros del 0 al 0 de un total de 0 registros",
						loadingRecords: "Cargando...",
						paginate: {
							first: '<i class="fas fa-angle-double-left"></i>',
							last: '<i class="fas fa-angle-double-right"></i>',
							next: '<i class="fas fa-angle-right"></i>',
							previous: '<i class="fas fa-angle-left"></i>',
						},
						autoFill: {
							cancel: "Cancelar",
							fill: "Llenar las celdas con <i>%d<i></i></i>",
							fillHorizontal: "Llenar las celdas horizontalmente",
							fillVertical: "Llenar las celdas verticalmente",
						},
						decimal: ",",
						emptyTable: "No hay datos disponibles en la Tabla",
						infoFiltered: ". Filtrado de _MAX_ registros totales",
						infoThousands: ".",
						processing: "Procesando...",
						search: "Busqueda:",
						datetime: {
							previous: "Anterior",
							next: "Siguiente",
							hours: "Hora",
							minutes: "Minuto",
							seconds: "Segundo",
							amPm: ["AM", "PM"],
							months: {
								0: "Enero",
								1: "Febrero",
								2: "Marzo",
								3: "Abril",
								4: "Mayo",
								5: "Junio",
								6: "Julio",
								7: "Agosto",
								8: "Septiembre",
								9: "Octubre",
								10: "Noviembre",
								11: "Diciembre",
							},
							unknown: "-",
							weekdays: [
								"Dom",
								"Lun",
								"Mar",
								"Mie",
								"Jue",
								"Vie",
								"Sab",
							],
						},
						info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
					},
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
					dom:
						"<'row'<'col-md-6'B><'col-md-6'f>>" + // Agregamos contenedor para botones y cont para búsqueda
						"<'row'<'col-md-12'tr>>" + // Agregamos contenedor para tabla
						"<'row'<'col-md-6'i><'col-md-6'p>>",
					columns: [
						{ data: "cuota", width: "33%" },
						{
							data: "vencimiento",
							render: function (data) {
								// Formatear la fecha en formato DD/MM/AAAA
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
							width: "33%",
						},
						{
							data: "importe",
							render: function (data) {
								// Dar formato de moneda al importe
								return parseFloat(data).toLocaleString(
									"es-AR",
									{
										style: "currency",
										currency: "ARS",
									}
								);
							},
							width: "33%",
							className: "text-end pe-4",
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
					info: true,
				}
			);
		}
		fetchCuotas();
	}, [cuotasGeneradas]);

	const fetchCuotas = async () => {
		try {
			const endpoint = "http://localhost:5000/api/cuotas/";
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
					(a, b) =>
						// a.cuota.localeCompare(b.cuota) // Ordenar por el campo "cuota" ascendente
						b.cuota.localeCompare(a.cuota) // Ordenar por el campo "cuota" descendente
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

	const fetchCuotasGeneradas = async () => {
		try {
			const endpoint = `http://localhost:5000/api/profesionales/cuotas-generadas-profesional/${profesionalId}`;
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
				// Para cada cuota generada, obtenemos los detalles de la cuota
				const cuotasWithDetails = await Promise.all(
					response.data.map(async (cuotaGenerada) => {
						const cuotaDetails = await fetchCuotaDetails(
							cuotaGenerada.cuota_id
						);
						return { ...cuotaGenerada, ...cuotaDetails };
					})
				);
				setCuotasGeneradas(cuotasWithDetails);
			} else {
				console.error(
					"Error fetching cuotas generadas: ",
					response.statusText
				);
			}
		} catch (error) {
			console.error("Error fetching cuotas generadas: ", error);
		}
	};

	const fetchCuotaDetails = async (cuotaId) => {
		try {
			const endpoint = `http://localhost:5000/api/cuotas/${cuotaId}`;
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
			const endpoint = `http://localhost:5000/api/profesionales/generar-cuota`;
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
									ref={tablaCuotasGeneradasRef}
									id="tablaCuotasGeneradas"
									className="table table-hover table-sm">
									<thead className="table-warning">
										<tr>
											<th>Cuota</th>
											<th>Vencimiento</th>
											<th>Importe</th>
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

import React, { useState, useEffect, useRef } from "react";
import apiConnection from "../../../../../backend/functions/apiConnection";
import Swal from "sweetalert2";

const GenerarCuotaTab = ({ profesionalId, userId }) => {
	const tablaCuotasGeneradasRef = useRef(null);
	const dataTableRef = useRef(null);

	const [cuotas, setCuotas] = useState([]);
	const [selectedCuota, setSelectedCuota] = useState("");
	const [cuotasGeneradas, setCuotasGeneradas] = useState([]);

	useEffect(() => {
		if (dataTableRef.current) {
			dataTableRef.current.clear().rows.add(cuotasGeneradas).draw();
		} else if (cuotasGeneradas.length && tablaCuotasGeneradasRef.current) {
			dataTableRef.current = $(tablaCuotasGeneradasRef.current).DataTable(
				{
					data: cuotasGeneradas,
					columns: [
						{ data: "cuota" },
						{ data: "vencimiento" },
						{ data: "importe" },
					],
					buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
					layout: {
						topStart: "buttons",
						bottomEnd: "search",
						bottomStart: "info",
						bottomEnd2: "paging",
					},
					responsive: true,
					lengthChange: false,
					autoWidth: false,
					paging: true,
					searching: true,
					ordering: true,
					info: true,
				}
			);

			$(dataTableRef.current)
				.DataTable()
				.buttons()
				.container()
				.appendTo(
					$(tablaCuotasGeneradasRef.current)
						.closest(".card")
						.find(".card-header")
				);
		}
	});

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
				// Ordenar los registros alfabéticamente por nombre de forma DESCENDENTE
				const sortedRegistros = response.data.sort(
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

	useEffect(() => {
		// Lógica para obtener los registros disponibles desde la API
		fetchCuotas();
		// fetchCuotasGeneradas();
	}, []);

	useEffect(() => {
		// Lógica para obtener los registros disponibles desde la API
		if (profesionalId) {
			fetchCuotasGeneradas();
		}
	}, [profesionalId]);

	return (
		<div>
			<div className="modal-body">
				<div className="row mb-3 align-items-center">
					<div className="col-6">
						<select
							className="form-select"
							id="cuotas"
							onChange={(e) => setSelectedCuota(e.target.value)}
							value={selectedCuota}>
							<option value="">Seleccione una Cuota</option>
							{cuotas.map((cuota) => (
								<option key={cuota.id} value={cuota.id}>
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
							<i className="fa-solid fa-link"></i> Generar
						</button>
					</div>
				</div>
				<div className="col-12">
					<div className="card">
						<div className="card-header">
							<h3 className="card-title">
								DataTable with default features
							</h3>
						</div>
						<div className="card-body">
							<table
								ref={tablaCuotasGeneradasRef}
								id="tablaCuotasGeneradas"
								className="table table-bordered table-striped table-hover">
								<thead>
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
	);
};

export default GenerarCuotaTab;

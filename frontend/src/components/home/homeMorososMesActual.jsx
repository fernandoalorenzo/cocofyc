import React, { useState, useEffect, useRef } from "react";
import apiConnection from "../../../../backend/functions/apiConnection";
import {
	datatableLanguageConfig,
	datatableButtonsConfig,
	datatableDomConfig,
} from "../../utils/dataTableConfig";

const ProfesionalesCaducidad = ({ API_ENDPOINT }) => {
	const [cuotaActual, setCuotaActual] = useState([]);
	const [profesionales, setProfesionales] = useState([]);
	const [ProfesionalesMorosos, setProfesionalesMorosos] = useState([]);

	const tablaProfesionalesRef = useRef(null);
	const dataTableRef = useRef(null);

	const fetchCuotaActual = async () => {
		try {
			// Obtener la cuota del mes actual
			const currentDate = new Date();
			const currentMonth = `${currentDate.getFullYear()}-${(
				currentDate.getMonth() + 1
			)
				.toString()
				.padStart(2, "0")}`; // Formato YYYY-MM

			const cuotasEndpoint = `${API_ENDPOINT}/cuotas/`;
			const cuotasHeaders = {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			};

			const cuotasResponse = await apiConnection(
				cuotasEndpoint,
				"",
				"GET",
				false,
				cuotasHeaders
			);

			const currentCuota = cuotasResponse.data.find((cuota) =>
				cuota.vencimiento.startsWith(currentMonth)
			);

			if (currentCuota) {
				setCuotaActual(currentCuota.id);
				return;
			}

		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	};

	const fetchProfesionalesMorosos = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/profesionales/profesionales-morosos`;
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

			if (!cuotaActual) {
				console.error("No existe cuota actual");
				return;
			}

			const filteredData = response.data.filter(
				(profesional) => profesional.cuota_id === cuotaActual
			);

			const sortedData = [...filteredData].sort((a, b) => {
				// Comparar los nombres de los profesionales (columna 0)
				if (a.nombre < b.nombre) return -1;
				if (a.nombre > b.nombre) return 1;
				return 0;
			});

			setProfesionales(sortedData);
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	useEffect(() => {
		fetchCuotaActual();
	}, []);

	useEffect(() => {
		if (cuotaActual) {
			fetchProfesionalesMorosos();
		}
	}, [cuotaActual]);

	// DATATABLE
	useEffect(() => {
		if (dataTableRef.current) {
			dataTableRef.current.clear().rows.add(profesionales).draw();
		} else if (profesionales.length && tablaProfesionalesRef.current) {
			dataTableRef.current = $(tablaProfesionalesRef.current).DataTable({
				data: profesionales,
				language: datatableLanguageConfig,
				buttons: [
					{
						extend: "excelHtml5",
						className: "btn btn-success",
						text: '<i class="fas fa-file-excel fa-xl"></i>',
						titleAttr: "Exportar datos a Excel",
					},
					{
						extend: "pdfHtml5",
						className: "btn btn-danger",
						text: '<i class="fas fa-file-pdf fa-xl"></i>',
						titleAttr: "Exportar datos a PDF",
					},
					{
						extend: "print",
						className: "btn btn-warning",
						text: '<i class="fas fa-print"></i>',
						title: "Movimientos",
						titleAttr: "Imprimir datos",
					},
					{
						extend: "copy",
						className: "btn btn-dark",
						text: '<i class="fas fa-copy"></i>',
						titleAttr: "Copia de datos a portapapeles",
					},
				],
				...datatableDomConfig,
				columns: [
					{
						data: "nombre",
					},
					{
						data: "telefono",
						className: "text-center",
					},
					{
						data: "email",
					},
				],
				pageLength: 5,
				responsive: true,
				autoWidth: true,
				paging: true,
				searching: true,
				ordering: true,
				info: true,
				order: [[0, "asc"]],
			});
		}
	}, [profesionales]);

	return (
		<>
			<div className="card-header border-1 shadow bg-primary py-1">
				<h3 className="card-title my-1 py-0">
					<strong>
						Profesionales que adeudan la matrícula del mes en curso
					</strong>
				</h3>
			</div>
			<div className="card-body">
				{profesionales.length ? (
					<table
						ref={tablaProfesionalesRef}
						id="tabla_profesionales"
						className="table table-hover table-sm">
						<thead>
							<tr className="table-dark">
								<th>Profesional</th>
								<th>Teléfono</th>
								<th>eMail</th>
							</tr>
						</thead>
					</table>
				) : (
					<p>No hay profesionales que adeudan la matrícula</p>
				)}
			</div>
		</>
	);
};

export default ProfesionalesCaducidad;

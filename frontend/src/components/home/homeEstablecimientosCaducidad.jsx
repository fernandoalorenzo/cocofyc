import React, { useState, useEffect, useRef } from "react";
import apiConnection from "../../../../backend/functions/apiConnection";
import {
	datatableLanguageConfig,
	datatableButtonsConfig,
	datatableDomConfig,
} from "../../utils/dataTableConfig";

const EstablecimientosCaducidad = ({ API_ENDPOINT }) => {
	const [establecimientos, setEstablecimientos] = useState([]);

	const tablaEstablecimientosRef = useRef(null);
	const dataTableRef = useRef(null);

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

			setEstablecimientos(filteredEstablecimientos);
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	};

	useEffect(() => {
		fetchEstablecimientos();
	}, []);

	// DATATABLE
	useEffect(() => {
		if (establecimientos.length && !dataTableRef.current) {
			if (dataTableRef.current) {
				dataTableRef.current.clear().rows.add(establecimientos).draw();
			} else if (
				establecimientos.length &&
				tablaEstablecimientosRef.current
			) {
				dataTableRef.current = $(
					tablaEstablecimientosRef.current
				).DataTable({
					data: establecimientos,
					language: datatableLanguageConfig,
					buttons: [
						// {
						// 	extend: "excelHtml5",
						// 	className: "btn btn-success",
						// 	text: '<i class="fas fa-file-excel fa-xl"></i>',
						// 	titleAttr: "Exportar datos a Excel",
						// },
						// {
						// 	extend: "pdfHtml5",
						// 	className: "btn btn-danger",
						// 	text: '<i class="fas fa-file-pdf fa-xl"></i>',
						// 	titleAttr: "Exportar datos a PDF",
						// },
						// {
						// 	extend: "print",
						// 	className: "btn btn-warning",
						// 	text: '<i class="fas fa-print"></i>',
						// 	title: "Movimientos",
						// 	titleAttr: "Imprimir datos",
						// },
						// {
						// 	extend: "copy",
						// 	className: "btn btn-dark",
						// 	text: '<i class="fas fa-copy"></i>',
						// 	titleAttr: "Copia de datos a portapapeles",
						// },
					],
					...datatableDomConfig,
					columnDefs: [
						{
							targets: 3,
							render: function (data, type, row) {
								if (type === "display") {
									const parts = data.split("-");
									if (parts.length === 3) {
										return `${parts[2]}/${parts[1]}/${parts[0]}`;
									}
								}
								return data;
							},
							className: "text-center",
						},
						{
							targets: 4,
							render: function (data, type, row) {
								let color;
								let caducidadFormatted;
								let todayFormatted;
								let today = new Date();
								let day = today.getDate();
								let month = today.getMonth() + 1; // El mes es devuelto de 0 a 11, por lo que se suma 1
								let year = today.getFullYear();
								// Asegurar que el mes tenga dos dígitos (agregar un cero delante si es necesario)
								if (month < 10) {
									month = "0" + month;
								}

								const partial1 = data.fecha_caducidad.split("-");
								if (partial1.length === 3) {
									caducidadFormatted = `${partial1[2]}/${partial1[1]}/${partial1[0]}`;
								}

								todayFormatted = day + "/" + month + "/" + year;
								
								if (caducidadFormatted < todayFormatted) {
									color = "red";
								} else if (
									caducidadFormatted === todayFormatted
								) {
									color = "#ECE000";
								} else {
									color = "#35AC65";
								}

								return `<div class="d-flex justify-content-center align-items-center">
										<i class="fa-solid fa-circle align-middle" style="color: ${color}"></i>
									</div>`;
							},
						},
					],
					columns: [
						{
							data: "establecimiento",
						},
						{
							data: "telefono",
						},
						{
							data: "email",
						},
						{
							data: "fecha_caducidad",
						},
						{
							data: null,
							orderable: false,
							searchable: false,
							className: "align-middle align-items-center text-center",
						},
					],
					pageLength: 5,
					responsive: true,
					autoWidth: true,
					paging: true,
					searching: true,
					ordering: true,
					info: true,
					order: [[3, "asc"]],
				});
			}
		} else if (dataTableRef.current) {
			dataTableRef.current.clear().rows.add(establecimientos).draw();
		}
	}, [establecimientos]);

	return (
		<>
			<div className="card-header border-1 shadow bg-primary py-1">
				<h3 className="card-title my-1 py-0">
					<strong>
						Establecimientos con fecha de caducidad durante el mes en curso
					</strong>
				</h3>
			</div>
			<div className="card-body">
				{establecimientos.length ? (
					<table
						ref={tablaEstablecimientosRef}
						id="tabla_establecimientos"
						className="table table-hover table-sm">
						<thead>
							<tr className="table-dark">
								<th>Establecimiento</th>
								<th>Teléfono</th>
								<th>eMail</th>
								<th>Caducidad</th>
								<th>Estado</th>
							</tr>
						</thead>
					</table>
				) : (
					<p>No hay establecimientos con fecha de caducidad durante el mes en curso</p>
				)}
			</div>
		</>
	);
};

export default EstablecimientosCaducidad;
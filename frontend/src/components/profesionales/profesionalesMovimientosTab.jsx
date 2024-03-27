import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";

const MovimientosTab = ({ profesionalId, onTabChange }) => {
	const [data, setData] = useState([]);
	// const dataTableRef = useRef(null);
	const [dataTableInitialized, setDataTableInitialized] = useState(false);
	const dataTable = useRef(null);

	const fetchMovimientos = async () => {
		try {
			const endpoint =
				"http://localhost:5000/api/movimientos/profesional/";
			const direction = profesionalId;
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

			const movimientos = [];

			for (const movimiento of response.data) {
				const medio = await fetchMedioDePago(movimiento.medio_id);
				movimientos.push({
					...movimiento,
					medio: medio,
				});
			}

			const ingresos = movimientos.filter(
				(movimiento) => movimiento.tipo_operacion === "INGRESO"
			);

			setData(ingresos);
		} catch (error) {
			console.error("Error:", error.message);
			Swal.fire({
				icon: "error",
				title: "Error al cargar datos",
				text: "Hubo un problema al obtener los datos de los movimientos.",
			});
		}
	};

	const fetchMedioDePago = async (medioId) => {
		try {
			const endpoint = `http://localhost:5000/api/mediosdepago/${medioId}`;
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

			const mediosDePago = response.data;

			return mediosDePago.medio;
		} catch (error) {
			console.error("Error:", error.message);
			return "Nombre de medio no encontrado";
		}
	};

	const initializeDataTable = () => {
		const tableElement = document.getElementById("movimientosTable");
		if (tableElement) {
			const table = $("#movimientosTable").DataTable({
				language: {
					url: "//cdn.datatables.net/plug-ins/2.0.3/i18n/es-ES.json",
					paginate: {
						first: '<i class="fas fa-angle-double-left"></i>',
						last: '<i class="fas fa-angle-double-right"></i>',
						next: '<i class="fas fa-angle-right"></i>',
						previous: '<i class="fas fa-angle-left"></i>',
					},
				},
				columnDefs: [
					{
						targets: [0],
						render: DataTable.render.datetime("DD/MM/YYYY"),
					},
				],
				order: [[0, "desc"]],
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
				buttons: [
					{
						extend: "pageLength",
						className: "btn bg-secondary-subtle text-dark",
					},
					{
						extend: "excelHtml5",
						className: "btn btn-success",
						text: '<i class="fas fa-file-excel fa-xl"></i>',
					},
					{
						extend: "pdfHtml5",
						className: "btn btn-danger",
						text: '<i class="fas fa-file-pdf fa-xl"></i>',
					},
				],
				layout: {
					topStart: "buttons",
					topEnd: "search",
					bottomStart: "info",
					bottomEnd: "paging",
				},
			});
			// dataTableRef.current = table;
			dataTable.current = table;
			setDataTableInitialized(true);
		}
	};

	useEffect(() => {
		if (!dataTableInitialized && data.length > 0) {
			initializeDataTable();
		} else if (dataTableInitialized) {
			// Si la tabla ya está inicializada, pero los datos han cambiado,
			// actualiza los datos en la tabla.
			if ($.fn.DataTable.isDataTable("#movimientosTable")) {
				dataTable.current.clear().rows.add(data).draw();
			}
		}
	}, [data, dataTableInitialized]);

	useEffect(() => {
		// Limpia la tabla DataTable antes de volver a inicializarla al cambiar de profesional
		if (dataTableInitialized) {
			dataTable.current.destroy();
			setDataTableInitialized(false);
		}
		if (profesionalId) {
			fetchMovimientos();
		}
	}, [profesionalId]);

	useEffect(() => {
		// Limpia la tabla DataTable antes de volver a inicializarla al cambiar de pestaña
		if (dataTableInitialized) {
			dataTable.current.destroy();
			setDataTableInitialized(false);
		}
		if (onTabChange) {
			fetchMovimientos();
		}
	}, [onTabChange]);

	return (
		<>
			<div className="container-fluid mt-4">
				<table
					id="movimientosTable"
					className="table table-bordered table-hover"
					style={{ width: "100%" }}>
					<thead className="bg-primary bg-opacity-25">
						<tr>
							<th>Fecha</th>
							<th>Importe</th>
							<th>Medio de Pago</th>
							<th>Concepto</th>
						</tr>
					</thead>
					<tbody>
						{data.length > 0 ? (
							data.map((movimiento, index) => (
								<tr key={index}>
									<td>{movimiento.fecha}</td>
									<td>{movimiento.importe}</td>
									<td>{movimiento.medio}</td>
									<td>{movimiento.concepto}</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="4" className="text-center">
									No hay movimientos disponibles
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default MovimientosTab;

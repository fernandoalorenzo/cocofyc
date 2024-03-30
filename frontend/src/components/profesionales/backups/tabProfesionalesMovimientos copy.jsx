import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../../backend/functions/apiConnection";

const MovimientosTab = ({ profesionalId, movimientos }) => {
	const tablaMovimientosRef = useRef(null);
	const dataTableRef = useRef(null);

	useEffect(() => {
		if (dataTableRef.current) {
			// Si hay un DataTable existente, limpiamos los datos
			dataTableRef.current.clear().rows.add(movimientos).draw();
		} else if (movimientos.length && tablaMovimientosRef.current) {
			dataTableRef.current = $(tablaMovimientosRef.current).DataTable({
				data: movimientos,
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
					processing: "Procesando...",
					lengthMenu: "Mostrar _MENU_ registros",
					zeroRecords: "No se encontraron resultados",
					emptyTable: "Ningún dato disponible en esta tabla",
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
					infoFiltered: "Filtrado de _MAX_ entradas totales",
					infoThousands: ".",
					lengthMenu: "Mostrar _MENU_ entradas",
					loadingRecords: "Cargando...",
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
					info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
					infoEmpty: "Mostrando 0 a 0 de 0 entradas",
				},
				buttons: [
					{
						extend: "pageLength",
						className: "btn bg-secondary-subtle text-dark",
					},
					{
						extend: "colvis",
						className: "btn bg-secondary-subtle text-dark",
						text: '<i class="fas fa-filter fa-xl"></i>',
						titleAttr: "Mostrar/Ocultar columnas",
					},
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
				dom:
					"<'row'<'col-md-6'B><'col-md-6'f>>" + // Agregamos contenedor para botones y cont para búsqueda
					"<'row'<'col-md-12'tr>>" + // Agregamos contenedor para tabla
					"<'row'<'col-md-6'i><'col-md-6'p>>",
				columns: [
					{
						data: "fecha",
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
					},
					{ data: "importe" },
					{ data: "medio" },
					{ data: "concepto" },
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
			});
		}
	}, [movimientos, profesionalId]);

	return (
		<>
			<div className="container-fluid mt-4">
				<div className="card-body">
					<table
						ref={tablaMovimientosRef}
						id="tabla_movimientos"
						className="table table-bordered table-striped table-hover">
						<thead className="bg-primary bg-opacity-25">
							<tr>
								<th>Fecha</th>
								<th>Importe</th>
								<th>Medio</th>
								<th>Concepto</th>
							</tr>
						</thead>
					</table>
				</div>
			</div>
		</>
	);
};

export default MovimientosTab;

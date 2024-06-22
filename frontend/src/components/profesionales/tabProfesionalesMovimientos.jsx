import React, { useState, useEffect, useRef } from "react";
import {
	datatableLanguageConfig,
	datatableButtonsConfig,
	datatableDomConfig,
} from "../../utils/dataTableConfig";


const MovimientosTab = ({ profesionalId, data, movimientos }) => {
	const tablaMovimientosRef = useRef(null);
	const dataTableRef = useRef(null);

	useEffect(() => {
		if (dataTableRef.current) {
			// Si hay un DataTable existente, limpiamos los datos
			dataTableRef.current.clear().rows.add(movimientos).draw();
		} else if (movimientos.length && tablaMovimientosRef.current) {
			dataTableRef.current = $(tablaMovimientosRef.current).DataTable({
				data: movimientos,
				pageLength: 5,
				language: datatableLanguageConfig,
				buttons: datatableButtonsConfig, ...datatableDomConfig,
				columns: [
					{
						data: "fecha",
						render: function (data) {
							// Crear una instancia de Date interpretando la fecha como UTC
							const date = new Date(data + "T00:00:00Z");
							// Obtener los componentes de la fecha en formato UTC
							const day = date
								.getUTCDate()
								.toString()
								.padStart(2, "0");
							const month = (date.getUTCMonth() + 1)
								.toString()
								.padStart(2, "0");
							const year = date.getUTCFullYear();
							return `${day}/${month}/${year}`;
						},
					},
					{
						data: "importe",
						render: function (data) {
							// Dar formato de moneda al importe
							return parseFloat(data).toLocaleString("es-AR", {
								style: "currency",
								currency: "ARS",
							});
						},
						className: "text-end",
					},
					{ data: "medio" },
					{ data: "concepto" },
				],
				lengthChange: true,
				lengthMenu: [
					[5, 10, 25, 50, 100, -1],
					[
						"5 Registros",
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
				order: [[0, "desc"]], // Ordenar por la primera columna en orden descendente
			});
		}
	}, [movimientos, profesionalId]);

	return (
		<>
			<div className="modal-body">
				<div className="col-12">
					<div className="card">
						<div className="card-header bg-primary bg-opacity-50 align-items-center text-center">
							<h5 className="card-title fw-bold text-center">
								Pagos realizados por el profesional
							</h5>
						</div>

						<div className="card-body">
							<table
								ref={tablaMovimientosRef}
								id="tabla_movimientos"
								className="table table-hover table-sm">
								<thead className="table-warning">
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
				</div>
			</div>
		</>
	);
};

export default MovimientosTab;
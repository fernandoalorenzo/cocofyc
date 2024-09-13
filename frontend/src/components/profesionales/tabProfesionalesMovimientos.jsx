import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import {
	datatableLanguageConfig,
	datatableButtonsConfig,
	datatableDomConfig,
} from "../../utils/dataTableConfig";

const MovimientosTab = ({
	profesionalId,
	// data,
	API_ENDPOINT,
	// fetchMovimientos,
}) => {
	const tablaMovimientosRef = useRef(null);
	const dataTableRef = useRef(null);

	const [movimientos, setMovimientos] = useState([]);

	const fetchMovimientosProfesional = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/movimientos/profesional/`;
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

			if (response.data && response.data.length > 0) {
				const movimientos = [];

				// Filtrar los movimientos por tipo de operación "INGRESO"
				const movimientosIngresos = response.data.filter(
					(movimiento) => movimiento.tipo_operacion === "INGRESO"
				);

				// Iterar sobre los movimientos filtrados y realizar el fetch del medio de pago
				for (const movimiento of movimientosIngresos) {
					try {
						const medio = await fetchMedioDePago(
							movimiento.medio_id
						);
						const ingreso = {
							id: movimiento.id,
							fecha: movimiento.fecha,
							importe: movimiento.importe,
							medio: medio,
							concepto: movimiento.concepto,
						};
						movimientos.push(ingreso);
					} catch (error) {
						console.error("Error al obtener medio de pago:", error);
					}
				}
				return movimientos;
			} else {
				return [];
			}
		} catch (error) {
			console.error("Error:", error.message);
			Swal.fire({
				icon: "error",
				title: "Error al cargar datos",
				text: "Hubo un problema al obtener los datos de los movimientos.",
			});
		}
	};

useEffect(() => {
	const fetchData = async () => {
		const movimientosData = await fetchMovimientosProfesional();
		setMovimientos(movimientosData);
	};

	fetchData();
}, [profesionalId]);

	const fetchMedioDePago = async (medioId) => {
		try {
			const endpoint = `${API_ENDPOINT}/mediosdepago/${medioId}`;
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

	useEffect(() => {
		if (dataTableRef.current) {
			// Si hay un DataTable existente, limpiamos los datos
			dataTableRef.current.clear().rows.add(movimientos).draw();
		} else if (movimientos.length && tablaMovimientosRef.current) {
			dataTableRef.current = $(tablaMovimientosRef.current).DataTable({
				data: movimientos,
				pageLength: 5,
				language: datatableLanguageConfig,
				buttons: datatableButtonsConfig,
				...datatableDomConfig,
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
						width: "7%",
					},
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

		$(tablaMovimientosRef.current).on(
			"click",
			".eliminar-btn",
			function () {
				const rowData = dataTableRef.current
					.row($(this).closest("tr"))
					.data();
				handleEliminar(rowData.id);
			}
		);
	}, [movimientos, profesionalId]);

	const eliminarMovimientoDeCuota = async (movimientoId) => {
		try {
			const endpoint = `${API_ENDPOINT}/profesionales/eliminar-movimiento-de-cuota/`;
			const direction = `${movimientoId}`;
			const method = "PATCH";
			const body = { movimiento_id: movimientoId };
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

			if (!response) {
				console.error(
					"Error al eliminar movimiento de cuota: ",
					response.statusText
				);
			}
		} catch (error) {
			console.error("Error al eliminar movimiento de cuota: ", error);
		}
	};

	const handleEliminar = async (id) => {
		if (!profesionalId) {
			return;
		}

		const result = await Swal.fire({
			title: "¿Estás seguro?",
			text: "Esta acción no se puede deshacer",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#FF0000",
			cancelButtonColor: "9B9B9B",
			confirmButtonText: "Eliminar",
			cancelButtonText: "Cancelar",
		});

		// Si el usuario confirma la eliminación
		if (result.isConfirmed) {
			try {
				const endpoint = `${API_ENDPOINT}/movimientos/`;
				const direction = `${id}`;
				const method = "DELETE";
				const body = null;
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
					await eliminarMovimientoDeCuota(id);
				const updatedMovimientos = await fetchMovimientosProfesional();
				setMovimientos(updatedMovimientos);
					Swal.fire({
						title: "Operación exitosa",
						text: "El registro fue eliminado exitosamente",
						icon: "success",
						showConfirmButton: false,
						timer: 2500,
					});
				}

				// Forzar la actualización del componente MovimientosTab
				// await fetchMovimientos(profesionalId);
			} catch (error) {
				console.error("Error al guardar el registro:", error.message);
				Swal.fire({
					title: "Error",
					text: "Ha ocurrido un error al intentar guardar el registro",
					icon: "error",
				});
			}
		}
	};

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

import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import PagosModal from "./pagosModal";

const Pagos = () => {
	const [pagos, setPagos] = useState([]);
	const [showPagosModal, setShowPagosModal] = useState(false);
	const [selectedPago, setSelectedPago] = useState(null);
	const [modalMode, setModalMode] = useState("");

	const tablaPagosRef = useRef(null);
	const dataTableRef = useRef(null);

	useEffect(() => {
		fetchPagos();
	}, []);

	// Crea el DataTable de pagos
	useEffect(() => {
		if (dataTableRef.current) {
			// Si hay un DataTable existente, limpiamos los datos
			dataTableRef.current.clear().rows.add(pagos).draw();
		} else if (pagos.length && tablaPagosRef.current) {
			dataTableRef.current = $(tablaPagosRef.current).DataTable({
				data: pagos,
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
						title: "Pagos",
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
						// Columna de acciones
						data: null,
						className: "text-center",
						render: function (data, type, row) {
							return `
                            <button class="btn btn-info btn-sm mostrar-btn" data-id="${row.id}"><i class="fa-regular fa-eye"></i> Mostrar</button>
                            <button class="btn btn-warning btn-sm editar-btn" data-id="${row.id}"><i class="fa-regular fa-pen-to-square"></i> Editar</button>
                            <button class="btn btn-danger btn-sm eliminar-btn" data-id="${row.id}"><i class="fa-regular fa-trash-can"></i>  Eliminar</button>
                        `;
						},
						orderable: false,
						searchable: false,
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
				order: [[0, "desc"]],
			});
		}

		$(tablaPagosRef.current).on("click", ".mostrar-btn", function () {
			const rowData = dataTableRef.current
				.row($(this).closest("tr"))
				.data();
			mostrarPago(rowData);
		});

		$(tablaPagosRef.current).on("click", ".editar-btn", function () {
			const rowData = dataTableRef.current
				.row($(this).closest("tr"))
				.data();
			editarPago(rowData);
		});

		$(tablaPagosRef.current).on("click", ".eliminar-btn", function () {
			const rowData = dataTableRef.current
				.row($(this).closest("tr"))
				.data();
			eliminarPago(rowData);
		});
	}, [pagos]);

	const fetchPagos = async () => {
		try {
			const endpoint = "http://localhost:5000/api/movimientos/";
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

			if (response.data && response.data.length > 0) {
				const pagos = [];

				// Filtrar los pagos por tipo de operación "EGRESO"
				const pagosEgresos = response.data.filter(
					(pago) => pago.tipo_operacion === "EGRESO"
				);

				// Iterar sobre los pagos filtrados y realizar el fetch del medio de pago
				for (const pago of pagosEgresos) {
					try {
						const medio = await fetchMedioDePago(pago.medio_id);
						const egreso = {
							id: pago.id,
							fecha: pago.fecha,
							importe: pago.importe,
							medio: medio,
							medio_id: pago.medio_id,
							concepto: pago.concepto,
						};
						pagos.push(egreso);
					} catch (error) {
						// Manejar errores de fetchMedioDePago, si es necesario
						console.error("Error al obtener medio de pago:", error);
					}
				}
				setPagos(pagos);
			} else {
				setPagos([]);
			}
		} catch (error) {
			console.error("Error:", error.message);
			Swal.fire({
				icon: "error",
				title: "Error al cargar datos",
				text: "Hubo un problema al obtener los datos de los pagos.",
			});
		}
	};

	const eliminarPago = async (pago) => {
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
				const endpoint = "http://127.0.0.1:5000/api/movimientos/";
				const direction = pago.id;
				const method = "DELETE";
				const body = false;
				const headers = {
					"Content-Type": "application/json",
					Authorization: localStorage.getItem("token"),
				};

				const data = await apiConnection(
					endpoint,
					direction,
					method,
					body,
					headers
				);

				Swal.fire({
					title: "Eliminado",
					text: "El registro ha sido eliminado correctamente",
					icon: "success",
					showConfirmButton: false,
					timer: 2500,
				});

				// Actualizar la tabla llamando a fetchPagos
				setTimeout(() => {
					setPagos(fetchPagos);
				}, 2500);
				// try {
				// 	// Llamada a la función fetchPagos directamente
				// 	await fetchPagos(setPagos);
				// } catch (error) {
				// 	console.error(
				// 		"Error al eliminar el registro:",
				// 		error.message
				// 	);
				// }
			} catch (error) {
				console.error("Error al eliminar el registro:", error.message);

				Swal.fire({
					title: "Error",
					text: "Ha ocurrido un error al intentar eliminar el registro",
					icon: "error",
				});
			}
		}
	};

	const mostrarPago = (data) => {
		setSelectedPago(data);
		setModalMode("mostrar");
		setShowPagosModal(true);
	};

	const editarPago = (data) => {
		setSelectedPago(data);
		setModalMode("editar");
		setShowPagosModal(true);
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

	useEffect(() => {
		if (!showPagosModal) {
			fetchPagos(setPagos);
			setSelectedPago(null);
		}
	}, [showPagosModal]);

	const openPagosModal = () => setShowPagosModal(true);

	const closePagosModal = () => setShowPagosModal(false);

	return (
		<>
			<div className="content-wrapper">
				<div className="content-header">
					<div className="container-fluid">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1 className="m-0">Pagos</h1>
							</div>
						</div>
					</div>
				</div>
				<div className="content m-3">
					<div className="card">
						<div className="card-header bg-white">
							<div className="justify-content-end text-end d-flex">
								<button
									type="button"
									className="btn btn-primary"
									id="abrirModalAgregar"
									onClick={() => {
										setModalMode("agregar");
										openPagosModal();
									}}>
									<i className="fa-regular fa-square-plus"></i>{" "}
									Agregar
								</button>
							</div>
						</div>
						<div className="card-body">
							<div className="container-fluid mt-0">
								<table
									ref={tablaPagosRef}
									id="tabla_pagos"
									className="table table-hover table-sm">
									<thead className="table-dark">
										<tr>
											<th>Fecha</th>
											<th>Importe</th>
											<th>Medio</th>
											<th>Concepto</th>
											<th className="text-center">
												Acciones
											</th>
										</tr>
									</thead>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			<PagosModal
				showModal={showPagosModal}
				closeModal={closePagosModal}
				data={selectedPago}
				modalMode={modalMode}
				fetchPagos={fetchPagos}
			/>
		</>
	);
};

export default Pagos;

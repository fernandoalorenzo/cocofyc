import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import ProfesionalesModal from "./profesionalesModal";
import GestionesModal from "./profesionalesGestionModal";

const ProfesionalesTabla = () => {
	const [data, setData] = useState([]);
	const [showProfesionalesModal, setShowProfesionalesModal] = useState(false);
	const [selectedProfesional, setSelectedProfesional] = useState(null);
	const [modalMode, setModalMode] = useState("");
	const [estadosMatriculas, setEstadosMatriculas] = useState([]);
	const [showGestionesModal, setShowGestionesModal] = useState(false);
	const [showActive, setShowActive] = useState(true);
	const [showInactive, setShowInactive] = useState(true);

	const tablaProfesionalesRef = useRef(null);
	const dataTableRef = useRef(null);

	const fetchProfesionales = async () => {
		try {
			const endpoint = "http://localhost:5000/api/profesionales";
			const direction = "";
			const method = "GET";
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

			setData(data.data);
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	// OBTENER LISTA DE REGISTROS
	useEffect(() => {
		fetchProfesionales();
	}, []);

	// OBTENER LISTA DE ESTADOS DE MATRICULA
	const fetchEstadosMatriculas = async () => {
		try {
			const endpoint = "http://127.0.0.1:5000/api/estados";
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
			setEstadosMatriculas(response.data);
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	useEffect(() => {
		fetchEstadosMatriculas();
	}, []);

	const handleEliminar = async (id) => {
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
				const endpoint = "http://127.0.0.1:5000/api/profesionales/";
				const direction = id;
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

				// Actualizar la tabla llamando a fetchProfesionales
				setTimeout(() => {
					fetchProfesionales();
				}, 2500);
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

	// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ OBTENER MOVIMIENTOS DEL PROFESIONAL ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
	const [movimientos, setMovimientos] = useState([]);
	const fetchMovimientos = async (profesional) => {
		const profesionalId = profesional.id;
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
							fecha: movimiento.fecha,
							importe: movimiento.importe,
							medio: medio,
							concepto: movimiento.concepto,
						};
						movimientos.push(ingreso);
					} catch (error) {
						// Manejar errores de fetchMedioDePago, si es necesario
						console.error("Error al obtener medio de pago:", error);
					}
				}
				setMovimientos(movimientos);
			} else {
				setMovimientos([]);
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
	// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ OBTENER MOVIMIENTOS DEL PROFESIONAL ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

	// DATATABLE
	useEffect(() => {
		if (dataTableRef.current) {
			dataTableRef.current.clear().rows.add(data).draw();
		} else if (data.length && tablaProfesionalesRef.current) {
			dataTableRef.current = $(tablaProfesionalesRef.current).DataTable({
				data: data,
				language: {
					buttons: {
						copy: "Copiar",
						colvis: "Visibilidad",
						colvisRestore: "Restaurar visibilidad",
						copyTitle: "Copiar al portapapeles",
						copySuccess: {
							1: "Copiado 1 registro al portapapeles",
							_: "Copiados %d registros al portapapeles",
						},
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
				columnDefs: [
					{
						targets: 0,
						render: function (data, type, row) {
							if (type === "display") {
								// Formatear la fecha de 'aaaa-mm-dd' a 'dd/mm/aaaa'
								const parts = data.split("-");
								if (parts.length === 3) {
									return `${parts[2]}/${parts[1]}/${parts[0]}`;
								}
							}
							return data;
						},
					},
					{
						targets: 5,
						render: function (data, type, row) {
							if (data === "0000-00-00") {
								return "";
							}
							if (type === "display") {
								// Formatear la fecha de 'aaaa-mm-dd' a 'dd/mm/aaaa'
								if (data && typeof data === "string") {
									const parts = data.split("-");
									if (parts.length === 3) {
										return `${parts[2]}/${parts[1]}/${parts[0]}`;
									}
								}
							}
							return data;
						},
					},
				],
				columns: [
					{
						data: "nombre",
					},
					{
						data: "dni",
					},
					{
						data: "matricula",
					},
					{
						data: "telefono",
					},
					{
						data: "email",
					},
					{
						data: "localidad",
					},
					{
						data: "estado_matricula_id",
					},
					{
						data: "activo",
					},
					{
						// Columna de acciones
						data: null,
						className: "text-center",
						render: function (data, type, row) {
							return `
                            <button class="btn btn-info btn-sm mostrar-btn" data-id="${row.id}"><i class="fa-regular fa-eye"></i> Mostrar</button>
                            <button class="btn btn-warning btn-sm editar-btn" data-id="${row.id}"><i class="fa-regular fa-pen-to-square"></i> Editar</button>
                            <button class="btn btn-danger btn-sm eliminar-btn" data-id="${row.id}"><i class="fa-regular fa-trash-can"></i>  Eliminar</button>
							<button class="btn btn-success btn-sm gestion-btn" data-id="${row.id}"><i class="fa-solid fa-money-check-dollar"></i>  Gestión</button>
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
				autoWidth: true,
				paging: true,
				searching: true,
				ordering: true,
				info: true,
				order: [[0, "desc"]],
			});
		}

		// Asignar eventos click a los botones de acción
		$(tablaProfesionalesRef.current).on("click", ".mostrar-btn", function () {
			const rowData = dataTableRef.current
				.row($(this).closest("tr"))
				.data();
			handleMostrar(rowData, "mostrar");
		});

		$(tablaProfesionalesRef.current).on("click", ".editar-btn", function () {
			const rowData = dataTableRef.current
				.row($(this).closest("tr"))
				.data();
			handleMostrar(rowData, "editar");
		});

		$(tablaProfesionalesRef.current).on("click", ".eliminar-btn", function () {
			const rowData = dataTableRef.current
				.row($(this).closest("tr"))
				.data();
			handleEliminar(rowData);
		});

		$(tablaProfesionalesRef.current).on(
			"click",
			".gestion-btn",
			function () {
				const rowData = dataTableRef.current
					.row($(this).closest("tr"))
					.data();
				mostrarGestiones(rowData);
			}
		);
	}, [data]);

	// const columns = React.useMemo(
	// 	() => [
	// 		{
	// 			Header: "Nombre",
	// 			accessor: "nombre",
	// 		},
	// 		{
	// 			Header: "DNI",
	// 			accessor: "dni",
	// 		},
	// 		{
	// 			Header: "Matrícula",
	// 			accessor: "matricula",
	// 		},
	// 		{
	// 			Header: "Teléfono",
	// 			accessor: "telefono",
	// 		},
	// 		{
	// 			Header: "e-Mail",
	// 			accessor: "email",
	// 		},
	// 		{
	// 			Header: "Localidad",
	// 			accessor: "localidad",
	// 		},
	// 		{
	// 			Header: "Estado Mat.",
	// 			accessor: "estado_matricula_id",
	// 			Cell: ({ value }) => {
	// 				const estado = estadosMatriculas.find(
	// 					(estado) => estado.id === value
	// 				);
	// 				return estado ? estado.estado : "N/D";
	// 			},
	// 		},
	// 		{
	// 			Header: "Activo",
	// 			accessor: "activo",
	// 			Cell: ({ row }) => (
	// 				<>
	// 					<div className="form-switch">
	// 						<input
	// 							className="form-check-input"
	// 							type="checkbox"
	// 							checked={row.original.activo}
	// 							onChange={() => false}
	// 							id={`activo-checkbox-${row.index}`}
	// 						/>
	// 						<input
	// 							type="hidden"
	// 							name={`activo-${row.index}`}
	// 							value={row.original.activo ? "1" : "0"}
	// 						/>
	// 					</div>
	// 				</>
	// 			),
	// 			sortType: (rowA, rowB, columnId) => {
	// 				// Convertir los valores a números para que la comparación sea numérica
	// 				const valueA = rowA.original.activo ? 1 : 0;
	// 				const valueB = rowB.original.activo ? 1 : 0;

	// 				// Comparar los valores y devolver el resultado
	// 				return valueA - valueB;
	// 			},
	// 		},
	// 		{
	// 			Header: "Acciones",
	// 			accessor: "id",
	// 			Cell: ({ row }) => (
	// 				<div>
	// 					<button
	// 						className="btn btn-info mx-2 btn-sm"
	// 						onClick={() =>
	// 							handleMostrar(row.original, "mostrar")
	// 						}>
	// 						<i className="fa-regular fa-eye"></i> Mostrar
	// 					</button>
	// 					<button
	// 						className="btn btn-warning mx-2 btn-sm"
	// 						onClick={() => {
	// 							handleMostrar(row.original, "editar");
	// 						}}>
	// 						<i className="fa-regular fa-pen-to-square"></i>{" "}
	// 						Editar
	// 					</button>
	// 					<button
	// 						className="btn btn-danger mx-2 btn-sm"
	// 						onClick={() => handleEliminar(row.original.id)}>
	// 						<i className="fa-regular fa-trash-can"></i> Eliminar
	// 					</button>
	// 					<button
	// 						className="btn btn-outline-success bg-white border-3 mx-2 btn-sm"
	// 						onClick={() => mostrarGestiones(row.original)}>
	// 						<i className="fa-solid fa-money-check-dollar"></i>{" "}
	// 						Gestión
	// 					</button>
	// 				</div>
	// 			),
	// 		},
	// 	],
	// 	[estadosMatriculas]
	// );

	const handleMostrar = (profesional, mode) => {
		setSelectedProfesional(profesional);
		setModalMode(mode);
		setShowProfesionalesModal(true);
	};

	const mostrarGestiones = (profesional) => {
		setSelectedProfesional(profesional);
		fetchMovimientos(profesional);
		setShowGestionesModal(true);
	};

	const closeGestionesModal = () => {
		setShowGestionesModal(false);
		setSelectedProfesional(null);
		setMovimientos([]);
	};

	const handleSwitchChange = (type) => {
		if (type === "active") setShowActive(!showActive);
		else if (type === "inactive") setShowInactive(!showInactive);
	};

	const openProfesionalesModal = () => setShowProfesionalesModal(true);

	const closeProfesionalesModal = () => setShowProfesionalesModal(false);

	useEffect(() => {
		if (!showProfesionalesModal) {
			setSelectedProfesional(null);
		}
	}, [showProfesionalesModal]);

	return (
		<>
			<div className="content-wrapper">
				<div className="content-header">
					<div className="container-fluid">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1 className="m-0">Profesionales</h1>
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
										openProfesionalesModal();
									}}>
									<i className="fa-regular fa-square-plus"></i>{" "}
									Agregar
								</button>
							</div>
						</div>
						<div className="card-body">
							<div className="container-fluid mt-0">
								<table
									ref={tablaProfesionalesRef}
									id="tabla_profesionales"
									className="table table-hover table-sm">
									<thead className="table-dark">
										<tr>
											<th>Nombre</th>
											<th>DNI</th>
											<th>Matrícula</th>
											<th>Teléfono</th>
											<th>e-Mail</th>
											<th>Localidad</th>
											<th>Estado Matr.</th>
											<th>Activo</th>
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
			{/* <div className="content-wrapper">
				<div className="content-header">
					<div className="container-fluid">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1 className="m-0">Profesionales</h1>
							</div>
						</div>
					</div>
				</div>
				<div>
					<section className="content">
						<div className="container-fluid mt-0">
							<div className="row d-flex mb-2 m-0">
								<label
									htmlFor="filterText"
									className="form-label m-0">
									Opciones de Filtro:
								</label>
								<div className="col d-flex justify-content-start border rounded border-primary pt-2 ms-1">
									<div className="col-2">
										<input
											type="checkbox"
											className="btn-check"
											id="showActive"
											autoComplete="off"
											checked={showActive}
											onChange={() =>
												handleSwitchChange("active")
											}
										/>
										<label
											className="btn btn-outline-primary"
											htmlFor="showActive">
											Activos
										</label>
									</div>
									<div className="col-2">
										<input
											type="checkbox"
											className="btn-check"
											id="showInactive"
											autoComplete="off"
											checked={showInactive}
											onChange={() =>
												handleSwitchChange("inactive")
											}
										/>
										<label
											className="btn btn-outline-primary"
											htmlFor="showInactive">
											Inactivos
										</label>
									</div>
									<div className="col">
										<div className="input-group">
											<input
												type="text"
												className="form-control"
												id="filterText"
												name="filterText"
												placeholder="Filtrar..."
												value={filterText}
												onChange={handleFilterChange}
											/>
											{filterText && (
												<div className="input-group-append">
													<button
														className="btn btn-outline-primary bg-white"
														title="Limpiar búsqueda"
														type="button"
														onClick={() =>
															setFilterText("")
														}>
														<i className="fa-regular fa-circle-xmark"></i>
													</button>
												</div>
											)}
										</div>
									</div>
								</div>
								<div className="col-6 justify-content-end text-end align-items-center d-flex">
									<button
										type="button"
										className="btn btn-primary"
										id="abrirModalAgregar"
										onClick={() => {
											setModalMode("agregar");
											openProfesionalesModal();
										}}>
										<i className="fa-regular fa-square-plus"></i>{" "}
										Agregar
									</button>
								</div>
							</div>
							<table
								{...getTableProps()}
								className="table table-hover table-striped table-responsive-sm table-sm table-borderless align-middle mt-3">
								<thead className="table-dark">
									{headerGroups.map((headerGroup) => (
										<tr
											{...headerGroup.getHeaderGroupProps()}>
											{headerGroup.headers.map(
												(column) => (
													<th
														{...column.getHeaderProps(
															column.getSortByToggleProps()
														)}
														className={`${
															column.Header ===
																"Activo" ||
															column.Header ===
																"DNI" ||
															column.Header ===
																"Matrícula" ||
															column.Header ===
																"Teléfono" ||
															column.Header ===
																"Acciones"
																? "text-center"
																: ""
														}`}>
														{column.render(
															"Header"
														)}
														<span className="ms-2 p-1 text-warning">
															{column.isSorted
																? column.isSortedDesc
																	? "↓"
																	: "↑"
																: ""}
														</span>
													</th>
												)
											)}
										</tr>
									))}
								</thead>
								<tbody {...getTableBodyProps()}>
									{page.map((row) => {
										prepareRow(row);
										return (
											<tr {...row.getRowProps()}>
												{row.cells.map((cell) => {
													return (
														<td
															{...cell.getCellProps()}
															className={`${
																cell.column
																	.Header ===
																	"DNI" ||
																cell.column
																	.Header ===
																	"Matrícula" ||
																cell.column
																	.Header ===
																	"Activo" ||
																cell.column
																	.Header ===
																	"Teléfono"
																	? "text-center"
																	: "" ||
																	  cell
																			.column
																			.Header ===
																			"Acciones"
																	? "text-center"
																	: ""
															}`}
															{...cell.getCellProps()}>
															{cell.render(
																"Cell"
															)}
														</td>
													);
												})}
											</tr>
										);
									})}
								</tbody>
							</table>
							<div className="container-fluid align-items-center">
								<div className="row justify-content-between align-items-center">
									<div className="col col-4 d-flex justify-content-start align-items-center">
										<div className="col">
											Mostrando {pageIndex * pageSize + 1}{" "}
											-{" "}
											{pageIndex * pageSize + page.length}{" "}
											de {data.length} registros
										</div>
										<button
											className="btn btn-sm btn-outline-primary ms-1"
											name="first"
											onClick={() => gotoPage(0)}
											disabled={!canPreviousPage}>
											<i className="fa-solid fa-backward-step"></i>
										</button>{" "}
										<button
											className="btn btn-sm btn-outline-primary ms-1"
											name="previous"
											onClick={() => previousPage()}
											disabled={!canPreviousPage}>
											<i className="fa-solid fa-caret-left"></i>
										</button>{" "}
										<button
											className="btn btn-sm btn-outline-primary ms-1"
											name="next"
											onClick={() => nextPage()}
											disabled={!canNextPage}>
											<i className="fa-solid fa-caret-right"></i>
										</button>{" "}
										<button
											className="btn btn-sm btn-outline-primary ms-1"
											name="last"
											onClick={() =>
												gotoPage(pageCount - 1)
											}
											disabled={!canNextPage}>
											<i className="fa-solid fa-forward-step"></i>
										</button>{" "}
									</div>
									<div className="col col-4 d-flex justify-content-evenly content-align-center align-items-center">
										<span>
											Página{" "}
											<strong>{pageIndex + 1}</strong> de{" "}
											<strong>
												{pageOptions.length}
											</strong>
										</span>
										<span>Ir a la página: </span>
										<input
											className="form-control form-control-sm"
											type="number"
											name="page"
											defaultValue={pageIndex + 1}
											onChange={(e) => {
												const page = e.target.value
													? Number(e.target.value) - 1
													: 0;
												gotoPage(page);
											}}
											style={{ width: "4rem" }}
										/>
									</div>
									<div className="col col-4 d-flex justify-content-end align-items-center">
										<span>Reg. por Pág. </span>
										<select
											className="form-select form-select-sm w-25"
											value={selectedPageSize}
											name="pageSize"
											onChange={handlePageSizeChange}>
											{[10, 25, 50, 100].map((size) => (
												<option key={size} value={size}>
													{size}
												</option>
											))}
										</select>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div> */}
			<ProfesionalesModal
				showModal={showProfesionalesModal}
				closeModal={closeProfesionalesModal}
				data={selectedProfesional}
				modalMode={modalMode}
				fetchProfesionales={fetchProfesionales}
			/>
			<GestionesModal
				showModal={showGestionesModal}
				closeModal={closeGestionesModal}
				data={selectedProfesional}
				movimientos={movimientos}
			/>
		</>
	);
};

export default ProfesionalesTabla;

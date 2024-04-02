import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import ProfesionalesModal from "./profesionalesModal";
import GestionesModal from "./profesionalesGestionModal";

const ProfesionalesTabla = () => {
	const [data, setData] = useState([]);
	const [filterText, setFilterText] = useState("");
	const [selectedPageSize, setSelectedPageSize] = useState(10);
	const [showProfesionalesModal, setShowProfesionalesModal] = useState(false);
	const [selectedProfesional, setSelectedProfesional] = useState(null);
	const [modalMode, setModalMode] = useState("");
	const [estadosMatriculas, setEstadosMatriculas] = useState([]);
	const [showGestionesModal, setShowGestionesModal] = useState(false);
	const [showActive, setShowActive] = useState(true);
	const [showInactive, setShowInactive] = useState(true);

	const fetchProfesionales = async () => {
		try {
			const endpoint = "http://127.0.0.1:5000/api/profesionales";
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

	const filteredData = useMemo(() => {
		if (!filterText && showActive && showInactive) return data;

		return data.filter((row) => {
			const estadoMatricula = estadosMatriculas.find(
				(estado) => estado.id === row.estado_matricula_id
			);

			const isActive = row.activo;

			// Filtrar por estado de matrícula
			if (
				estadoMatricula &&
				estadoMatricula.estado
					.toLowerCase()
					.includes(filterText.toLowerCase())
			) {
				if ((!showActive && isActive) || (!showInactive && !isActive))
					return false; // Verificar estado activo/inactivo
				return true;
			}

			if (filterText) {
				const isFiltered = Object.entries(row).some(
					([key, cellValue]) =>
						key !== "id" &&
						cellValue &&
						cellValue
							.toString()
							.toLowerCase()
							.includes(filterText.toLowerCase())
				);

				if (!isFiltered) return false;
			}

			if ((!showActive && isActive) || (!showInactive && !isActive))
				return false; // Verificar estado activo/inactivo

			return true;
		});
	}, [data, filterText, estadosMatriculas, showActive, showInactive]);

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

	const columns = React.useMemo(
		() => [
			{
				Header: "Nombre",
				accessor: "nombre",
			},
			{
				Header: "DNI",
				accessor: "dni",
			},
			{
				Header: "Matrícula",
				accessor: "matricula",
			},
			{
				Header: "Teléfono",
				accessor: "telefono",
			},
			{
				Header: "e-Mail",
				accessor: "email",
			},
			{
				Header: "Localidad",
				accessor: "localidad",
			},
			{
				Header: "Estado Mat.",
				accessor: "estado_matricula_id",
				Cell: ({ value }) => {
					const estado = estadosMatriculas.find(
						(estado) => estado.id === value
					);
					return estado ? estado.estado : "N/D";
				},
			},
			{
				Header: "Activo",
				accessor: "activo",
				Cell: ({ row }) => (
					<>
						<div className="form-switch">
							<input
								className="form-check-input"
								type="checkbox"
								checked={row.original.activo}
								onChange={() => false}
								id={`activo-checkbox-${row.index}`}
							/>
							<input
								type="hidden"
								name={`activo-${row.index}`}
								value={row.original.activo ? "1" : "0"}
							/>
						</div>
					</>
				),
				sortType: (rowA, rowB, columnId) => {
					// Convertir los valores a números para que la comparación sea numérica
					const valueA = rowA.original.activo ? 1 : 0;
					const valueB = rowB.original.activo ? 1 : 0;

					// Comparar los valores y devolver el resultado
					return valueA - valueB;
				},
			},
			{
				Header: "Acciones",
				accessor: "id",
				Cell: ({ row }) => (
					<div>
						<button
							className="btn btn-info mx-2 btn-sm"
							onClick={() =>
								handleMostrar(row.original, "mostrar")
							}>
							<i className="fa-regular fa-eye"></i> Mostrar
						</button>
						<button
							className="btn btn-warning mx-2 btn-sm"
							onClick={() => {
								handleMostrar(row.original, "editar");
							}}>
							<i className="fa-regular fa-pen-to-square"></i>{" "}
							Editar
						</button>
						<button
							className="btn btn-danger mx-2 btn-sm"
							onClick={() => handleEliminar(row.original.id)}>
							<i className="fa-regular fa-trash-can"></i> Eliminar
						</button>
						<button
							className="btn btn-outline-success bg-white border-3 mx-2 btn-sm"
							onClick={() => mostrarGestiones(row.original)}>
							<i className="fa-solid fa-money-check-dollar"></i>{" "}
							Gestión
						</button>
					</div>
				),
			},
		],
		[estadosMatriculas]
	);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		page,
		prepareRow,
		canPreviousPage,
		canNextPage,
		pageOptions,
		gotoPage,
		nextPage,
		previousPage,
		pageCount,
		state: { pageIndex, pageSize },
		setPageSize: updatePageSize,
	} = useTable(
		{
			columns,
			data: filteredData,
			initialState: {
				pageIndex: 0,
				pageSize: selectedPageSize,
				sortBy: [{ id: "nombre", desc: false }],
			},
			autoResetPage: false,
			autoResetPageSize: false,
		},
		useSortBy,
		usePagination
	);

	const handleMostrar = (profesional, mode) => {
		console.log(profesional);
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

	const handleFilterChange = (e) => {
		const value = e.target.value || "";
		setFilterText(value);
	};

	const handleSwitchChange = (type) => {
		if (type === "active") setShowActive(!showActive);
		else if (type === "inactive") setShowInactive(!showInactive);
	};

	const handlePageSizeChange = (e) => {
		const size = parseInt(e.target.value, 10);
		setSelectedPageSize(size);
		gotoPage(0);
		updatePageSize(size); // Usar updatePageSize
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
			</div>
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
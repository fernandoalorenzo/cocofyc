import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import CargarPagosTab from "./profesionalesPagosTab";

const GestionesModal = ({ showModal, closeModal, data }) => {
	const [profesionalId, setProfesionalId] = useState(null);
	const [movimientos, setMovimientos] = useState([]);
	const [activeTab, setActiveTab] = useState("cargarPago");
	const [loading, setLoading] = useState(false);
	const [globalFilter, setGlobalFilter] = useState("");

	const user = JSON.parse(localStorage.getItem("user")) || {};

	useEffect(() => {
		if (showModal && data && data.id) {
			fetchMovimientos(data.id);
		} else {
			setMovimientos([]);
		}
	}, [showModal, data]);

	useEffect(() => {
		if (data && data.id) {
			setProfesionalId(data.id);
		}
	}, [data]);

	useEffect(() => {
		if (showModal) {
			setActiveTab("cargarPago");
		} else {
			setActiveTab("cargarPago");
			setProfesionalId("");
			setMovimientos([]);
		}
	}, [showModal]);

	const handleTabChange = (tabId) => {
		setActiveTab(tabId);
	};

	useEffect(() => {
		if (profesionalId) {
			fetchMovimientos();
		}
	}, [profesionalId]);

	useEffect(() => {
		if (profesionalId) {
			fetchMovimientos();
		}
	}, [showModal]);

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

	const columns = useMemo(
		() => [
			{
				Header: "Fecha",
				accessor: "fecha",
			},
			{
				Header: "Importe",
				accessor: "importe",
			},
			{
				Header: "Medio de Pago",
				accessor: "medio",
			},
			{
				Header: "Concepto",
				accessor: "concepto",
			},
		],
		[movimientos]
	);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		state: { pageIndex, pageSize },
	} = useTable(
		{
			columns,
			data: movimientos,
			initialState: {
				sortBy: [{ id: "fecha", desc: true }],
			},
			filterTypes: {
				text: (rows, id, filterValue) => {
					return rows.filter((row) => {
						const rowValue = row.values[id];
						return rowValue !== undefined
							? String(rowValue)
									.toLowerCase()
									.includes(filterValue.toLowerCase())
							: true;
					});
				},
			},
			autoResetFilters: false, // Deshabilitar el reinicio automático de los filtros
		},
		useFilters,
		useSortBy,
		usePagination
	);

	const handleFilterChange = (e) => {
		const value = e.target.value || undefined; // Si el valor es vacío, establece undefined para eliminar el filtro
		setGlobalFilter(value);
	};

	const filteredRows = globalFilter
		? rows.filter((row) =>
				row.values.fecha
					.toLowerCase()
					.includes(globalFilter.toLowerCase())
		  )
		: rows;

	return (
		<div
			className={`modal fade ${showModal ? "show" : ""}`}
			tabIndex="-1"
			style={{ display: showModal ? "block" : "none" }}
			id="staticBackdrop"
			data-bs-target="#staticBackdrop"
			data-bs-backdrop="static"
			data-bs-keyboard="false"
			aria-labelledby="staticBackdropLabel"
			aria-hidden={!showModal}>
			<div className="modal-dialog modal-xl">
				<div className="modal-content">
					<div className="modal-header bg-primary">
						<h5 className="modal-title">
							Gestión de
							{data && data.nombre ? (
								<span>
									{" "}
									<span className="text-warning">
										{data.nombre}
									</span>
								</span>
							) : (
								<span></span>
							)}
						</h5>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={closeModal}></button>
					</div>
					<div className="modal-body">
						{/* ********************* PESTAÑAS ********************* */}
						<ul
							className="nav nav-tabs bg-secondary-subtle"
							id="myTab"
							role="tablist">
							{/********************** CARGAR PAGO **********************/}
							<li className="nav-item" role="presentation">
								<button
									className={`nav-link ${
										activeTab === "cargarPago"
											? "active"
											: ""
									}`}
									onClick={() =>
										handleTabChange("cargarPago")
									}
									id="cargarPago-tab"
									data-bs-toggle="tab"
									data-bs-target="#cargarPago"
									type="button"
									role="tab"
									aria-controls="cargarPago"
									aria-selected={activeTab === "cargarPago"}>
									Cargar Pago
								</button>
							</li>
							{/********************** MOVIMIENTOS **********************/}
							<li className="nav-item" role="presentation">
								<button
									className={`nav-link ${
										activeTab === "movimientos"
											? "active"
											: ""
									}`}
									onClick={() =>
										handleTabChange("movimientos")
									}
									id="movimientos-tab"
									data-bs-toggle="tab"
									data-bs-target="#movimientos"
									type="button"
									role="tab"
									aria-controls="movimientos"
									aria-selected={
										activeTab === "movimientos"
											? "true"
											: "false"
									}>
									Movimientos
								</button>
							</li>
						</ul>
						{/* ********************* CONTENIDO ********************* */}
						<div className="tab-content" id="myTabContent">
							{/* ********************* PAGOS ********************* */}
							<div
								className={`tab-pane fade ${
									activeTab === "cargarPago"
										? "show active"
										: ""
								} bg-dark-subtle p-2`}
								id="cargarPago"
								role="tabpanel"
								aria-labelledby="cargarPago-tab">
								<CargarPagosTab profesionalId={profesionalId} />
							</div>
							{/* ********************* MOVIMIENTOS ********************* */}
							<div
								className={`tab-pane fade ${
									activeTab === "movimientos"
										? "show active"
										: ""
								}`}
								id="movimientos"
								role="tabpanel"
								aria-labelledby="movimientos-tab">
								<div className="container-fluid mt-4">
									<div className="col d-flex justify-content-start border rounded border-primary pt-2 ms-1">
										<div className="col">
											<div className="input-group">
												<input
													type="text"
													className="form-control"
													id="filterText"
													name="filterText"
													placeholder="Filtrar..."
													value={globalFilter || ""}
													onChange={
														handleFilterChange
													}
												/>
												{/* {filterText && (
													<div className="input-group-append">
														<button
															className="btn btn-outline-primary bg-white"
															title="Limpiar búsqueda"
															type="button"
															onClick={() =>
																setFilterText(
																	""
																)
															}>
															<i className="fa-regular fa-circle-xmark"></i>
														</button>
													</div>
												)} */}
											</div>
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
																className={
																	column.isSorted
																		? column.isSortedDesc
																			? "sorted-desc"
																			: "sorted-asc"
																		: ""
																}>
																{column.render(
																	"Header"
																)}{" "}
																{column.isSorted ? (
																	column.isSortedDesc ? (
																		<i
																			className="fa-solid fa-sort-desc"
																			style={{
																				color: "#FFD43B",
																			}}></i>
																	) : (
																		<i
																			className="fa-solid fa-sort-asc"
																			style={{
																				color: "#FFD43B",
																			}}></i>
																	)
																) : (
																	<i className="fa-solid fa-sort"></i>
																)}
															</th>
														)
													)}
												</tr>
											))}
										</thead>
										<tbody {...getTableBodyProps()}>
											{rows.map((row) => {
												prepareRow(row);
												return (
													<tr {...row.getRowProps()}>
														{row.cells.map(
															(cell) => (
																<td
																	{...cell.getCellProps()}>
																	{cell.render(
																		"Cell"
																	)}
																</td>
															)
														)}
													</tr>
												);
											})}
										</tbody>
									</table>
									{loading && (
										<div className="text-center">
											Cargando...
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GestionesModal;

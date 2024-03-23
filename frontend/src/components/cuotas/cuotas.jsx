import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import CuotasModal from "./cuotasModal";

const Cuotas = () => {
	const [data, setData] = useState([]);
	const [filterText, setFilterText] = useState("");
	const [selectedPageSize, setSelectedPageSize] = useState(10);
	const [showCuotasModal, setShowCuotasModal] = useState(false);
	const [selectedCuota, setSelectedCuota] = useState(null);
	const [modalMode, setModalMode] = useState(""); // Definir modalMode como estado
	useState(false);

	const fetchCuotas = async () => {
		try {
			const endpoint = "http://localhost:5000/api/cuotas/";
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
		fetchCuotas();
	}, []);

	const filteredData = useMemo(() => {
		if (!filterText) return data;
		return data.filter((row) =>
			Object.entries(row).some(
				([key, cellValue]) =>
					key !== "id" &&
					cellValue &&
					cellValue
						.toString()
						.toLowerCase()
						.includes(filterText.toLowerCase())
			)
		);
	}, [data, filterText]);

	const handleEliminar = async (id) => {
		// Verificar si ya estan generadas las cuotas
		try {
			const endpoint =
				"http://localhost:5000/api/cuotas/cuotas-generadas/";
			const direction = id;
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

			if (data.data.length > 0) {
				Swal.fire({
					title: "Advertencia",
					text: "Esta cuota tiene registros relacionados con profesionales. No puede ser eliminada.",
					icon: "warning",
					confirmButtonText: "Continuar",
				});
				return;
			}
		} catch (error) {
			console.error("Error al generar las cuotas:", error.message);
		}

		// Confirmar eliminación
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
				const endpoint = "http://127.0.0.1:5000/api/cuotas/";
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

				// Actualizar la tabla llamando a fetchCuotas
				setTimeout(() => {
					fetchCuotas();
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

	const handleGenerar = async (id) => {
		// Verificar si ya estan generadas las cuotas
		try {
			const endpoint =
				"http://localhost:5000/api/cuotas/cuotas-generadas/";
			const direction = id;
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

			if (data.data.length > 0) {
				Swal.fire({
					title: "Error",
					text: "Las cuotas ya están generadas",
					icon: "error",
					confirmButtonText: "OK",
				});
				return;
			}
		} catch (error) {
			console.error("Error al generar las cuotas:", error.message);
		}

		const result = await Swal.fire({
			title: "¿Estás seguro?",
			text: "Esta acción generará una cuota para cada Profesional activo y no podrá deshacerla.",
			icon: "warning",
			showCancelButton: true,
			showConfirmButton: true,
			cancelButtonColor: "9B9B9B",
			confirmButtonText: "Generar",
			cancelButtonText: "Cancelar",
		});

		// Si el usuario no confirma la generación, no hace nada
		if (!result.isConfirmed) return;

		try {
			const endpoint =
				"http://localhost:5000/api/profesionales/generar-cuotas/";
			const direction = "";
			const method = "POST";
			const body = {
				cuotaId: id, // Envía el ID de la cuota seleccionada al backend
			};
			const headers = {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			};

			// Realiza la solicitud al backend
			const response = await apiConnection(
				endpoint,
				direction,
				method,
				body,
				headers
			);

			// Muestra una notificación o mensaje de éxito
			Swal.fire({
				title: "Cuotas generadas",
				text: "Los registros han sido generados correctamente",
				icon: "success",
				showConfirmButton: false,
				timer: 2500,
			});

			// Actualiza la tabla llamando a fetchCuotas
			fetchCuotas();
		} catch (error) {
			console.error("Error al generar los registros:", error.message);

			// Muestra una notificación o mensaje de error
			Swal.fire({
				title: "Error",
				text: "Ha ocurrido un error al intentar generar los registros",
				icon: "error",
			});
		}
	};

	const columns = React.useMemo(
		() => [
			{
				Header: "Cuota",
				accessor: "cuota",
			},
			{
				Header: "Vencimiento",
				accessor: "vencimiento",
				Cell: ({ value }) => {
					// Dividir la cadena de fecha en año, mes y día
					const [year, month, day] = value.split("-");
					// Crear un nuevo objeto de fecha
					const date = new Date(year, month - 1, day); // Restar 1 al mes porque en JavaScript los meses van de 0 a 11
					// Obtener el día, mes y año con el formato deseado
					const formattedDate = `${day.padStart(
						2,
						"0"
					)}-${month.padStart(2, "0")}-${year}`;
					return formattedDate;
				},
			},
			{
				Header: "Importe",
				accessor: "importe",
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
							className="btn btn-outline-dark bg-secondary mx-2 btn-sm"
							onClick={() => handleGenerar(row.original.id)}>
							<i className="fa-regular fa-credit-card"></i>{" "}
							Generar
						</button>
					</div>
				),
			},
		],
		[]
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
				sortBy: [{ id: "cuota", desc: false }],
			},
			autoResetPage: false,
			autoResetPageSize: false,
		},
		useSortBy,
		usePagination
	);

	const handleMostrar = (cuota, mode) => {
		setSelectedCuota(cuota);
		setModalMode(mode);
		setShowCuotasModal(true);
	};

	const handleFilterChange = (e) => {
		const value = e.target.value || "";
		setFilterText(value);
	};

	const handlePageSizeChange = (e) => {
		const size = parseInt(e.target.value, 10);
		setSelectedPageSize(size);
		gotoPage(0);
		updatePageSize(size); // Usar updatePageSize
	};

	const openCuotasModal = () => setShowCuotasModal(true);

	const closeCuotasModal = () => setShowCuotasModal(false);

	useEffect(() => {
		if (!showCuotasModal) {
			setSelectedCuota(null);
		}
	}, [showCuotasModal]);

	return (
		<>
			<div className="content-wrapper">
				<div className="content-header">
					<div className="container-fluid">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1 className="m-0">Cuotas</h1>
							</div>
						</div>
					</div>
				</div>
				<div>
					<section className="content">
						<div className="container-fluid">
							<div className="row d-flex mb-2 m-0">
								<label
									htmlFor="filterText"
									className="form-label m-0">
									Opciones de Filtro:
								</label>
								<div className="col d-flex justify-content-start border rounded border-primary py-2">
									<div className="col">
										<div className="input-group">
											<input
												type="text"
												className="form-control"
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
											openCuotasModal();
										}}>
										<i className="fa-regular fa-square-plus"></i>{" "}
										Agregar
									</button>
								</div>
							</div>

							<table
								{...getTableProps()}
								className="table table-hover table-striped table-responsive-sm table-sm table-borderless align-middle">
								<thead className="table-primary">
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
																"CUIT" ||
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
																	"CUIT" ||
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
			<CuotasModal
				showModal={showCuotasModal}
				closeModal={closeCuotasModal}
				data={selectedCuota}
				modalMode={modalMode}
				fetchCuotas={fetchCuotas}
			/>
		</>
	);
};

export default Cuotas;

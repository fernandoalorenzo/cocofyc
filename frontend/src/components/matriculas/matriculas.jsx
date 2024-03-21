import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import MatriculasModal from "./matriculasModal";

const Matriculas = () => {
	const [data, setData] = useState([]);
	const [filterText, setFilterText] = useState("");
	const [selectedPageSize, setSelectedPageSize] = useState(10);
	const [showMatriculasModal, setShowMatriculasModal] = useState(false);
	const [selectedMatricula, setSelectedMatricula] = useState(null);
	const [modalMode, setModalMode] = useState(""); // Definir modalMode como estado
	useState(false);

	const fetchMatriculas = async () => {
		try {
			const endpoint = "http://localhost:5000/api/matriculas/";
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
		fetchMatriculas();
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
		// Verificar si ya estan generadas las matriculas
		try {
			const endpoint =
				"http://localhost:5000/api/matriculas/matriculas-generadas/";
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
					text: "Esta matrícula tiene registros relacionados a profesionales. No puede ser eliminada.",
					icon: "warning",
					confirmButtonText: "Continuar",
				});
				return;
			}
		} catch (error) {
			console.error("Error al generar las matriculas:", error.message);
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
				const endpoint = "http://127.0.0.1:5000/api/matriculas/";
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

				// Actualizar la tabla llamando a fetchMatriculas
				setTimeout(() => {
					fetchMatriculas();
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
		// Verificar si ya estan generadas las matriculas
		try {
			const endpoint =
				"http://localhost:5000/api/matriculas/matriculas-generadas/";
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
					text: "Las matriculas ya están generadas",
					icon: "error",
					confirmButtonText: "OK",
				});
				return;
			}
		} catch (error) {
			console.error("Error al generar las matriculas:", error.message);
		}

		const result = await Swal.fire({
			title: "¿Estás seguro?",
			text: "Esta acción generará la matrícula para cada Profesional activo y no podrá deshacerla.",
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
				"http://localhost:5000/api/profesionales/generar-matriculas/";
			const direction = "";
			const method = "POST";
			const body = {
				matriculaId: id, // Envía el ID de la matrícula seleccionada al backend
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
				title: "Matrículas generadas",
				text: "Los registros han sido generados correctamente",
				icon: "success",
				showConfirmButton: false,
				timer: 2500,
			});

			// Actualiza la tabla llamando a fetchMatriculas
			fetchMatriculas();
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
				Header: "Matricula",
				accessor: "matricula",
			},
			{
				Header: "Vencimiento",
				accessor: "vencimiento",
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
				sortBy: [{ id: "matricula", desc: false }],
			},
			autoResetPage: false,
			autoResetPageSize: false,
		},
		useSortBy,
		usePagination
	);

	const handleMostrar = (matricula, mode) => {
		setSelectedMatricula(matricula);
		setModalMode(mode);
		setShowMatriculasModal(true);
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

	const openMatriculasModal = () => setShowMatriculasModal(true);

	const closeMatriculasModal = () => setShowMatriculasModal(false);

	useEffect(() => {
		if (!showMatriculasModal) {
			setSelectedMatricula(null);
		}
	}, [showMatriculasModal]);

	return (
		<>
			<div className="content-wrapper">
				<div className="content-header">
					<div className="container-fluid">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1 className="m-0">Matriculas</h1>
							</div>
						</div>
					</div>
				</div>
				<div>
					<section className="content">
						<div className="container-fluid">
							<div className="row d-flex mb-2 m-0">
								<label className="form-label m-0">
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
											openMatriculasModal();
										}}>
										<i className="fa-regular fa-square-plus"></i>{" "}
										Agregar
									</button>
								</div>
							</div>

							<table
								{...getTableProps()}
								className="table table-hover table-striped table-responsive-sm table-sm table-borderless align-middle">
								<thead className="bg-primary">
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
			<MatriculasModal
				showModal={showMatriculasModal}
				closeModal={closeMatriculasModal}
				data={selectedMatricula}
				modalMode={modalMode}
				fetchMatriculas={fetchMatriculas}
			/>
		</>
	);
};

export default Matriculas;

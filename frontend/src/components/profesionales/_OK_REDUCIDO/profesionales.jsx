import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import apiConnection from "../../../../backend/functions/apiConnection";
import Modal from "./profesionalesModal"; // Importa el componente Modal

const ProfesionalesTabla = () => {
	const [data, setData] = useState([]);
	const [filterText, setFilterText] = useState("");
	const [selectedPageSize, setSelectedPageSize] = useState(10);
	const [selectedProfesional, setSelectedProfesional] = useState(null); // Nuevo estado para el profesional seleccionado

	// OBTENER LISTA DE REGISTROS
	useEffect(() => {
		const fetchProfesionales = async () => {
			try {
				const endpoint = "http://127.0.0.1:5000/api/profesionales";
				const direction = "";
				const method = "GET";
				const body = false;
				const headers = {
					"Content-Type": "application/json",
					// Authorization: localStorage.getItem("token"),
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

		fetchProfesionales();
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
				Header: "Activo",
				accessor: "activo",
				Cell: ({ row }) => (
					<>
						<div className="form-switch">
							<input
								className="form-check-input"
								type="checkbox"
								checked={row.original.activo}
								onChange={() => toggleActivo(row.original.id)}
							/>
							<label className="form-check-label" hidden>
								{row.original.activo ? "1" : "0"}
							</label>
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
						{/* <button
							className="btn btn-info mx-2 btn-sm"
							data-bs-id="{row.original.id}"
							onClick={() => verProfesional(row.original.id)}>
							<i className="fa-regular fa-eye"></i> Mostrar
						</button> */}
						<button
							className="btn btn-primary"
							onClick={() =>
								setSelectedProfesional(row.original)
							}>
							Ver Detalles
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
				sortBy: [{ id: "nombre", desc: false }],
			},
			autoResetPage: false,
			autoResetPageSize: false,
		},
		useSortBy,
		usePagination
	);

	const handleFilterChange = (e) => {
		const value = e.target.value || "";
		setFilterText(value);
	};

	const handleClearFilter = () => {
		setFilterText("");
	};

	const handlePageSizeChange = (e) => {
		const size = parseInt(e.target.value, 10);
		setSelectedPageSize(size);
		gotoPage(0);
		updatePageSize(size); // Usar updatePageSize
	};

	return (
		<>
			{/* Agrega el Modal */}
			<Modal
				profesional={selectedProfesional}
				onClose={() => setSelectedProfesional(null)}
			/>

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
						<div className="container-fluid">
							<div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
								<div className="input-group col-4 me-md-2">
									<input
										type="text"
										className="form-control"
										placeholder="Filtrar..."
										value={filterText}
										onChange={handleFilterChange}
									/>
									{filterText && (
										<div className="input-group-append">
											<button
												className="btn bg-white"
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
						</div>
					</section>
				</div>
			</div>
		</>
	);
};

export default ProfesionalesTabla;
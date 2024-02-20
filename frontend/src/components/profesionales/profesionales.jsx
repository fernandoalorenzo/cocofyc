import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";

const ProfesionalesTabla = () => {
	const [data, setData] = useState([]);
	const [filterText, setFilterText] = useState("");
	const [selectedPageSize, setSelectedPageSize] = useState(10);

	useEffect(() => {
		const fetchProfesionales = async () => {
			try {
				const response = await fetch(
					"http://localhost:5000/profesionales"
				);
				if (!response.ok) {
					throw new Error("Error al obtener los datos");
				}
				const data = await response.json();
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
				Header: "Acciones",
				accessor: "id",
				Cell: ({ row }) => (
					<div>
						<button
							className="btn btn-warning mx-2 btn-sm"
							data-bs-id="{user.id_user}"
							onClick={() => editarProfesional(row.original)}>
							<i className="fa-regular fa-pen-to-square"></i>{" "}
							Editar
						</button>
						<button
							className="btn btn-danger mx-2 btn-sm"
							data-bs-id="{user.id_user}"
							onClick={() =>
								eliminarProfesional(row.original.id)
							}>
							<i className="fa-regular fa-trash-can"></i> Eliminar
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
			initialState: { pageIndex: 0, pageSize: selectedPageSize }, // Usar selectedPageSize
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
											onClick={() => setFilterText("")}>
											<i className="fa-regular fa-circle-xmark"></i>
										</button>
									</div>
								)}
							</div>
							<button
								type="button"
								className="btn btn-primary"
								id="abrirModalAgregar"
								onClick={() => handleAgregar()}>
								<i className="fa-regular fa-square-plus"></i>{" "}
								Agregar
							</button>
						</div>
						<table
							{...getTableProps()}
							className="table table-hover table-striped table-responsive-sm table-sm table-borderless align-middle">
							<thead>
								{headerGroups.map((headerGroup) => (
									<tr {...headerGroup.getHeaderGroupProps()}>
										{headerGroup.headers.map((column) => (
											<th
												{...column.getHeaderProps(
													column.getSortByToggleProps()
												)}>
												{column.render("Header")}
												<span>
													{column.isSorted
														? column.isSortedDesc
															? " 🔽"
															: " 🔼"
														: ""}
												</span>
											</th>
										))}
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
														{...cell.getCellProps()}>
														{cell.render("Cell")}
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
										Mostrando {pageIndex * pageSize + 1} -{" "}
										{pageIndex * pageSize + page.length} de{" "}
										{data.length} registros
									</div>
									<button
										className="btn btn-sm btn-outline-primary ms-1"
										onClick={() => gotoPage(0)}
										disabled={!canPreviousPage}>
										<i className="fa-solid fa-backward-step"></i>
									</button>{" "}
									<button
										className="btn btn-sm btn-outline-primary ms-1"
										onClick={() => previousPage()}
										disabled={!canPreviousPage}>
										<i className="fa-solid fa-caret-left"></i>
									</button>{" "}
									<button
										className="btn btn-sm btn-outline-primary ms-1"
										onClick={() => nextPage()}
										disabled={!canNextPage}>
										<i className="fa-solid fa-caret-right"></i>
									</button>{" "}
									<button
										className="btn btn-sm btn-outline-primary ms-1"
										onClick={() => gotoPage(pageCount - 1)}
										disabled={!canNextPage}>
										<i className="fa-solid fa-forward-step"></i>
									</button>{" "}
								</div>
								<div className="col col-4 d-flex justify-content-evenly content-align-center align-items-center">
									<span>
										Página <strong>{pageIndex + 1}</strong>{" "}
										de <strong>{pageOptions.length}</strong>
									</span>
									<span>Ir a la página: </span>
									<input
										className="form-control form-control-sm"
										type="number"
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
	);
};

export default ProfesionalesTabla;

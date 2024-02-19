// En ProfesionalesTabla.jsx
import React, { useMemo, useState } from "react";
import {
	useTable,
	useSortBy,
	useGlobalFilter,
	usePagination,
} from "react-table";

const ProfesionalesTabla = ({ profesionales }) => {
	const [data, setData] = useState(profesionales);

	const columns = useMemo(
		() => [
			{ Header: "Nombre", accessor: "nombre" },
			{ Header: "DNI", accessor: "dni", style: "text-center" },
			{ Header: "CUIT", accessor: "cuit" },
			{ Header: "Telefono", accessor: "telefono" },
			{ Header: "e-Mail", accessor: "email" },
			{
				Header: "Activo",
				accessor: "activo",
				Cell: ({ value }) => (
					<input type="checkbox" checked={value} readOnly />
				),
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
		rows,
		prepareRow,
		state: { globalFilter, pageIndex, pageSize },
		setGlobalFilter,
		page,
		nextPage,
		previousPage,
		canPreviousPage,
		canNextPage,
		pageOptions,
		gotoPage,
		pageCount,
		setPageSize,
	} = useTable(
		{
			columns,
			data,
			initialState: { pageSize: 5, pageIndex: 0 },
		},
		useGlobalFilter,
		useSortBy,
		usePagination
	);

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
			<section className="content">
				<div className="container-fluid">
					<div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
						<div className="input-group  col-4 me-md-2">
							<input
								value={globalFilter || ""}
								onChange={(e) =>
									setGlobalFilter(e.target.value)
								}
								placeholder="Buscar profesionales..."
								className="form-control"
							/>
							{globalFilter && (
								<div className="input-group-append">
									<button
										className="btn bg-white"
										title="Limpiar búsqueda"
										type="button"
										onClick={() => setGlobalFilter("")}>
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
					<div>
						<table
							{...getTableProps()}
							className="table table-hover table-striped table-responsive-sm table-sm table-borderless align-middle">
							<thead className="table-dark align-middle">
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
															? " ↓"
															: " ↑"
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
											{row.cells.map((cell) => (
												<td {...cell.getCellProps()}>
													{cell.render("Cell")}
												</td>
											))}
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
					<div className="container-fluid">
						<div className="row justify-content-between">
							<div className="col-6">
								Mostrando {pageIndex * pageSize + 1} -{" "}
								{pageIndex * pageSize + page.length} de{" "}
								{data.length} registros
							</div>
							<div className="col-4 justify-content-between">
								<div className="row">
									<div className="col">
										<select
											id="items"
											className="form-select form-select-sm"
											value={pageSize}
											onChange={(e) => {
												setPageSize(
													Number(e.target.value)
												);
												const newData =
													profesionales.slice(
														pageIndex *
															e.target.value,
														(pageIndex + 1) *
															e.target.value
													);
												setData(newData);
											}}>
											{[5, 10, 25, 50, 100].map(
												(pageSize) => (
													<option
														key={pageSize}
														value={pageSize}>
														{pageSize} por página
													</option>
												)
											)}
										</select>
									</div>
									<div className="col mx-1 d-flex justify-content-center">
										<button
											className="btn btn-sm btn-outline-secondary ms-1"
											onClick={() => gotoPage(0)}
											disabled={!canPreviousPage}>
											<i className="fa-solid fa-backward-step"></i>
										</button>
										<button
											className="btn btn-sm btn-outline-secondary ms-1"
											onClick={() => previousPage()}
											disabled={!canPreviousPage}>
											<i className="fa-solid fa-caret-left"></i>
										</button>
										<button
											className="btn btn-sm btn-outline-secondary ms-1"
											onClick={() => nextPage()}
											disabled={!canNextPage}>
											<i className="fa-solid fa-caret-right"></i>
										</button>
										<button
											className="btn btn-sm btn-outline-secondary ms-1"
											onClick={() =>
												gotoPage(pageCount - 1)
											}
											disabled={!canNextPage}>
											<i className="fa-solid fa-forward-step"></i>
										</button>
									</div>
									<div className="col">
										<span>
											Página{" "}
											<strong>
												{pageIndex + 1} de{" "}
												{pageOptions.length}
											</strong>{" "}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default ProfesionalesTabla;

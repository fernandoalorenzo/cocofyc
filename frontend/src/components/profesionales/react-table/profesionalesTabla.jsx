import React, { useMemo } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";

const ProfesionalesTabla = ({ profesionales }) => {
	const data = useMemo(() => profesionales, [profesionales]);

	const columns = useMemo(
		() => [
			// { Header: "ID", accessor: "id" },
			{ Header: "Nombre", accessor: "nombre" },
			{
				Header: "DNI",
				accessor: "dni",
				style: "text-center",
			},
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
		state,
		setGlobalFilter,
	} = useTable({ columns, data }, useGlobalFilter, useSortBy);

	const { globalFilter } = state;

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
					<div className="d-flex justify-content-end mb-3">
						<div className="row">
							<div className="col">
								<input
									value={globalFilter || ""}
									onChange={(e) =>
										setGlobalFilter(e.target.value)
									}
									placeholder="Buscar profesionales..."
									className="form-control mb-3"
								/>
							</div>
							<div className="col">
								<button
									type="button"
									className="btn btn-primary align-self-end"
									id="abrirModalAgregar"
									onClick={() => handleAgregar()}>
									<i className="fa-regular fa-square-plus"></i>{" "}
									Agregar
								</button>
							</div>
						</div>
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
								{rows.map((row) => {
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
				</div>
			</section>
		</div>
	);
};

export default ProfesionalesTabla;

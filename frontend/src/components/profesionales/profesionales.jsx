import React, { useState, useEffect } from "react";
import { useTable, useSortBy, usePagination, useFilters } from "react-table";
import "bootstrap/dist/css/bootstrap.min.css";

const ProfesionalesTabla = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const response = await fetch("http://localhost:5000/profesionales");
			if (!response.ok) {
				throw new Error("Error al obtener datos");
			}
			const jsonData = await response.json();
			if (!Array.isArray(jsonData)) {
				throw new Error("Los datos recibidos no son un array");
			}
			setData(jsonData);
			setLoading(false);
		} catch (error) {
			console.error("Error:", error.message);
			setLoading(false);
		}
	};

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
				Cell: () => (
					<>
						<button className="btn btn-primary btn-sm mr-2">
							Editar
						</button>
						<button className="btn btn-danger btn-sm">
							Eliminar
						</button>
					</>
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
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: { pageIndex, pageSize },
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0, pageSize: 5 },
		},
		useFilters,
		useSortBy,
		usePagination
	);

	if (loading) return <div>Loading...</div>;

	return (
		<div>
			<input
				type="text"
				placeholder="Buscar..."
				className="form-control mb-3"
				onChange={(e) => {
					// Implementar la lógica de filtrado
				}}
			/>
			<table {...getTableProps()} className="table">
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
										<td {...cell.getCellProps()}>
											{cell.render("Cell")}
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
			<div className="pagination">
				<button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
					{"<<"}
				</button>{" "}
				<button
					onClick={() => previousPage()}
					disabled={!canPreviousPage}>
					{"<"}
				</button>{" "}
				<button onClick={() => nextPage()} disabled={!canNextPage}>
					{">"}
				</button>{" "}
				<button
					onClick={() => gotoPage(pageCount - 1)}
					disabled={!canNextPage}>
					{">>"}
				</button>{" "}
				<span>
					Página{" "}
					<strong>
						{pageIndex + 1} de {pageOptions.length}
					</strong>{" "}
				</span>
				<span>
					| Ir a la página:{" "}
					<input
						type="number"
						defaultValue={pageIndex + 1}
						onChange={(e) => {
							const page = e.target.value
								? Number(e.target.value) - 1
								: 0;
							gotoPage(page);
						}}
						style={{ width: "100px" }}
					/>
				</span>{" "}
				<select
					value={pageSize}
					onChange={(e) => {
						setPageSize(Number(e.target.value));
					}}>
					{[5, 10, 25, 100].map((pageSize) => (
						<option key={pageSize} value={pageSize}>
							Mostrar {pageSize}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};

export default ProfesionalesTabla;

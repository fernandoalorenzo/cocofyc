import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import UsuariosModal from "./UsuariosModal";
import UsuariosPasswordModal from "./UsuariosPasswordModal";

const Usuarios = () => {
	const [data, setData] = useState([]);
	const [filterText, setFilterText] = useState("");
	const [selectedPageSize, setSelectedPageSize] = useState(10);
	const [showUsuariosModal, setShowUsuariosModal] = useState(false);
	const [selectedUsuario, setSelectedUsuario] = useState(null);
	const [modalMode, setModalMode] = useState("");
	// const [roles, setRoles] = useState([]);
	const [showPasswordModal, setShowPasswordModal] = useState(false);

	const fetchUsuarios = async () => {
		try {
			const endpoint = "http://localhost:5000/api/usuarios";
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
		fetchUsuarios();
	}, []);

	// FUNCION PARA ABRIR MODAL PARA CAMBIAR CONTRASEÑA
	const handlePassword = (usuario) => {
		setSelectedUsuario(usuario);
		setShowPasswordModal(true); // Abrir el modal de contraseña
	};

	// OBTENER LISTA DE ESTADOS DE MATRICULA
	// const fetchRoles = async () => {
	// 	try {
	// 		const endpoint = "http://localhost:5000/api/roles";
	// 		const direction = "";
	// 		const method = "GET";
	// 		const body = false;
	// 		const headers = {
	// 			"Content-Type": "application/json",
	// 			Authorization: localStorage.getItem("token"),
	// 		};

	// 		const response = await apiConnection(
	// 			endpoint,
	// 			direction,
	// 			method,
	// 			body,
	// 			headers
	// 		);
	// 		setRoles(response.data);
	// 	} catch (error) {
	// 		console.error("Error:", error.message);
	// 	}
	// };

	// useEffect(() => {
	// 	fetchRoles();
	// }, []);

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
				const endpoint = "http://localhost:5000/api/usuarios/";
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

				// Actualizar la tabla llamando a fetchUsuarios
				setTimeout(() => {
					fetchUsuarios();
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

	const columns = React.useMemo(
		() => [
			{
				Header: "Nombre",
				accessor: "nombre",
			},
			{
				Header: "Apellido",
				accessor: "apellido",
			},
			{
				Header: "e-Mail",
				accessor: "email",
			},
			// {
			// 	Header: "Rol",
			// 	accessor: "rol",
			// 	Cell: ({ value }) => {
			// 		const rol = roles.find((rol) => rol.id === value);
			// 		return rol ? rol.rol : "N/D";
			// 	},
			// },
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
				Header: "Administrador",
				accessor: "administrador",
				Cell: ({ row }) => (
					<>
						<div className="form-switch">
							<input
								className="form-check-input"
								type="checkbox"
								checked={row.original.administrador}
								onChange={() => false}
								id={`administrador-checkbox-${row.index}`}
							/>
							<input
								type="hidden"
								name={`administrador-${row.index}`}
								value={row.original.administrador ? "1" : "0"}
							/>
						</div>
					</>
				),
				sortType: (rowA, rowB, columnId) => {
					// Convertir los valores a números para que la comparación sea numérica
					const valueA = rowA.original.administrador ? 1 : 0;
					const valueB = rowB.original.administrador ? 1 : 0;

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
							className="btn btn-secondary mx-2 btn-sm"
							onClick={() => {
								handlePassword(row.original);
							}}>
							<i className="fa-solid fa-key"></i> Contraseña
						</button>
					</div>
				),
			},
		],
		[Usuarios]
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

	const handleMostrar = (usuario, mode) => {
		setSelectedUsuario(usuario);
		setModalMode(mode);
		setShowUsuariosModal(true);
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

	const openUsuariosModal = () => setShowUsuariosModal(true);

	const closeUsuariosModal = () => setShowUsuariosModal(false);

	useEffect(() => {
		if (!showUsuariosModal) {
			setSelectedUsuario(null);
		}
	}, [showUsuariosModal]);

	return (
		<>
			<div className="content-wrapper">
				<div className="content-header">
					<div className="container-fluid">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1 className="m-0">Usuarios</h1>
							</div>
						</div>
					</div>
				</div>
				<div>
					<section className="content">
						<div className="container-fluid">
							<div className="row d-flex mb-2 m-0">
								<label htmlFor="filterText" className="form-label m-0">
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
											openUsuariosModal();
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
																"Activo" ||
															column.Header ===
																"Administrador" ||
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
																	"Activo" ||
																cell.column
																	.Header ===
																	"Administrador"
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
			<UsuariosModal
				showModal={showUsuariosModal}
				closeModal={closeUsuariosModal}
				data={selectedUsuario}
				modalMode={modalMode}
				fetchUsuarios={fetchUsuarios}
			/>
			<UsuariosPasswordModal
				showModalPassword={showPasswordModal}
				closeModalPassword={() => setShowPasswordModal(false)}
				usuario={selectedUsuario}
			/>
		</>
	);
};

export default Usuarios;

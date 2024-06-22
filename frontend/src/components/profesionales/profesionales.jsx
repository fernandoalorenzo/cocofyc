import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import ProfesionalesModal from "./profesionalesModal";
import GestionesModal from "./profesionalesGestionModal";
import {
	datatableLanguageConfig,
	datatableButtonsConfig,
	datatableDomConfig,
} from "../../utils/dataTableConfig";


const ProfesionalesTabla = ( {API_ENDPOINT} ) => {
	const [data, setData] = useState([]);
	const [showProfesionalesModal, setShowProfesionalesModal] = useState(false);
	const [selectedProfesional, setSelectedProfesional] = useState(null);
	const [modalMode, setModalMode] = useState("");
	const [estadosMatriculas, setEstadosMatriculas] = useState([]);
	const [showGestionesModal, setShowGestionesModal] = useState(false);
	const [activeFilter, setActiveFilter] = useState("");

	const tablaProfesionalesRef = useRef(null);
	const dataTableRef = useRef(null);

	const fetchProfesionales = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/profesionales`;
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
			const endpoint = `${API_ENDPOINT}/estados`;
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

	// Función para manejar cambios en el filtro de activo
	const handleActiveFilterChange = (event) => {
		const value = event.target.value;
		setActiveFilter(value);
		dataTableRef.current.columns(7).search(value).draw(); // Filtrar la columna "Activo"
	};

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
				const endpoint = `${API_ENDPOINT}/profesionales/`;
				const direction = id;
				const method = "DELETE";
				const body = false;
				const headers = {
					"Content-Type": "application/json",
					Authorization: localStorage.getItem("token"),
				};
			
				console.log("id: ", id);

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

	const [movimientos, setMovimientos] = useState([]);
	const fetchMovimientos = async (profesional) => {
		const profesionalId = profesional.id;
		try {
			const endpoint = `${API_ENDPOINT}/movimientos/profesional/`;
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
			const endpoint = `${API_ENDPOINT}/mediosdepago/${medioId}`;
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

	// DATATABLE
	useEffect(() => {
		if (dataTableRef.current) {
			dataTableRef.current.clear().rows.add(data).draw();
		} else if (data.length && tablaProfesionalesRef.current) {
			dataTableRef.current = $(tablaProfesionalesRef.current).DataTable({
				data: data,
				language: datatableLanguageConfig,
				buttons: datatableButtonsConfig, ...datatableDomConfig,
				columnDefs: [
					{
						targets: 0,
						render: function (data, type, row) {
							if (type === "display") {
								// Formatear la fecha de 'aaaa-mm-dd' a 'dd/mm/aaaa'
								const parts = data.split("-");
								if (parts.length === 3) {
									return `${parts[2]}/${parts[1]}/${parts[0]}`;
								}
							}
							return data;
						},
					},
					{
						targets: 5,
						render: function (data, type, row) {
							if (data === "0000-00-00") {
								return "";
							}
							if (type === "display") {
								// Formatear la fecha de 'aaaa-mm-dd' a 'dd/mm/aaaa'
								if (data && typeof data === "string") {
									const parts = data.split("-");
									if (parts.length === 3) {
										return `${parts[2]}/${parts[1]}/${parts[0]}`;
									}
								}
							}
							return data;
						},
					},
				],
				columns: [
					{
						data: "nombre",
					},
					{
						data: "dni",
					},
					{
						data: "matricula",
					},
					{
						data: "telefono",
					},
					{
						data: "email",
					},
					{
						data: "localidad",
					},
					{
						data: "estado_matricula_id",
						render: function (data, type, row) {
							if (type === "display") {
								const estado = estadosMatriculas.find(
									(estado) => estado.id === data
								);
								return estado ? estado.estado : "N/D";
							}
							return data;
						},
					},
					{
						data: "activo",
						orderable: false,
						render: function (data, type, row) {
							if (type === "display") {
								const switchId = `switch-${row.id}`;
								return `
								<div class="form-check form-switch">
									<input class="form-check-input" type="checkbox" id="${switchId}" 
									${data ? "checked" : ""}
									data-id="${row.id} "
									disabled
									>
								</div>
								`;
							}
							return data;
						},
					},
					{
						// Columna de acciones
						data: null,
						className: "text-center",
						render: function (data, type, row) {
							return `
                            <button class="btn btn-info btn-sm mostrar-btn" data-id="${row.id}"><i class="fa-regular fa-eye"></i> Mostrar</button>
                            <button class="btn btn-warning btn-sm editar-btn" data-id="${row.id}"><i class="fa-regular fa-pen-to-square"></i> Editar</button>
                            <button class="btn btn-danger btn-sm eliminar-btn" data-id="${row.id}"><i class="fa-regular fa-trash-can"></i>  Eliminar</button>
							<button class="btn btn-success btn-sm gestion-btn" data-id="${row.id}"><i class="fa-solid fa-money-check-dollar"></i>  Gestión</button>
                        `;
						},
						orderable: false,
						searchable: false,
					},
				],
				lengthChange: true,
				lengthMenu: [
					[10, 25, 50, 100, -1],
					[
						"10 Registros",
						"25 Registros",
						"50 Registros",
						"100 Registros",
						"Mostrar Todos",
					],
				],
				responsive: true,
				autoWidth: true,
				paging: true,
				searching: true,
				ordering: true,
				info: true,
				order: [[0, "asc"]],
			});
		}

		// Asignar eventos click a los botones de acción
		$(tablaProfesionalesRef.current).on(
			"click",
			".mostrar-btn",
			function () {
				const rowData = dataTableRef.current
					.row($(this).closest("tr"))
					.data();
				handleMostrar(rowData, "mostrar");
			}
		);

		$(tablaProfesionalesRef.current).on(
			"click",
			".editar-btn",
			function () {
				const rowData = dataTableRef.current
					.row($(this).closest("tr"))
					.data();
				handleMostrar(rowData, "editar");
			}
		);

		$(tablaProfesionalesRef.current).on(
			"click",
			".eliminar-btn",
			function () {
				const rowData = dataTableRef.current
					.row($(this).closest("tr"))
					.data();
				handleEliminar(rowData.id);
			}
		);

		$(tablaProfesionalesRef.current).on(
			"click",
			".gestion-btn",
			function () {
				const rowData = dataTableRef.current
					.row($(this).closest("tr"))
					.data();
				mostrarGestiones(rowData);
			}
		);

		// Agregar evento para el cambio de filtro de activo
		const select = document.getElementById("activoFilter");
		select.addEventListener("change", handleActiveFilterChange);

		// Limpiar el evento al desmontar el componente
		return () => {
			select.removeEventListener("change", handleActiveFilterChange);
		};
	}, [data]);

	const handleMostrar = (profesional, mode) => {
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

	const openProfesionalesModal = () => setShowProfesionalesModal(true);

	const closeProfesionalesModal = () => {
		setShowProfesionalesModal(false);
		setModalMode(""); // Aquí estableces el valor deseado para modalMode
	};

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
				<div className="content m-3">
					<div className="card">
						<div className="card-header bg-white">
							<div className="row d-flex m-0 mb-2 align-items-center justify-content-between">
								<div className="col-auto">
									<div className="bg-primary bg-opacity-50 text-white rounded cd p-2">
										<div className="row align-items-center">
											<div className="col-auto text-start align-items-center">
												<label
													htmlFor="activoFilter"
													className="form-label m-0">
													Filtrar por Activo:
												</label>
											</div>
											<div className="col-auto">
												<select
													id="activoFilter"
													className="form-select primary"
													value={activeFilter}
													onChange={
														handleActiveFilterChange
													}>
													<option value="">
														Sin filtrar
													</option>
													<option value="true">
														Activo
													</option>
													<option value="false">
														Inactivo
													</option>
												</select>
											</div>
										</div>
									</div>
								</div>

								<div className="col-auto">
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
						</div>
						<div className="card-body">
							<div className="container-fluid mt-0">
								<table
									ref={tablaProfesionalesRef}
									id="tabla_profesionales"
									className="table table-hover table-sm">
									<thead className="table-dark">
										<tr>
											<th>Nombre</th>
											<th>DNI</th>
											<th>Matrícula</th>
											<th>Teléfono</th>
											<th>e-Mail</th>
											<th>Localidad</th>
											<th>Estado Matr.</th>
											<th>Activo</th>
											<th className="text-center">
												Acciones
											</th>
										</tr>
									</thead>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			<ProfesionalesModal
				showModal={showProfesionalesModal}
				closeModal={closeProfesionalesModal}
				data={selectedProfesional}
				modalMode={modalMode}
				fetchProfesionales={fetchProfesionales}
				API_ENDPOINT={API_ENDPOINT}
			/>
			<GestionesModal
				showModal={showGestionesModal}
				closeModal={closeGestionesModal}
				data={selectedProfesional}
				movimientos={movimientos}
				fetchMovimientos={fetchMovimientos}
				API_ENDPOINT={API_ENDPOINT}
			/>
		</>
	);
};

export default ProfesionalesTabla;

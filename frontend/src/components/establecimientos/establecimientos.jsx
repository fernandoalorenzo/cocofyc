import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import EstablecimientosModal from "./establecimientosModal";
import ProfesionalesModal from "./establecimientosProfesionalesModal";
import {
	datatableLanguageConfig,
	datatableButtonsConfig,
	datatableDomConfig,
} from "../../utils/dataTableConfig";


const EstablecimientosTabla = ( { API_ENDPOINT } ) => {
	const [data, setData] = useState([]);
	const [showEstablecimientosModal, setShowEstablecimientosModal] =
		useState(false);
	const [selectedEstablecimiento, setSelectedEstablecimiento] =
		useState(null);
	const [modalMode, setModalMode] = useState("");
	const [showProfesionalesModal, setShowProfesionalesModal] = useState(false);

		const tablaEstablecimientosRef = useRef(null);
		const dataTableRef = useRef(null);

	const fetchEstablecimientos = async () => {
		
		try {
			const endpoint = `${API_ENDPOINT}/establecimientos`;
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
		fetchEstablecimientos();
	}, []);

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
				const endpoint = `${API_ENDPOINT}/establecimientos/`;
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

				setTimeout(() => {
					fetchEstablecimientos();
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

	const handleMostrar = (establecimiento, mode) => {
		setSelectedEstablecimiento(establecimiento);
		setModalMode(mode);
		setShowEstablecimientosModal(true);
	};

	const mostrarProfesionales = (establecimiento) => {
		setSelectedEstablecimiento(establecimiento);
		setShowProfesionalesModal(true);
	};

	const closeProfesionalesModal = () => {
		setShowProfesionalesModal(false);
	};

	const openEstablecimientosModal = () => setShowEstablecimientosModal(true);

	const closeEstablecimientosModal = () =>
		setShowEstablecimientosModal(false);

	useEffect(() => {
		if (!showEstablecimientosModal) {
			setSelectedEstablecimiento(null);
		}
	}, [showEstablecimientosModal]);

	// DATATABLE
	useEffect(() => {
		if (dataTableRef.current) {
			dataTableRef.current.clear().rows.add(data).draw();
		} else if (data.length && tablaEstablecimientosRef.current) {
			dataTableRef.current = $(
				tablaEstablecimientosRef.current
			).DataTable({
				data: data,
				language: datatableLanguageConfig,
				buttons: datatableButtonsConfig,
				...datatableDomConfig,
				columnDefs: [
					{
						targets: [5, 6],
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
						data: "establecimiento",
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
						data: "fecha_inicio",
						className: "text-center",
					},
					{
						data: "fecha_caducidad",
						className: "text-center",
					},
					{
						data: "nro_tramite",
						className: "text-center",
					},
					{
						data: "nro_habilitacion",
						className: "text-center",
					},
					{
						data: "nro_resolucion",
						className: "text-center",
					},
					{
						// Columna de acciones
						data: null,
						className: "text-center",
						render: function (data, type, row) {
							return `
                            
                            <button class="btn btn-warning btn-sm editar-btn" data-id="${row.id}"><i class="fa-regular fa-pen-to-square"></i></button>
                            <button class="btn btn-danger btn-sm eliminar-btn" data-id="${row.id}"><i class="fa-regular fa-trash-can"></i></button>
							<button class="btn btn-success btn-sm asignar-btn" data-id="${row.id}"><i class="fa-solid fa-user-tie"></i>  Asignar</button>
                        `;
						},
						orderable: false,
						searchable: false,
						width: "15%",
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

		$(tablaEstablecimientosRef.current).on("click", ".editar-btn", function () {
			const rowData = dataTableRef.current
				.row($(this).closest("tr"))
				.data();
			handleMostrar(rowData, "editar");
		});

		$(tablaEstablecimientosRef.current).on("click", ".eliminar-btn", function () {
			const rowData = dataTableRef.current
				.row($(this).closest("tr"))
				.data();
			handleEliminar(rowData);
		});

		$(tablaEstablecimientosRef.current).on(
			"click",
			".asignar-btn",
			function () {
				const rowData = dataTableRef.current
					.row($(this).closest("tr"))
					.data();
				mostrarProfesionales(rowData);
			}
		);
	}, [data]);

	return (
		<>
			<div className="content-wrapper">
				<div className="content-header">
					<div className="container-fluid">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1 className="m-0">Establecimientos</h1>
							</div>
						</div>
					</div>
				</div>
				<div className="content m-3">
					<div className="card">
						<div className="card-header bg-white">
							<div className="justify-content-end text-end d-flex">
								<button
									type="button"
									className="btn btn-primary"
									id="abrirModalAgregar"
									onClick={() => {
											setModalMode("agregar");
											openEstablecimientosModal();
										}}>
									<i className="fa-regular fa-square-plus"></i>{" "}
									Agregar
								</button>
							</div>
						</div>
						<div className="card-body">
							<div className="container-fluid mt-0">
								<table
									ref={tablaEstablecimientosRef}
									id="tabla_establecimientos"
									className="table table-hover table-sm">
									<thead className="table-dark">
										<tr>
											<th>Establecimiento</th>
											<th>Teléfono</th>
											<th>e-Mail</th>
											<th>Localidad</th>
											<th>Inicio</th>
											<th>Caducidad</th>
											<th>Trámite</th>
											<th>Habilitación</th>
											<th>Resolución</th>
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
			<EstablecimientosModal
				showModal={showEstablecimientosModal}
				closeModal={closeEstablecimientosModal}
				data={selectedEstablecimiento}
				modalMode={modalMode}
				fetchEstablecimientos={fetchEstablecimientos}
				API_ENDPOINT={API_ENDPOINT}
			/>
			<ProfesionalesModal
				showModal={showProfesionalesModal}
				closeModal={closeProfesionalesModal}
				data={selectedEstablecimiento}
				API_ENDPOINT={API_ENDPOINT}
			/>
		</>
	);
};

export default EstablecimientosTabla;

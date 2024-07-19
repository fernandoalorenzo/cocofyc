import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import TitularesModal from "./titularesModal";
import {
	datatableLanguageConfig,
	datatableButtonsConfig,
	datatableDomConfig,
} from "../../utils/dataTableConfig";

const TitularesTabla = ({ API_ENDPOINT }) => {
	const [data, setData] = useState([]);
	const [showTitularesModal, setShowTitularesModal] = useState(false);
	const [selectedTitular, setSelectedTitular] = useState(null);
	const [modalTitularesMode, setModalTitularesMode] = useState("");

	const tablaTitularesRef = useRef(null);
	const dataTableRef = useRef(null);

	const fetchTitulares = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/titulares`;
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
		fetchTitulares();
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
				const endpoint = `${API_ENDPOINT}/titulares/`;
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

				// Actualizar la tabla llamando a fetchTitulares
				setTimeout(() => {
					fetchTitulares();
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

	// DATATABLE
	useEffect(() => {
		if (data.length > 0) {
			if (dataTableRef.current) {
				dataTableRef.current.clear().rows.add(data).draw();
			} else if (data.length && tablaTitularesRef.current) {
				dataTableRef.current = $(
					tablaTitularesRef.current
				).DataTable({
					data: data,
					language: datatableLanguageConfig,
					buttons: datatableButtonsConfig,
					...datatableDomConfig,
					columns: [
						{
							data: "nombre",
							render: function (data, type, row) {
								return `<span>${data}</span>`;
							},
						},
						{
							data: "dni",
							width: "8%",
							className: "text-center",
						},
						{
							data: "telefono",
							width: "10%",
						},
						{
							data: "email",
							render: function (data, type, row) {
								return `<span>${data}</span>`;
							},
						},
						{
							data: "localidad",
							render: function (data, type, row) {
								return `<span>${data}</span>`;
							},
						},
						{
							data: null,
							className: "text-center",
							render: function (data, type, row) {
								return `
                            <button class="btn btn-info btn-sm mostrar-btn" title="Mostrar" data-id="${row.id}"><i class="fa-regular fa-eye"></i></button>
                            <button class="btn btn-warning btn-sm editar-btn" title="Editar" data-id="${row.id}"><i class="fa-regular fa-pen-to-square"></i></button>
                            <button class="btn btn-danger btn-sm eliminar-btn" title="Eliminar" data-id="${row.id}"><i class="fa-regular fa-trash-can"></i></button>
                        `;
							},
							orderable: false,
							searchable: false,
							width: "17%",
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
			$(tablaTitularesRef.current).on(
				"click",
				".mostrar-btn",
				function () {
					const rowData = dataTableRef.current
						.row($(this).closest("tr"))
						.data();
					handleMostrar(rowData, "mostrar");
				}
			);

			$(tablaTitularesRef.current).on(
				"click",
				".editar-btn",
				function () {
					const rowData = dataTableRef.current
						.row($(this).closest("tr"))
						.data();
					handleMostrar(rowData, "editar");
				}
			);

			$(tablaTitularesRef.current).on(
				"click",
				".eliminar-btn",
				function () {
					const rowData = dataTableRef.current
						.row($(this).closest("tr"))
						.data();
					handleEliminar(rowData.id);
				}
			);
		}
	}, [data]);

	const handleMostrar = (titular, mode) => {
		setSelectedTitular(titular);
		setModalTitularesMode(mode);
		setShowTitularesModal(true);
	};

	const openTitularesModal = () => setShowTitularesModal(true);

	const closeTitularesModal = () => {
		setShowTitularesModal(false);
		setModalTitularesMode(""); // Aquí estableces el valor deseado para modalMode
	};

	useEffect(() => {
		if (!showTitularesModal) {
			setSelectedTitular(null);
		}
	}, [showTitularesModal]);

	return (
		<>
			<div className="content-wrapper">
				<div className="content-header">
					<div className="container-fluid">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1 className="m-0">Titulares</h1>
							</div>
						</div>
					</div>
				</div>
				<div className="content m-3">
					<div className="card">
						<div className="card-header bg-white">
							<div className="row m-0 align-items-center justify-content-end">
								<div className="col-auto">
									<button
										type="button"
										className="btn btn-primary"
										id="abrirModalAgregar"
										onClick={() => {
											setModalTitularesMode("agregar");
											openTitularesModal();
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
									ref={tablaTitularesRef}
									id="tabla_titulares"
									className="table table-hover table-sm">
									<thead className="table-dark">
										<tr>
											<th>Nombre</th>
											<th className="text-center">DNI</th>
											<th>Teléfono</th>
											<th>e-Mail</th>
											<th>Localidad</th>
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
			<TitularesModal
				showTitularesModal={showTitularesModal}
				closeTitularesModal={closeTitularesModal}
				data={selectedTitular}
				modalTitularesMode={modalTitularesMode}
				fetchTitulares={fetchTitulares}
				API_ENDPOINT={API_ENDPOINT}
			/>
		</>
	);
};

export default TitularesTabla;
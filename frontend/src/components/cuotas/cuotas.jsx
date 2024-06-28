import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import CuotasModal from "./cuotasModal";
import { datatableLanguageConfig , datatableButtonsConfig , datatableDomConfig } from "./../../utils/dataTableConfig";

const Cuotas = ( {API_ENDPOINT} ) => {
	const [data, setData] = useState([]);
	const [showCuotasModal, setShowCuotasModal] = useState(false);
	const [selectedCuota, setSelectedCuota] = useState(null);
	const [modalMode, setModalMode] = useState(""); // Definir modalMode como estado
	useState(false);

	const tablaCuotasRef = useRef(null);
	const dataTableRef = useRef(null);

	const fetchCuotas = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/cuotas`;
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
		fetchCuotas();
	}, []);

	const handleEliminar = async (id) => {
		// Verificar si ya estan generadas las cuotas
		try {
			const endpoint = `${API_ENDPOINT}/cuotas/cuotas-generadas/`;
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
					text: "Esta cuota tiene registros relacionados con profesionales. No puede ser eliminada.",
					icon: "warning",
					confirmButtonText: "Continuar",
				});
				return;
			}
		} catch (error) {
			console.error("Error al generar las cuotas:", error.message);
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
				const endpoint = `${API_ENDPOINT}/cuotas/`;
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

				// Actualizar la tabla llamando a fetchCuotas
				setTimeout(() => {
					fetchCuotas();
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

	const handleGenerar = async (cuota) => {
		// Verificar si ya estan generadas las cuotas
		try {
			const endpoint = `${API_ENDPOINT}/cuotas/cuotas-generadas/`;
			const direction = cuota;
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
					text: "Las cuotas ya están generadas",
					icon: "error",
					confirmButtonText: "OK",
				});
				return;
			}
		} catch (error) {
			console.error("Error al generar las cuotas:", error.message);
		}

		const result = await Swal.fire({
			title: "¿Estás seguro?",
			text: "Esta acción generará una cuota para cada Profesional activo y no podrá deshacerla.",
			icon: "warning",
			showCancelButton: true,
			showConfirmButton: true,
			cancelButtonColor: "9B9B9B",
			confirmButtonText: "Generar",
			cancelButtonText: "Cancelar",
		});

		if (!result.isConfirmed) return;

		try {
			const endpoint = `${API_ENDPOINT}/profesionales/generar-cuotas/`;
			const direction = "";
			const method = "POST";
			const body = cuota;
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

			Swal.fire({
				title: "Cuotas generadas",
				text: "Los registros han sido generados correctamente",
				icon: "success",
				showConfirmButton: false,
				timer: 2500,
			});

			fetchCuotas();
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

	// DATATABLE
	useEffect(() => {
		if (dataTableRef.current) {
			dataTableRef.current.clear().rows.add(data).draw();
		} else if (data.length && tablaCuotasRef.current) {
			dataTableRef.current = $(tablaCuotasRef.current).DataTable({
				data: data,
				language: datatableLanguageConfig,
				columnDefs: [
					{
						targets: 1,
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
				],
				columns: [
					{
						data: "cuota",
					},
					{
						data: "vencimiento",
					},
					{
						data: "importe",
						render: function (data) {
							// Dar formato de moneda al importe
							return parseFloat(data).toLocaleString("es-AR", {
								style: "currency",
								currency: "ARS",
							});
						},
						className: "text-end",
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
							<button class="btn btn-success btn-sm generar-btn" data-id="${row.id}"><i class="fa-regular fa-credit-card"></i>  Generar</button>
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
				paging: true,
				searching: true,
				ordering: true,
				info: true,
				autoWidth: true,
				order: [[0, "desc"]],
			});
		}

		$(tablaCuotasRef.current).on("click", ".mostrar-btn", function () {
			const rowData = dataTableRef.current
				.row($(this).closest("tr"))
				.data();
			handleMostrar(rowData, "mostrar");
		});

		$(tablaCuotasRef.current).on("click", ".editar-btn", function () {
			const rowData = dataTableRef.current
				.row($(this).closest("tr"))
				.data();
			handleMostrar(rowData, "editar");
		});

		$(tablaCuotasRef.current).on("click", ".eliminar-btn", function () {
			const rowData = dataTableRef.current
				.row($(this).closest("tr"))
				.data();
			handleEliminar(rowData);
		});

		$(tablaCuotasRef.current).on(
			"click",
			".generar-btn",
			function () {
				const rowData = dataTableRef.current
					.row($(this).closest("tr"))
					.data();
				handleGenerar(rowData);
			}
		);
	}, [data]);

	const handleMostrar = (cuota, mode) => {
		setSelectedCuota(cuota);
		setModalMode(mode);
		setShowCuotasModal(true);
	};

	const openCuotasModal = () => setShowCuotasModal(true);

	const closeCuotasModal = () => setShowCuotasModal(false);

	useEffect(() => {
		if (!showCuotasModal) {
			setSelectedCuota(null);
		}
	}, [showCuotasModal]);

	return (
		<>
			<div className="content-wrapper">
				<div className="content-header">
					<div className="container-fluid">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1 className="m-0">Cuotas</h1>
							</div>
						</div>
					</div>
				</div>
				<div>
					<section className="content m-3">
						<div className="container-fluid">
							<div className="row d-flex mb-2 m-0">
								<div className="card">
									<div className="card-header bg-white">
										<div className="justify-content-end text-end d-flex">
											<button
												type="button"
												className="btn btn-primary"
												id="abrirModalAgregar"
												onClick={() => {
													setModalMode("agregar");
													openCuotasModal();
												}}>
												<i className="fa-regular fa-square-plus"></i>{" "}
												Agregar
											</button>
										</div>
									</div>
									<div className="card-body">
										<div className="container-fluid mt-0">
											<table
												ref={tablaCuotasRef}
												id="tabla_cuotas"
												className="table table-hover table-sm">
												<thead className="table-dark">
													<tr>
														<th>Cuota</th>
														<th>Vencimiento</th>
														<th>Importe</th>
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
					</section>
				</div>
			</div>
			<CuotasModal
				showModal={showCuotasModal}
				closeModal={closeCuotasModal}
				data={selectedCuota}
				modalMode={modalMode}
				fetchCuotas={fetchCuotas}
				API_ENDPOINT={API_ENDPOINT}
			/>
		</>
	);
};

export default Cuotas;

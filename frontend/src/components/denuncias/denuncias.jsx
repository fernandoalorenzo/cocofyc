import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import DenunciasModal from "./denunciasModal";
import DenunciasSeguimientosListaModal from "./denunciasSeguimientosListaModal";

const DenunciasTabla = ({ API_ENDPOINT, SERVER_PATH }) => {
	const [showDenunciasModal, setShowDenunciasModal] = useState(false);
	const [selectedDenuncia, setSelectedDenuncia] = useState(null);
	const [selectedDenunciaSeguimiento, setSelectedDenunciaSeguimiento] = useState(null);
	const [modalMode, setModalMode] = useState("");
	const [denuncias, setDenuncias] = useState([]);
	const [profesionales, setProfesionales] = useState({});
	const [establecimientos, setEstablecimientos] = useState([]);

	const [showDenunciasSeguimientosListaModal, setShowDenunciasSeguimientosListaModal] = useState(false);

	const tablaDenunciasRef = useRef(null);
	const dataTableRef = useRef(null);

	const fetchDenuncias = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/denuncias`;
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

			if (response) {
				const profesionales = await fetchProfesionales();
				const establecimientos = await fetchEstablecimientos();

				// Asocia el nombre del profesional y del establecimiento con cada denuncia
				const denunciasConDatos = response.data.map((denuncia) => {
					const profesional = profesionales.find(
						(profesional) =>
							profesional.id === denuncia.profesional_id
					);
					const establecimiento = establecimientos.find(
						(establecimiento) =>
							establecimiento.id === denuncia.establecimiento_id
					);

					return {
						...denuncia,
						profesional_nombre: profesional
							? profesional.nombre
							: "",
						establecimiento_nombre: establecimiento
							? establecimiento.establecimiento
							: "",
					};
				});

				// Ordena las denuncias por fecha
				denunciasConDatos.sort(
					(a, b) => new Date(a.fecha) - new Date(b.fecha)
				);

				// Actualiza el estado con las denuncias que contienen el nombre del profesional y del establecimiento
				setDenuncias(denunciasConDatos);
			} else {
				console.error(
					"Error fetching denuncias: ",
					response.statusText
				);
			}
		} catch (error) {
			console.error("Error fetching denuncias: ", error);
		}
	};

	useEffect(() => {
		fetchDenuncias(setDenuncias);
	}, [showDenunciasModal]);

	// DATATABLE
	useEffect(() => {
		if (dataTableRef.current) {
			dataTableRef.current.clear().rows.add(denuncias).draw();
		} else if (denuncias.length && tablaDenunciasRef.current) {
			dataTableRef.current = $(tablaDenunciasRef.current).DataTable({
				data: denuncias,
				language: {
					buttons: {
						copy: "Copiar",
						colvis: "Visibilidad",
						colvisRestore: "Restaurar visibilidad",
						copyTitle: "Copiar al portapapeles",
						copySuccess: {
							1: "Copiado 1 registro al portapapeles",
							_: "Copiados %d registros al portapapeles",
						},
						csv: "CSV",
						excel: "Excel",
						pageLength: {
							"-1": "Mostrar todos los registros",
							_: "Mostrar %d registros",
						},
						pdf: "PDF",
						print: "Imprimir",
					},
					lengthMenu: "Mostrar _MENU_ registros",
					zeroRecords: "No se encontraron resultados",
					infoEmpty:
						"Mostrando registros del 0 al 0 de un total de 0 registros",
					loadingRecords: "Cargando...",
					paginate: {
						first: '<i class="fas fa-angle-double-left"></i>',
						last: '<i class="fas fa-angle-double-right"></i>',
						next: '<i class="fas fa-angle-right"></i>',
						previous: '<i class="fas fa-angle-left"></i>',
					},
					autoFill: {
						cancel: "Cancelar",
						fill: "Llenar las celdas con <i>%d<i></i></i>",
						fillHorizontal: "Llenar las celdas horizontalmente",
						fillVertical: "Llenar las celdas verticalmente",
					},
					decimal: ",",
					emptyTable: "No hay datos disponibles en la Tabla",
					infoFiltered: ". Filtrado de _MAX_ registros totales",
					infoThousands: ".",
					processing: "Procesando...",
					search: "Busqueda:",
					datetime: {
						previous: "Anterior",
						next: "Siguiente",
						hours: "Hora",
						minutes: "Minuto",
						seconds: "Segundo",
						amPm: ["AM", "PM"],
						months: {
							0: "Enero",
							1: "Febrero",
							2: "Marzo",
							3: "Abril",
							4: "Mayo",
							5: "Junio",
							6: "Julio",
							7: "Agosto",
							8: "Septiembre",
							9: "Octubre",
							10: "Noviembre",
							11: "Diciembre",
						},
						unknown: "-",
						weekdays: [
							"Dom",
							"Lun",
							"Mar",
							"Mie",
							"Jue",
							"Vie",
							"Sab",
						],
					},
					info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
				},
				buttons: [
					{
						extend: "pageLength",
						className: "btn bg-secondary-subtle text-dark",
					},
					{
						extend: "colvis",
						className: "btn bg-secondary-subtle text-dark",
						text: '<i class="fas fa-filter fa-xl"></i>',
						titleAttr: "Mostrar/Ocultar columnas",
					},
					{
						extend: "excelHtml5",
						className: "btn btn-success",
						text: '<i class="fas fa-file-excel fa-xl"></i>',
						titleAttr: "Exportar datos a Excel",
					},
					{
						extend: "pdfHtml5",
						className: "btn btn-danger",
						text: '<i class="fas fa-file-pdf fa-xl"></i>',
						titleAttr: "Exportar datos a PDF",
					},
					{
						extend: "print",
						className: "btn btn-warning",
						text: '<i class="fas fa-print"></i>',
						title: "Movimientos",
						titleAttr: "Imprimir datos",
					},
					{
						extend: "copy",
						className: "btn btn-dark",
						text: '<i class="fas fa-copy"></i>',
						titleAttr: "Copia de datos a portapapeles",
					},
				],
				dom:
					"<'row mb-2'<'col-md-6'B><'col-md-6'f>>" + // Agregamos contenedor para botones y cont para búsqueda
					"<'row'<'col-md-12'tr>>" + // Agregamos contenedor para tabla
					"<'row mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-end'p>>",
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
						targets: 3,
						width: "15%",
						render: function (data, type, row) {
							if (type === "display") {
								return `<div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${data}</div>`;
							}
							return data;
						},
					},
					{
						targets: 4,
						width: "15%",
						render: function (data, type, row) {
							if (type === "display") {
								return `<div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${data}</div>`;
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
						data: "fecha",
					},
					{
						data: "nro_acta",
					},
					{
						data: "profesional_nombre",
					},
					{
						data: "infraccion",
						width: "80px",
					},
					{
						data: "comentario",
						width: "80px",
					},
					{
						data: "fecha_cierre",
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
							<button class="btn btn-success btn-sm seguimientos-btn" data-id="${row.id}"><i class="fa-solid fa-road"></i>  Seguimientos</button>
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
				autoWidth: false,
				paging: true,
				searching: true,
				ordering: true,
				info: true,
				order: [[0, "desc"]],
			});
		}

		$(tablaDenunciasRef.current).on("click", ".mostrar-btn", function () {
			const rowData = dataTableRef.current
				.row($(this).closest("tr"))
				.data();
			mostrarDenuncia(rowData);
		});

		$(tablaDenunciasRef.current).on("click", ".editar-btn", function () {
			const rowData = dataTableRef.current
				.row($(this).closest("tr"))
				.data();
			editarDenuncia(rowData);
		});

		$(tablaDenunciasRef.current).on("click", ".eliminar-btn", function () {
			const rowData = dataTableRef.current
				.row($(this).closest("tr"))
				.data();
			eliminarDenuncia(rowData);
		});

		$(tablaDenunciasRef.current).on("click", ".seguimientos-btn", function () {
			const rowData = dataTableRef.current
				.row($(this).closest("tr"))
				.data();
			mostrarSeguimiento(rowData);
		});
	}, [denuncias]);

	useEffect(() => {
		fetchEstablecimientos(setEstablecimientos);
		fetchProfesionales(setProfesionales);
		fetchDenuncias(setDenuncias);
	}, []);

	const mostrarSeguimiento = (data) => {
		setSelectedDenunciaSeguimiento(data)
		setShowDenunciasSeguimientosListaModal(true);
	};

	const eliminarDenuncia = async (denuncia) => {
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
				const endpoint = `${API_ENDPOINT}/denuncias/`;
				const direction = denuncia.id;
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

				// Actualizar la tabla llamando a fetchDenuncias
				setTimeout(() => {}, 2500);
				try {
					// Llamada a la función fetchDenuncias directamente
					await fetchDenuncias(setDenuncias);
				} catch (error) {
					console.error(
						"Error al eliminar el registro:",
						error.message
					);
				}
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

	const mostrarDenuncia = (data) => {
		setSelectedDenuncia(data);
		setModalMode("mostrar");
		setShowDenunciasModal(true);
	};

	const editarDenuncia = (data) => {
		setSelectedDenuncia(data);
		setModalMode("editar");
		setShowDenunciasModal(true);
	};

	const fetchProfesionales = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/profesionales/`;
			const method = "GET";
			const headers = {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			};

			const response = await apiConnection(
				endpoint,
				"",
				method,
				false,
				headers
			);

			if (response) {
				return response.data; // Devuelve los datos de los profesionales
			}
		} catch (error) {
			console.error("Error fetching profesionales:", error.message);
		}
	};

	const fetchEstablecimientos = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/establecimientos/`;
			const method = "GET";
			const headers = {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			};

			const response = await apiConnection(
				endpoint,
				"",
				method,
				false,
				headers
			);

			if (response) {
				return response.data; // Devuelve los datos de los establecimientos
			}
		} catch (error) {
			console.error("Error fetching establecimientos:", error.message);
		}
	};

	useEffect(() => {
		if (!showDenunciasModal) {
			setSelectedDenuncia(null);
		}
	}, [showDenunciasModal]);

	const openDenunciasModal = () => setShowDenunciasModal(true);
	
	const closeDenunciasModal = () => setShowDenunciasModal(false);

	const closeDenunciasSeguimientosListaModal = () => setShowDenunciasSeguimientosListaModal(false);

	return (
		<>
			<div className="content-wrapper">
				<div className="content-header">
					<div className="container-fluid">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1 className="m-0">Denuncias</h1>
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
										openDenunciasModal();
									}}>
									<i className="fa-regular fa-square-plus"></i>{" "}
									Agregar
								</button>
							</div>
						</div>
						<div className="card-body">
							<div className="container-fluid mt-0">
								<table
									ref={tablaDenunciasRef}
									id="tabla_denuncias"
									className="table table-hover table-sm">
									<thead className="table-dark">
										<tr>
											<th>Fecha</th>
											<th>N° de Acta</th>
											<th>Profesional</th>
											<th>Infracción</th>
											<th>Comentario</th>
											<th>Cierre</th>
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
			<DenunciasModal
				showModal={showDenunciasModal}
				closeModal={closeDenunciasModal}
				data={selectedDenuncia}
				modalMode={modalMode}
				API_ENDPOINT={API_ENDPOINT}
				/>
			<DenunciasSeguimientosListaModal
				showModalSeguimientoLista={showDenunciasSeguimientosListaModal}
				closeModalSeguimientoLista={closeDenunciasSeguimientosListaModal}
				dataSeguimientoLista={selectedDenunciaSeguimiento}
				API_ENDPOINT={API_ENDPOINT}
				SERVER_PATH={SERVER_PATH}
			/>
		</>
	);
};

export default DenunciasTabla;
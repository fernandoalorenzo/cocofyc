import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import UsuariosModal from "./UsuariosModal";
import UsuariosPasswordModal from "./UsuariosPasswordModal";
import {
	datatableLanguageConfig,
	datatableButtonsConfig,
	datatableDomConfig,
} from "../../utils/dataTableConfig";


const UsuariosTabla = ( {API_ENDPOINT} ) => {
	const [data, setData] = useState([]);
	const [showUsuariosModal, setShowUsuariosModal] = useState(false);
	const [selectedUsuario, setSelectedUsuario] = useState(null);
	const [modalMode, setModalMode] = useState("");
	const [showPasswordModal, setShowPasswordModal] = useState(false);

	const tablaUsuariosRef = useRef(null);
	const dataTableRef = useRef(null);

	const fetchUsuarios = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/usuarios`;
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

	const handleEliminar = async (user) => {
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
				const endpoint = `${API_ENDPOINT}/usuarios/`;
				const direction = user.id;
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

	const handleMostrar = (usuario, mode) => {
		setSelectedUsuario(usuario);
		setModalMode(mode);
		setShowUsuariosModal(true);
	};

	const openUsuariosModal = () => setShowUsuariosModal(true);

	const closeUsuariosModal = () => setShowUsuariosModal(false);

	useEffect(() => {
		if (!showUsuariosModal) {
			setSelectedUsuario(null);
		}
	}, [showUsuariosModal]);

	// DATATABLE
	useEffect(() => {
		if (dataTableRef.current) {
			dataTableRef.current.clear().rows.add(data).draw();
		} else if (data.length && tablaUsuariosRef.current) {
			dataTableRef.current = $(tablaUsuariosRef.current).DataTable({
				data: data,
				language: datatableLanguageConfig,
				buttons: datatableButtonsConfig, ...datatableDomConfig,
				// language: {
				// 	buttons: {
				// 		copy: "Copiar",
				// 		colvis: "Visibilidad",
				// 		colvisRestore: "Restaurar visibilidad",
				// 		copyTitle: "Copiar al portapapeles",
				// 		copySuccess: {
				// 			1: "Copiado 1 registro al portapapeles",
				// 			_: "Copiados %d registros al portapapeles",
				// 		},
				// 		csv: "CSV",
				// 		excel: "Excel",
				// 		pageLength: {
				// 			"-1": "Mostrar todos los registros",
				// 			_: "Mostrar %d registros",
				// 		},
				// 		pdf: "PDF",
				// 		print: "Imprimir",
				// 	},
				// 	lengthMenu: "Mostrar _MENU_ registros",
				// 	zeroRecords: "No se encontraron resultados",
				// 	infoEmpty:
				// 		"Mostrando registros del 0 al 0 de un total de 0 registros",
				// 	loadingRecords: "Cargando...",
				// 	paginate: {
				// 		first: '<i class="fas fa-angle-double-left"></i>',
				// 		last: '<i class="fas fa-angle-double-right"></i>',
				// 		next: '<i class="fas fa-angle-right"></i>',
				// 		previous: '<i class="fas fa-angle-left"></i>',
				// 	},
				// 	autoFill: {
				// 		cancel: "Cancelar",
				// 		fill: "Llenar las celdas con <i>%d<i></i></i>",
				// 		fillHorizontal: "Llenar las celdas horizontalmente",
				// 		fillVertical: "Llenar las celdas verticalmente",
				// 	},
				// 	decimal: ",",
				// 	emptyTable: "No hay datos disponibles en la Tabla",
				// 	infoFiltered: ". Filtrado de _MAX_ registros totales",
				// 	infoThousands: ".",
				// 	processing: "Procesando...",
				// 	search: "Busqueda:",
				// 	datetime: {
				// 		previous: "Anterior",
				// 		next: "Siguiente",
				// 		hours: "Hora",
				// 		minutes: "Minuto",
				// 		seconds: "Segundo",
				// 		amPm: ["AM", "PM"],
				// 		months: {
				// 			0: "Enero",
				// 			1: "Febrero",
				// 			2: "Marzo",
				// 			3: "Abril",
				// 			4: "Mayo",
				// 			5: "Junio",
				// 			6: "Julio",
				// 			7: "Agosto",
				// 			8: "Septiembre",
				// 			9: "Octubre",
				// 			10: "Noviembre",
				// 			11: "Diciembre",
				// 		},
				// 		unknown: "-",
				// 		weekdays: [
				// 			"Dom",
				// 			"Lun",
				// 			"Mar",
				// 			"Mie",
				// 			"Jue",
				// 			"Vie",
				// 			"Sab",
				// 		],
				// 	},
				// 	info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
				// },
				// buttons: [
				// 	{
				// 		extend: "pageLength",
				// 		className: "btn bg-secondary-subtle text-dark",
				// 	},
				// 	{
				// 		extend: "colvis",
				// 		className: "btn bg-secondary-subtle text-dark",
				// 		text: '<i class="fas fa-filter fa-xl"></i>',
				// 		titleAttr: "Mostrar/Ocultar columnas",
				// 	},
				// 	{
				// 		extend: "excelHtml5",
				// 		className: "btn btn-success",
				// 		text: '<i class="fas fa-file-excel fa-xl"></i>',
				// 		titleAttr: "Exportar datos a Excel",
				// 	},
				// 	{
				// 		extend: "pdfHtml5",
				// 		className: "btn btn-danger",
				// 		text: '<i class="fas fa-file-pdf fa-xl"></i>',
				// 		titleAttr: "Exportar datos a PDF",
				// 	},
				// 	{
				// 		extend: "print",
				// 		className: "btn btn-warning",
				// 		text: '<i class="fas fa-print"></i>',
				// 		title: "Movimientos",
				// 		titleAttr: "Imprimir datos",
				// 	},
				// 	{
				// 		extend: "copy",
				// 		className: "btn btn-dark",
				// 		text: '<i class="fas fa-copy"></i>',
				// 		titleAttr: "Copia de datos a portapapeles",
				// 	},
				// ],
				// dom:
				// 	// "<'row mb-2'<'col-md-6'B><'col-md-6'f>>" + // Agregamos contenedor para botones y cont para búsqueda
				// 	"<'row'<'col-md-12'tr>>" + // Agregamos contenedor para tabla
				// 	"<'row mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-end'p>>",
				columns: [
					{
						data: "nombre",
					},
					{
						data: "apellido",
					},
					{
						data: "email",
					},
					{
						data: "administrador",
						orderable: false,
						render: function (data, type, row) {
							if (type === "display") {
								const switchId = `switch-admin-${row.id}`;
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
						data: "activo",
						orderable: false,
						render: function (data, type, row) {
							if (type === "display") {
								const switchId = `switch-act-${row.id}`;
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
							<button class="btn btn-success btn-sm password-btn" data-id="${row.id}"><i class="fa-solid fa-key"></i>  Contraseña</button>
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

		// Eventos
		$(tablaUsuariosRef.current).on("click", ".mostrar-btn", function () {
			const rowData = dataTableRef.current
				.row($(this).closest("tr"))
				.data();
			handleMostrar(rowData, "mostrar");
		});

		$(tablaUsuariosRef.current).on("click", ".editar-btn", function () {
			const rowData = dataTableRef.current
				.row($(this).closest("tr"))
				.data();
			handleMostrar(rowData, "editar");
		});

		$(tablaUsuariosRef.current).on("click", ".eliminar-btn", function () {
			const rowData = dataTableRef.current
				.row($(this).closest("tr"))
				.data();
			handleEliminar(rowData);
		});

		$(tablaUsuariosRef.current).on("click", ".password-btn", function () {
			const rowData = dataTableRef.current
				.row($(this).closest("tr"))
				.data();
			handlePassword(rowData);
		});
	}, [data]);

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
													openUsuariosModal();
												}}>
												<i className="fa-regular fa-square-plus"></i>{" "}
												Agregar
											</button>
										</div>
									</div>
									<div className="card-body">
										<div className="container-fluid mt-0">
											<table
												ref={tablaUsuariosRef}
												id="tabla_usuarios"
												className="table table-hover table-sm">
												<thead className="table-dark">
													<tr>
														<th>Nombre</th>
														<th>Apellido</th>
														<th>e-Mail</th>
														<th>Administrador</th>
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
					</section>
				</div>
			</div>
			<UsuariosModal
				showModal={showUsuariosModal}
				closeModal={closeUsuariosModal}
				data={selectedUsuario}
				modalMode={modalMode}
				fetchUsuarios={fetchUsuarios}
				API_ENDPOINT={API_ENDPOINT}
			/>
			<UsuariosPasswordModal
				showModalPassword={showPasswordModal}
				closeModalPassword={() => setShowPasswordModal(false)}
				usuario={selectedUsuario}
				API_ENDPOINT={API_ENDPOINT}
			/>
		</>
	);
};

export default UsuariosTabla;

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import apiConnection from "../../../../backend/functions/apiConnection";
import DenunciasSeguimientosModal from "./denunciasSeguimientosModal";
import {
	datatableLanguageConfig,
	datatableButtonsConfig,
	datatableDomConfig,
} from "../../utils/dataTableConfig";


const DenunciasSeguimientosListaModal = ({
	showModalSeguimientoLista,
	closeModalSeguimientoLista,
	dataSeguimientoLista,
	API_ENDPOINT,
	SERVER_PATH,
}) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm();

	const user = JSON.parse(localStorage.getItem("user")) || {};
	const [denunciaId, setDenunciaId] = useState("");
	const [seguimientos, setSeguimientos] = useState([]);
	const [nroComprobante, setNroComprobante] = useState("");
	const [modalFormMode, setModalFormMode] = useState("");
	const [editingSeguimiento, setEditingSeguimiento] = useState(null);
	const [isBotonAgregarEnabled, setIsBotonAgregarEnabled] = useState(true);
	const [modalSeguimientoMode, setModalSeguimientoMode] = useState("");

	const [selectedDenunciaSeguimiento, setSelectedDenunciaSeguimiento] =
		useState(null);
	const [showDenunciasSeguimientosModal, setShowDenunciasSeguimientosModal] =
		useState(false);
	const closeDenunciasSeguimientosModal = () =>
		setShowDenunciasSeguimientosModal(false);

	const tablaSeguimientosRef = useRef(null);
	const dataTableRefSeguimiento = useRef(null);

	const getCurrentDate = () => {
		const now = new Date();
		const year = now.getFullYear();
		let month = now.getMonth() + 1;
		let day = now.getDate();
		if (month < 10) month = "0" + month;
		if (day < 10) day = "0" + day;
		return `${year}-${month}-${day}`;
	};

	const initialState = {
		fecha: getCurrentDate(),
		proximo_seguimiento: null,
		respuesta: "",
	};

	// DATATABLE
	useEffect(() => {
		if (dataTableRefSeguimiento.current) {
			dataTableRefSeguimiento.current
				.clear()
				.rows.add(seguimientos)
				.draw();
		} else if (seguimientos.length && tablaSeguimientosRef.current) {
			dataTableRefSeguimiento.current = $(
				tablaSeguimientosRef.current
			).DataTable({
				data: seguimientos,
				language: datatableLanguageConfig,
				buttons: datatableButtonsConfig, ... datatableDomConfig,
				columnDefs: [
					{
						targets: [0, 2], // El índice de la columna de fecha (0 es la primera columna)
						render: function (data, type, row) {
							if (data && type === "display") {
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
						data: "fecha",
						className: "text-center",
						width: "12%",
					},
					{
						data: "respuesta",
					},
					{
						data: "proximo_seguimiento",
						className: "text-center",
						width: "12%",
					},
					{
						// Columna de acciones
						data: null,
						className: "text-center",
						render: function (data, type, row) {
							return `
                            <button class="btn btn-warning btn-sm editar-seguimiento-btn" data-id="${row.id}"><i class="fa-regular fa-pen-to-square"></i> Editar</button>
                            <button class="btn btn-danger btn-sm eliminar-seguimiento-btn" data-id="${row.id}"><i class="fa-regular fa-trash-can"></i>  Eliminar</button>
                        `;
						},
						orderable: false,
						searchable: false,
						width: "20%",
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

		$(document).on(
			"click",
			".modal-seguimientos .editar-seguimiento-btn",
			function () {
				const seguimientoId = $(this).data("id");
				editarSeguimiento(seguimientoId);
			}
		);

		$(document).on(
			"click",
			".modal-seguimientos .eliminar-seguimiento-btn",
			function () {
				const seguimientoId = $(this).data("id");
				eliminarSeguimiento(seguimientoId);
			}
		);

		$(document).on(
			"click",
			".modal-seguimientos .archivos-seguimiento-btn",
			function () {
				const seguimientoId = $(this).data("id");
				setSelectedDenunciaSeguimiento(seguimientoId);
			}
		);
	}, [seguimientos]);

	const editarSeguimiento = (seguimientoId) => {
		const seguimiento = seguimientos.find(
			(seg) => seg.id === seguimientoId
		);
		if (seguimiento) {
			setEditingSeguimiento(seguimiento);
			reset({
				fecha: seguimiento.fecha,
				respuesta: seguimiento.respuesta,
				proximo_seguimiento: seguimiento.proximo_seguimiento,
			});
		}
		setModalSeguimientoMode("editar");
		setShowDenunciasSeguimientosModal(true);
	};

	const eliminarSeguimiento = async (seguimientoId) => {
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

		if (result.isConfirmed) {
			try {
				const endpoint = `${API_ENDPOINT}/denuncias/seguimiento/`;
				const direction = seguimientoId;
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
				setTimeout(() => {
					fetchSeguimientos(dataSeguimientoLista);
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

	const fetchSeguimientos = async (dataSeguimientoLista) => {
		const denunciaId = dataSeguimientoLista.id;
		try {
			const endpoint = `${API_ENDPOINT}/denuncias/seguimientos/`;
			const direction = denunciaId ? `${denunciaId}` : denunciaId;
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
				// Ordena los seguimientos por fecha
				response.data.sort(
					(a, b) => new Date(a.fecha) - new Date(b.fecha)
				);

				setSeguimientos(response.data);
			} else {
				console.error(
					"Error fetching seguimientos: ",
					response.statusText
				);
			}
		} catch (error) {
			console.error("Error fetching seguimientos: ", error);
		}
	};

	const updateSeguimientos = () => {
		fetchSeguimientos(dataSeguimientoLista); // Vuelve a obtener los seguimientos actualizados
	};

	useEffect(() => {
		if (dataSeguimientoLista) {
			setDenunciaId(dataSeguimientoLista.id);
			fetchSeguimientos(dataSeguimientoLista);
			setNroComprobante(dataSeguimientoLista.nro_comprobante);
		}
		// Bloquea el botón de agregar seguimiento si la denuncia ya tiene la denuncia cerrada
		if (
			dataSeguimientoLista &&
			dataSeguimientoLista.fecha_cierre !== null &&
			dataSeguimientoLista.fecha_cierre !== "0000-00-00"
		) {
			setIsBotonAgregarEnabled(false);
		} else {
			setIsBotonAgregarEnabled(true);
		}
	}, [dataSeguimientoLista]);

	useEffect(() => {
		if (dataTableRefSeguimiento.current) {
			dataTableRefSeguimiento.current
				.clear()
				.rows.add(seguimientos)
				.draw();
		}
	}, [seguimientos]);

	return (
		<>
			<div
				className={`modal fade ${
					showModalSeguimientoLista ? "show" : ""
				} modal-seguimientos`}
				tabIndex="-1"
				style={{
					display: showModalSeguimientoLista ? "block" : "none",
				}}
				id="staticBackdrop"
				data-bs-target="#staticBackdrop"
				data-bs-backdrop="static"
				data-bs-keyboard="false"
				aria-labelledby="staticBackdropLabel"
				aria-hidden={!showModalSeguimientoLista}>
				<div className="modal-dialog modal-xl modal-dialog-centered">
					<div className="modal-content bg-secondary">
						<div className="modal-header bg-primary">
							<h5 className="modal-title">
								Seguimientos del Comprobante N°{" "}
								<span className="fw-bold text-warning">
									{nroComprobante}
								</span>
							</h5>
							<button
								type="button"
								className="btn-close"
								aria-label="Close"
								onClick={() => {
									closeModalSeguimientoLista();
									setModalFormMode("");
								}}></button>
						</div>
						<div className="container-fluid">
							<div className="justify-content-end text-end d-flex my-3">
								<button
									type="button"
									className="btn btn-primary"
									id="abrirModalAgregar"
									onClick={() => {
										reset(initialState);
										setShowDenunciasSeguimientosModal(true);
										setModalSeguimientoMode("agregar");
									}}>
									<i className="fa-regular fa-square-plus"></i>{" "}
									Agregar
								</button>
							</div>
							<div className="card-body mb-3" id="cardBodyTabla">
								<table
									ref={tablaSeguimientosRef}
									id="tabla_seguimientos"
									className="table table-hover table-sm">
									<thead className="table-dark">
										<tr>
											<th>Fecha</th>
											<th>Respuesta</th>
											<th>Próx. Seg.</th>
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
			<DenunciasSeguimientosModal
				showModalSeguimiento={showDenunciasSeguimientosModal}
				closeModalSeguimiento={closeDenunciasSeguimientosModal}
				editingSeguimiento={editingSeguimiento}
				modalSeguimientoMode={modalSeguimientoMode}
				updateSeguimientos={updateSeguimientos}
				denunciaId={denunciaId}
				API_ENDPOINT={API_ENDPOINT}
				SERVER_PATH={SERVER_PATH}
			/>
		</>
	);
};
export default DenunciasSeguimientosListaModal;
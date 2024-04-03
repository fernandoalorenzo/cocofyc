import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import apiConnection from "../../../../../backend/functions/apiConnection";

const DenunciasTab = ({ profesionalId }) => {
	const user = JSON.parse(localStorage.getItem("user")) || {};
	const [denuncias, setDenuncias] = useState([]);
	const [establecimientos, setEstablecimientos] = useState([]);
	const [expandedRows, setExpandedRows] = useState([]);

	const tablaDenunciasRef = useRef(null);
	const dataTableRef = useRef(null);

	useEffect(() => {
		// Lógica para obtener los registros disponibles desde la API
		if (profesionalId) {
			fetchDenuncias();
		}
	}, [profesionalId]);

	// DATATABLE
	useEffect(() => {
		if (dataTableRef.current) {
			dataTableRef.current.clear().rows.add(denuncias).draw();
		} else if (denuncias.length && tablaDenunciasRef.current) {
			dataTableRef.current = $(tablaDenunciasRef.current).DataTable({
				data: denuncias,
				language: {
					// url: "//cdn.datatables.net/plug-ins/2.0.3/i18n/es-AR.json",
					buttons: {
						copy: "Copiar",
						colvis: "Visibilidad",
						colvisRestore: "Restaurar visibilidad",
						copyTitle: "Copiar al portapapeles",
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
						extend: "copy",
						className: "btn btn-dark",
						text: '<i class="fas fa-copy"></i>',
						titleAttr: "Copia de datos al portapapeles",
					},
				],
				dom:
					"<'row'<'col-md-6'B><'col-md-6'f>>" + // Agregamos contenedor para botones y cont para búsqueda
					"<'row'<'col-md-12'tr>>" + // Agregamos contenedor para tabla
					"<'row'<'col-md-6'i><'col-md-6'p>>",
				columns: [
					{
						data: "fecha",
						render: function (data) {
							// Crear una instancia de Date interpretando la fecha como UTC
							const date = new Date(data + "T00:00:00Z");
							// Obtener los componentes de la fecha en formato UTC
							const day = date
								.getUTCDate()
								.toString()
								.padStart(2, "0");
							const month = (date.getUTCMonth() + 1)
								.toString()
								.padStart(2, "0");
							const year = date.getUTCFullYear();
							return `${day}/${month}/${year}`;
						},
					},
					{
						data: "nro_acta",
					},
					{
						data: "infraccion",
					},
					{
						data: "comentario",
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
			});
		}
		// fetchCuotas();
	}, [denuncias]);

	const fetchDenuncias = async () => {
		try {
			const endpoint = `http://localhost:5000/api/denuncias/profesional/${profesionalId}`;
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
				response.data.sort(
					(a, b) => new Date(b.fecha) - new Date(a.fecha)
				);
				setDenuncias(response.data);
			} else {
				console.error(
					"Error fetching cuotas generadas: ",
					response.statusText
				);
			}
		} catch (error) {
			console.error("Error fetching cuotas generadas: ", error);
		}
	};

	// Obtener la fecha actual
	const getCurrentDate = () => {
		const now = new Date();
		const year = now.getFullYear();
		let month = now.getMonth() + 1;
		let day = now.getDate();
		if (month < 10) month = "0" + month;
		if (day < 10) day = "0" + day;
		return `${year}-${month}-${day}`;
	};

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const fetchEstablecimientos = async () => {
		try {
			const endpoint =
				"http://localhost:5000/api/establecimientos/asignados/";
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

			// Ordenar la lista por el campo "establecimiento"
			response.sort((a, b) => {
				if (a.establecimiento < b.establecimiento) {
					return -1;
				}
				if (a.establecimiento > b.establecimiento) {
					return 1;
				}
				return 0;
			});

			setEstablecimientos(response);
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	useEffect(() => {
		if (profesionalId) {
			fetchEstablecimientos();
		}
	}, [profesionalId]);

	const onSubmitCargarDenuncia = async (data) => {
		// Agregar el campo tipo_operacion con el valor "INGRESO"
		const newData = {
			...data,
			user_id: user.id,
			profesional_id: profesionalId,
		};
		try {
			const endpoint = "http://localhost:5000/api/denuncias/";
			const direction = "";
			const method = "POST";
			const body = newData;
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
				title: "Éxito",
				text: "El registro fue creado exitosamente",
				icon: "success",
				showConfirmButton: false,
				timer: 2500,
			});

			setTimeout(() => {
				fetchDenuncias();
			}, 2500);

			// Resetear el formulario después de guardar los cambios
			reset();
		} catch (error) {
			console.error("Error al guardar el registro:", error.message);
			Swal.fire({
				title: "Error",
				text: "Ha ocurrido un error al intentar guardar el registro",
				icon: "error",
			});
		}
	};

	return (
		<>
			<div className="modal-body">
				<div className="col-12">
					<div className="card collapsed-card">
						<div className="card-header border-0 bg-primary bg-opacity-50">
							<h3 className="card-title fw-bold">
								Agregar denuncia
							</h3>
							<div className="card-tools">
								<button
									type="button"
									className="btn btn-primary btn-sm collapsed"
									data-card-widget="collapse">
									<i className="fas fa-plus" />
								</button>
							</div>
						</div>
						<div className="card-body collapsed-card">
							<form
								id="cargar-pago"
								onSubmit={handleSubmit(onSubmitCargarDenuncia)}>
								<div className="row mt-2">
									{/* fecha */}
									<div className="col">
										<label htmlFor="fecha">Fecha:</label>
										<input
											type="date"
											id="fecha"
											className="form-control"
											defaultValue={getCurrentDate()}
											{...register("fecha", {
												required: true,
											})}
										/>
										{errors.fecha?.type === "required" && (
											<span className="row text-danger m-1">
												Este campo es requerido
											</span>
										)}
									</div>
									{/* Nº Acta */}
									<div className="col">
										<label htmlFor="nro_acta">
											Nº de Acta:
										</label>
										<input
											type="text"
											id="nro_acta"
											className="form-control"
											{...register("nro_acta", {
												required: true,
											})}
										/>
										{errors.nro_acta?.type ===
											"required" && (
											<span className="row text-danger m-1">
												Este campo es requerido
											</span>
										)}
									</div>
									{/* establecimiento_id */}
									<div className="col">
										<label htmlFor="establecimiento_id">
											Establecimiento:
										</label>
										<select
											className="form-select"
											id="establecimiento_id"
											{...register("establecimiento_id")}>
											<option value="">
												Selecciona un establecimiento
											</option>
											{establecimientos.map(
												(establecimiento) => (
													<option
														key={establecimiento.id}
														value={
															establecimiento.id
														}>
														{
															establecimiento.establecimiento
														}
													</option>
												)
											)}
										</select>
									</div>
								</div>
								<div className="row mt-2">
									{/* infraccion */}
									<div className="col">
										<label htmlFor="infraccion">
											Infracción:
										</label>
										<input
											type="text"
											className="form-control"
											id="infraccion"
											{...register("infraccion", {
												required: true,
											})}
										/>
										{errors.infraccion?.type ===
											"required" && (
											<span className="row text-danger m-1">
												Este campo es requerido
											</span>
										)}
									</div>
									{/* comentario */}
									<div className="col">
										<label htmlFor="comentario">
											Comentario:
										</label>
										<input
											type="text"
											className="form-control"
											id="comentario"
											{...register("comentario", {
												required: true,
											})}
										/>
										{errors.comentario?.type ===
											"required" && (
											<span className="row text-danger m-1">
												Este campo es requerido
											</span>
										)}
									</div>
								</div>
								<div className="row mt-3 pb-0 d-flex justify-content-end border-top border-secondary border-opacity-25">
									<button
										type="submit"
										className="btn btn-primary col-md-2 my-3 me-3">
										Guardar
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
				<div className="col-12">
					<div className="card">
						<div className="card-header bg-primary bg-opacity-50 align-items-center text-center">
							<h5 className="card-title fw-bold text-center">
								Denuncias realizadas al profesional
							</h5>
						</div>
						<div className="card-body">
							<table
								ref={tablaDenunciasRef}
								id="tabla_denuncias"
								className="table table-hover table-sm">
								<thead className="table-warning">
									<tr>
										<th>Fecha</th>
										<th>N° de Acta</th>
										<th>Infracción</th>
										<th>Comentario</th>
									</tr>
								</thead>
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default DenunciasTab;

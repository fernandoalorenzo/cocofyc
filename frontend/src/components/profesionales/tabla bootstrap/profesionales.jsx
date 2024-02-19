import React, { useState, useEffect } from "react";

const ProfesionalesTabla = () => {
	const [profesionales, setProfesionales] = useState([]);

	useEffect(() => {
		const fetchProfesionales = async () => {
			try {
				const response = await fetch(
					"http://localhost:5000/profesionales"
				); // Cambia esta URL por la correcta según tu configuración de backend
				if (!response.ok) {
					throw new Error("Error al obtener los datos");
				}
				const data = await response.json();
				setProfesionales(data.data);
			} catch (error) {
				console.error("Error:", error.message);
			}
		};

		fetchProfesionales();
	}, []);

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
				<section className="content">
					<div className="container-fluid">
						<div className="d-flex justify-content-end mb-3">
							<button
								type="button"
								className="btn btn-primary align-self-end"
								id="abrirModalAgregar"
								onClick={() => handleAgregar()}>
								<i className="fa-regular fa-square-plus"></i>{" "}
								Agregar
							</button>
						</div>
						<table className="table table-hover table-sm table-borderless align-middle text-center">
							<thead className="table-dark">
								<tr>
									{/* <th>ID</th> */}
									<th scope="col">Nombre</th>
									<th scope="col">DNI</th>
									<th scope="col">CUIT</th>
									<th scope="col">E-Mail</th>
									<th scope="col">Teléfono</th>
									<th scope="col">Activo</th>
									<th scope="col">Acciones</th>
									{/* Agrega aquí más columnas según tus necesidades */}
								</tr>
							</thead>
							<tbody>
								{profesionales.map((profesional) => (
									<tr key={profesional.id}>
										{/* <td>{profesional.id}</td> */}
										<td className="text-start">
											{profesional.nombre}
										</td>
										<td>{profesional.dni}</td>
										<td>{profesional.cuit}</td>
										<td className="text-start">
											{profesional.email}
										</td>
										<td>{profesional.telefono}</td>
										<td>
											<input
												type="checkbox"
												checked={
													profesional.activo
														? true
														: false
												}
												readOnly
											/>
										</td>
										<td className="table-secondary">
											<button
												className="btn btn-warning mx-2"
												data-bs-id="{user.id_user}"
												onClick={() =>
													handleEditar(user.id_user)
												}>
												<i className="fa-regular fa-pen-to-square"></i>{" "}
												Editar
											</button>
											<button
												className="btn btn-danger mx-2"
												data-bs-id="{user.id_user}"
												onClick={() =>
													handleEliminarUsuario(
														user.id_user
													)
												}>
												<i className="fa-regular fa-trash-can"></i>{" "}
												Eliminar
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			</div>
		</>
	);
};

export default ProfesionalesTabla;

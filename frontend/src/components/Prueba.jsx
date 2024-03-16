import React, { useState } from "react";
// import { Modal, Button } from "bootstrap"; // Importa los componentes necesarios de Bootstrap

function Prueba({ profesional }) {
	// const [showModal, setShowModal] = useState(false);
	const [establecimientosAsignados, setEstablecimientosAsignados] = useState(
		[]
	);
	const [establecimientosNoAsignados, setEstablecimientosNoAsignados] =
		useState([]);

	// Función para abrir y cerrar el modal
	// const toggleModal = () => {
	// 	setShowModal(!showModal);
	// };

	// Función para desvincular un establecimiento del profesional
	const desvincularEstablecimiento = (establecimiento) => {
		// Implementa la lógica para desvincular el establecimiento del profesional
		// Actualiza el estado de establecimientosAsignados
	};

	// Función para relacionar un establecimiento con el profesional
	const relacionarEstablecimiento = (establecimiento) => {
		// Implementa la lógica para relacionar el establecimiento con el profesional
		// Actualiza el estado de establecimientosNoAsignados
	};

	return (
		<>
			{/* Botón para abrir el modal */}
			{/* <Button onClick={toggleModal}>Ver Establecimientos</Button> */}

			{/* Modal */}
			<Modal show={showModal} onHide={toggleModal}>
				<Modal.Header closeButton>
					<Modal.Title>
						Establecimientos para {profesional}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{/* Lista de establecimientos asignados */}
					<h5>Establecimientos Asignados</h5>
					<ul>
						{establecimientosAsignados.map((establecimiento) => (
							<li key={establecimiento.id}>
								{establecimiento.nombre}
								{/* <Button
									onClick={() =>
										desvincularEstablecimiento(
											establecimiento
										)
									}>
									Desvincular
								</Button> */}
							</li>
						))}
					</ul>

					{/* Lista de establecimientos no asignados */}
					<h5>Establecimientos No Asignados</h5>
					<ul>
						{establecimientosNoAsignados.map((establecimiento) => (
							<li key={establecimiento.id}>
								{establecimiento.nombre}
								{/* <Button
									onClick={() =>
										relacionarEstablecimiento(
											establecimiento
										)
									}>
									Relacionar
								</Button> */}
							</li>
						))}
					</ul>
				</Modal.Body>
				<Modal.Footer>
					{/* <Button variant="secondary" onClick={toggleModal}>
						Cerrar
					</Button> */}
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default Prueba;

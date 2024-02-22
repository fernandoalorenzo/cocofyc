import { useState } from "react";

const ProfesionalModal = ({ showModal, closeModal, data }) => {
	return (
		<div
			className={`modal fade ${showModal ? "show" : ""}`}
			style={{ display: showModal ? "block" : "none" }}
			tabIndex="-1"
			role="dialog"
			aria-labelledby="exampleModalLabel"
			aria-hidden="true">
			<div className="modal-dialog modal-dialog-centered" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="exampleModalLabel">
							Detalles del Profesional
						</h5>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={closeModal}></button>
					</div>
					<div className="modal-body">
						<p>Nombre: {data.nombre}</p>
						<p>DNI: {data.dni}</p>
						<p>CUIT: {data.cuit}</p>
						<p>Matrícula: {data.matricula}</p>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-secondary"
							onClick={closeModal}>
							Cerrar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfesionalModal;

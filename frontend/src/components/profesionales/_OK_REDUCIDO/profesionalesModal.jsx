import React from "react";

const Modal = ({ profesional, onClose }) => {
	if (!profesional) {
		return null; // No mostrar el modal si no hay ningún profesional seleccionado
	}

	return (
		<div
			className="modal fade show"
			tabIndex="-1"
			style={{ display: "block" }}>
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">{profesional.nombre}</h5>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={onClose}></button>
					</div>
					<div className="modal-body">
						<p>
							<strong>DNI:</strong> {profesional.dni}
						</p>
						<p>
							<strong>Matrícula:</strong> {profesional.matricula}
						</p>
						<p>
							<strong>Domicilio:</strong> {profesional.domicilio}
						</p>
						{/* Agrega más campos según los datos que quieras mostrar */}
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-secondary"
							onClick={onClose}>
							Cerrar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;

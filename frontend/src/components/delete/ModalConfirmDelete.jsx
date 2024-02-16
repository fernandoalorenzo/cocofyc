/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const UserModalDelete = ({ onCancel, onConfirm, tipoEliminacion }) => {
	return (
		<div
			className="modal fade show"
			tabIndex="-1"
			role="dialog"
			style={{ display: "block" }}>
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header bg-danger text-white">
						<h5 className="modal-title">Confirmar eliminación</h5>
						<button
							type="button"
							className="btn-close"
							onClick={onCancel}>
						</button>
					</div>
					<div className="modal-body">
						<p>
							¿Estás seguro de que deseas eliminar este{" "}
							{tipoEliminacion}?
						</p>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-secondary"
							onClick={onCancel}>
							Cancelar
						</button>
						<button
							type="button"
							className="btn btn-danger"
							onClick={onConfirm}>
							Eliminar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserModalDelete;

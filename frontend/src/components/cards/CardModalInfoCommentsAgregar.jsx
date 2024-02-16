/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { ToastOK } from "../toast/Toast.jsx";
import { Toaster } from "react-hot-toast";
import { ToastErrorGenerico } from "../toast/Toast.jsx";

const CardModalAgregar = ({ onSave, onCancel }) => {
	const [comentario, setComentario] = useState("");
	const [isGuardarDisabled, setGuardarDisabled] = useState(true);

	const user = JSON.parse(localStorage.getItem("user"));
	const userId = user.id;

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		if (name === "comentario") {
			setComentario(value);
		}
	};

	useEffect(() => {
		// Verificar si los campos no estan vacios despues de actualizar estados
		setGuardarDisabled(comentario.trim() === "");
	}, [comentario]);

	const handleSave = () => {
		// Validar que los campos no esten vacios
		if (comentario.trim() === "") {
			// MUESTRA NOTIFICACIÓN
			ToastErrorGenerico("El comentario no puede estar vacío.");
			return;
		}

		// Pasando datos del nuevo comentario
		onSave({ userId, comentario });

		// Limpiar campos y cerrar modal
		setComentario("");
		setGuardarDisabled(true);
	};

	return (
		<>
			<div
				className="modal fade show"
				tabIndex="-1"
				role="dialog"
				style={{ display: "block" }}>
				<div
					className="modal-dialog modal-dialog-centered"
					role="document">
					<div className="modal-content">
						<div className="modal-header bg-primary text-white">
							<h5 className="modal-title">Agregar Comentario</h5>
							<button
								type="button"
								className="btn-close"
								onClick={onCancel}></button>
						</div>
						<div className="modal-body">
							<div className="form-group mb-4">
								<div className="row align-items-start">
									<label className="col-auto form-label">
										Comentario
									</label>
								</div>
								<textarea
									rows="3"
									className="form-control"
									name="comentario"
									value={comentario}
									onInput={handleInputChange}></textarea>
							</div>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-primary"
								onClick={handleSave}
								disabled={isGuardarDisabled}>
								Guardar
							</button>
							<button
								type="button"
								className="btn btn-secondary"
								data-dismiss="modal"
								onClick={onCancel}>
								Cancelar
							</button>
						</div>
					</div>
				</div>
			</div>
			<Toaster />
		</>
	);
};

export default CardModalAgregar;

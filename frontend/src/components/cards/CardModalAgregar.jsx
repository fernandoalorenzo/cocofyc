/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ToastOK } from "../toast/Toast";
import apiConnection from "../../../../backend/functions/apiConnection";

const ModalAgregar = (props) => {
	const [titulo, setTitulo] = useState("");
	const [descripcion, setDescripcion] = useState("");
	const [imagenUrl, setImagenUrl] = useState("");

	const user = JSON.parse(localStorage.getItem("user"));
	const userId = user ? user.id : null;

	const handleImagenUrlChange = (event) => {
		setImagenUrl(event.target.value);
	};
	
	useEffect(() => {
		const cargarDatosExistente = async () => {
			try {
				const endpoint = "http://127.0.0.1:5000/posts/";
				const direction = props.postId;
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

				setTitulo(data.titulo);
				setDescripcion(data.descripcion);
				setImagenUrl(data.imagen);
			} catch (error) {
				console.error(
					"Error al intentar obtener datos para editar: ",
					error
				);
			}
		};
		if (props.isEdit && props.postId) {
			cargarDatosExistente();
		}
	}, [props.isEdit, props.postId]);

	const handleGuardarPost = async () => {
		const data = {
			usuario: userId,
			titulo,
			descripcion,
			imagen: imagenUrl
		};

		try {
			const endpoint = "http://127.0.0.1:5000/posts/";
			const direction = "";
			const method = "POST";
			const body = {
				usuario: userId,
				titulo: titulo,
				descripcion: descripcion,
				imagen: imagenUrl,
			};
			const headers = {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			};

			await apiConnection(
				endpoint,
				direction,
				method,
				body,
				headers
			);

			// CIERRA EL MODAL DESPUÉS DE GUARDAR
			props.onClose();

			// MUESTRA NOTIFICACIÓN
			ToastOK("Posteo", "agregado");
		} catch (error) {
			console.error("Error: ", error.message);
		}
	};

	let modalStyle = {
		display:  "block",
		backgroundColor: "rgba(0, 0, 0, 0.8)",
	};

	return (
		<>
			<div
				className="modal show fade in"
				tabIndex="-1"
				style={modalStyle}>
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header bg-primary">
							<h5 className="modal-title">Agregar Post</h5>
							<button
								type="button"
								className="btn-close"
								onClick={props.onClose}></button>
						</div>
						<div className="d-grid modal-body ">
							<label className="form-label text-start">
								Título
							</label>
							<input
								className="form-control"
								type="text"
								value={titulo}
								onChange={(e) => setTitulo(e.target.value)}
							/>
							<label className="form-label text-start mt-4">
								Descripción
							</label>
							<textarea
								className="form-control"
								type="text"
								value={descripcion}
								onChange={(e) => setDescripcion(e.target.value)}
							/>
							<label className="form-label text-start mt-4">
								URL de Imagen
							</label>
							<input
								className="form-control"
								type="text"
								value={imagenUrl}
								onChange={handleImagenUrlChange}
							/>

							<div
								className="card mt-3 bottom-0 start-50 translate-middle-x"
								style={{ width: "12rem" }}>
								<div className="card-header p-1">
									<p className="p-0 m-0 fw-bold">
										Vista Previa
									</p>
								</div>
								<div className="card-body p-0">
									{imagenUrl.length === 0 && (
										<img
											className="card-img-top p-5"
											src="noimage.png"
											alt="Imagen"
										/>
									)}
									{imagenUrl && (
										<img
											className="card-img-top"
											src={imagenUrl}
											alt="Imagen"
										/>
									)}
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<div className="d-grid gap-2 d-md-flex justify-content-md-end">
								<button
									type="button"
									className="btn btn-primary"
									id="guardar"
									onClick={handleGuardarPost}
									disabled={
										!titulo.trim() ||
										!descripcion.trim() ||
										!imagenUrl.trim()
									}>
									<i className="fa-regular fa-floppy-disk px-2"></i>
									Guardar
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Toaster />
		</>
	);
}

export default ModalAgregar;
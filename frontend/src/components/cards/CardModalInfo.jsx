/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import CardModalInfoComments from "./CardModalInfoComments";
import ModalDelete from "./../delete/ModalConfirmDelete";
import { Toaster } from "react-hot-toast";
import { ToastOK } from "../toast/Toast";
import apiConnection from "../../../../backend/functions/apiConnection";

export default function Modal(props) {
	const [modalDelete, setModalDelete] = useState(false);

	const [isEditing, setIsEditing] = useState(false);
	const [editedTitle, setEditedTitle] = useState(props.titulo);
	const [editedDescription, setEditedDescription] = useState(
		props.descripcion
	);

	const [editedImage, setEditedImage] = useState(props.imagen);

	const [imagenUrl, setImagenUrl] = useState("");

	const [userInfo, setUserInfo] = useState(null);

	// VERIFICAMOS SI EL POST PERTENECE AL USUARIO LOGUEADO ACTUALMENTE
	const [isCurrentUserPost, setIsCurrentUserPost] = useState(false);

	useEffect(() => {
		// Id de Usuario logueado actualmente
		const currentUser = localStorage.getItem("user");
		const currentUserId = JSON.parse(currentUser).id;
		// Id de Usuario del post
		const postUserId = props.usuario;

		// VERIFICAMOS SI EL POST PERTENECE AL USUARIO LOGUEADO ACTUALMENTE (id de usuario logueado vs id de usuario del post)
		setIsCurrentUserPost(currentUserId === postUserId);

		// Obtenemos la información del usuario que creó el post
		const fetchUserInfo = async (postUserId) => {
			try {
				const endpoint = "http://127.0.0.1:5000/users/";
				const direction = props.usuario;
				const method = "GET";
				const body = false;
				const headers = {
					"Content-Type": "application/json",
					Authorization: localStorage.getItem("token"),
				};

				const userData = await apiConnection(
					endpoint,
					direction,
					method,
					body,
					headers
				);

				setUserInfo(userData);
			} catch (error) {
				console.error(
					"Error al intentar obtener datos del usuario: ",
					error
				);
			}
		};

		// VERIFICAMOS SI EL POST PERTENECE AL USUARIO LOGUEADO ACTUALMENTE
		if (postUserId) {
			fetchUserInfo();
		}
	}, [props.usuario]);

	const handleImagenUrlChange = (event) => {
		setImagenUrl(event.target.value);
	};

	const handleEditClick = () => {
		setIsEditing(!isEditing);
	};

	const handleDeleteClick = () => {
		setModalDelete(true);
	};

	const handleSaveClick = async () => {
		try {
			const endpoint = "http://127.0.0.1:5000/posts/";
			const direction = props._id;
			const method = "PUT";
			const body = {
				titulo: editedTitle,
				descripcion: editedDescription,
				imagen: editedImage,
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

			setIsEditing(false);

			// Muestra notificacion
			ToastOK("Posteo", "modificado");

			props.fetchData();

		} catch (error) {
			console.error(
				"Error al intentar guardar las modificaciones: ",
				error
			);
		}
	};

	const handleDelete = async () => {
		try {
			const endpoint = "http://127.0.0.1:5000/posts/";
			const direction = props._id;
			const method = "DELETE";
			const body = false;
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
				
			setModalDelete(false);

			props.onClose();

			// Muestra notificacion
			ToastOK("Posteo", "eliminado");

			props.fetchData();
		} catch (error) {
			console.error("Error al intentar eliminar el posteo: ", error);
		}
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setEditedTitle(props.titulo);
		setEditedDescription(props.descripcion);
		setEditedImage(props.imagen);
	};

	const handleCancelDelete = () => {
		setModalDelete(false);
	};

	let modalStyle = {
		display: "block",
		backgroundColor: "rgba(0, 0, 0, 0.8)",
	};

	return (
		<>
			<div
				className="modal show fade in"
				tabIndex="-1"
				style={modalStyle}>
				<div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
					<div className="modal-content">
						<div className="card-header">
							{userInfo && (
								<div className="col text-start font-italic">
									<h5 style={{ fontStyle: "italic" }}>
										{userInfo.nombre}{" "}
										<span
											className="text-muted"
											style={{
												fontStyle: "normal",
												fontWeight: "normal",
												fontSize: "1rem",
											}}>
											posteó
										</span>
									</h5>
								</div>
							)}
							<div className="row">
								<div className="col m-0">
									{!isEditing ? (
										<h5 className="card-title text-start">
											{props.titulo}
										</h5>
									) : (
										<h5 className="card-title text-start">
											Editar Posteo
										</h5>
									)}
								</div>
								{isCurrentUserPost && !isEditing && (
									<>
										<div className="col-1 mr-1 px-1">
											<i
												className="btn fa-solid fa-regular fa-edit fa-lg"
												style={{
													color: "RGB(255, 202,44)",
												}}
												onClick={handleEditClick}
												title="Editar posteo"></i>
										</div>
										<div className="col-1 mr-1 px-3">
											<i
												className="btn fa-regular fa-trash-can fa-lg"
												style={{ color: "#ff0000" }}
												onClick={handleDeleteClick}
												title="Eliminar posteo"></i>
										</div>
									</>
								)}
								<div className="col-1 mx-3 px-3">
									<button
										type="button"
										className="btn-close"
										onClick={() =>
											props.onClose()
										}></button>
								</div>
							</div>
						</div>
						{isEditing && (
							<div className="modal-body">
								<div className="form-group mb-4">
									<div className="row align-items-start">
										<label className="col-auto form-label">
											Título
										</label>
									</div>
									<input
										className="form-control"
										type="text"
										value={editedTitle}
										onChange={(e) =>
											setEditedTitle(e.target.value)
										}
									/>
								</div>
								<div className="form-group mb-4">
									<div className="row align-items-start">
										<label className="col-auto form-label">
											Descripción
										</label>
									</div>
									<textarea
										rows="3"
										className="form-control"
										value={editedDescription}
										onChange={(e) =>
											setEditedDescription(e.target.value)
										}
									/>
								</div>
								<div className="form-group mb-4">
									<div className="row align-items-start">
										<label className="col-auto form-label">
											Imagen
										</label>
									</div>
									<input
										className="form-control"
										type="text"
										value={editedImage}
										onChange={(e) =>
											setEditedImage(e.target.value)
										}
									/>
								</div>
								<div
									className="card mt-3 bottom-0 start-50 translate-middle-x"
									style={{ width: "12rem" }}>
									<div className="card-header p-1">
										<p className="p-0 m-0 fw-bold">
											Vista Previa
										</p>
									</div>
									<div className="card-body p-0">
										{editedImage.length === 0 && (
											<img
												className="card-img-top p-5"
												src="noimage.png"
												alt="Imagen"
											/>
										)}
										{editedImage && (
											<img
												className="card-img-top"
												src={editedImage}
												alt="Imagen"
											/>
										)}
									</div>
								</div>
								<div className="modal-footer mt-4">
									<div className="d-grid gap-2 d-md-flex justify-content-md-end">
										<button
											type="button"
											className="btn btn-secondary"
											onClick={handleCancelEdit}>
											Cancelar
										</button>
										<button
											type="button"
											className="btn btn-primary"
											onClick={handleSaveClick}
											// DESHABILITA SI TITULO, DESCRIPCION O IMAGEN ESTAN VACIOS
											disabled={
												!editedDescription.trim() ||
												!editedImage.trim() ||
												!editedTitle.trim()
											}>
											Guardar
										</button>
									</div>
								</div>
							</div>
						)}
						{!isEditing && (
							<div className="modal-body">
								<img
									src={props.imagen}
									className="card-img-top card-img-modal-info mb-3"
									alt={props.titulo}
								/>
								<p className="mb-5 mt-2 text-start">
									{props.descripcion}
								</p>
								<CardModalInfoComments postId={props._id} />
							</div>
						)}
					</div>
				</div>
			</div>
			{/* Modal de confirmación para eliminar posteo*/}
			{modalDelete === true ? (
				<ModalDelete
					onConfirm={() => {
						handleDelete();
						setModalDelete(false);
					}}
					onCancel={() => setModalDelete(false)}
					tipoEliminacion={"posteo"}
				/>
			) : (
				""
			)}
			<Toaster />
		</>
	);
}

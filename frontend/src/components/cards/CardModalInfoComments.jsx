/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import ModalDelete from "./../delete/ModalConfirmDelete";
import CardModalAgregar from "./CardModalInfoCommentsAgregar";
import { Toaster } from "react-hot-toast";
import { ToastError, ToastOK } from "../toast/Toast";
import apiConnection from "../../../../backend/functions/apiConnection";

const CardModalInfoComments = ({ postId }) => {
	const [comentarios, setComentarios] = useState([]);
	const [editCommentId, setEditCommentId] = useState(null);
	const [deleteCommentId, setDeleteCommentId] = useState(null);

	// ESTADO DE MODAL PARA NUEVOS COMENTARIOS
	const [showAgregarModal, setShowAgregarModal] = useState(false);

	// FUNCION PARA MOSTRAR LOS COMENTARIOS
	const fetchData = async (
		postEndpoint,
		postDirection,
		postMethod,
		postBody
	) => {
		try {
			const endpoint = `http://127.0.0.1:5000/${postEndpoint}/`;
			const direction = postDirection;
			const method = postMethod;
			const body = postBody || false;
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
			return data;
		} catch (error) {
			console.error(
				`Error al intentar obtener datos de ${postEndpoint}: `,
				error
			);
			throw new Error(
				`Error al intentar obtener datos de ${postEndpoint}`
			);
		}
	};

	// FUNCION PARA OBTENER EL NOMBRE DEL USUARIO
	const fetchUserName = async (userId) => {
		try {
			const endpoint = "http://127.0.0.1:5000/users/";
			const direction = userId;
			const method = "GET";
			const body = false;
			const headers = {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			};

			const user = await apiConnection(
				endpoint,
				direction,
				method,
				body,
				headers
			);

			return `${user.nombre} ${user.apellido}`;
		} catch (error) {
			console.error("Error al obtener el nombre del usuario: ", error);
			throw new Error("Error al obtener el nombre del usuario");
		}
	};
	
	// FUNCION PARA BUSCAR EL NOMBRE DEL USUARIO EN LA BASE DE DATOS PARA CADA COMENTARIO
	const assignUserNameToComments = async (comments) => {
		return await Promise.all(
			comments.map(async (comentario) => {
				const userName = await fetchUserName(comentario.usuario);
				return {
					...comentario,
					userName,
				};
			})
		);
	};

	// BUSCA Y MUESTRA EL NOMBRE DEL USUARIO EN CADA COMENTARIO
	useEffect(() => {
		// CARGAMOS LOS COMENTARIOS AL CARGAR EL MODAL
		const fetchComentarios = async () => {
			try {
				const data = await fetchData("comments", postId, "GET");
				const comentariosConUsuario = await assignUserNameToComments(
					data.comentarios
				);
				setComentarios(comentariosConUsuario);
			} catch (error) {
				console.error("Error al intentar obtener comentarios: ", error);
				throw new Error("Error al intentar obtener comentarios");
			}
		};

		fetchComentarios();
	}, [postId]);

	
	// VERIFICAMOS SI EL COMENTARIO PERTENECE AL USUARIO LOGUEADO ACTUALMENTE
	const isCurrentUserComment = (userId) => {
		const currentUser = localStorage.getItem("user");
		const currentUserId = JSON.parse(currentUser).id;
		return currentUserId === userId;
	};

	// ------------------ Desde aca, todo para editar el comentario ------------------
	const handleEdit = (commentId) => {
		setEditCommentId(commentId);
	};

	const handleSaveEdit = async (editedContent, commentId) => {
		try {
			const endpoint = "http://127.0.0.1:5000/comments/";
			const direction = postId + "/" + commentId;
			const method = "PATCH";
			const body = { contenido: editedContent };
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

			// Actualiza lista de comentarios con nombre de usuariocon el contenido editado (funcion fetchData y assignUserNameToComments)
			try {
				const data = await fetchData("comments", postId, "GET");
				const comentariosConUsuario = await assignUserNameToComments(
					data.comentarios
				);
				setComentarios(comentariosConUsuario);
			} catch (error) {
				console.error(
					"Error al actualizar la lista de comentarios después de la edición: ",
					error
				);
			}

			// // const updatedData = await updatedResponse.json();
			// setComentarios(response.comentarios);

			// Oculta el formulario de edicion
			setEditCommentId(null);

			// Muestra notificacion
			ToastOK("Comentario", "modificado");
		} catch (error) {
			console.error(
				"Error al intentar guardar la edición del comentario: ",
				error
			);
		}
	};

	const handleEditContentChange = (commentId, e) => {
		const editedComentarios = comentarios.map((comentario) => {
			if (comentario._id === commentId) {
				return { ...comentario, contenido: e.target.value };
			}
			return comentario;
		});
		setComentarios(editedComentarios);
	};

	const handleCancelEdit = () => {
		setEditCommentId(null);
	};

	// ------------------ Desde aca, todo para eliminar el comentario ------------------
	const handleConfirmDelete = async () => {
		try {
			const endpoint = "http://127.0.0.1:5000/comments/";
			const direction = postId + "/" + deleteCommentId;
			const method = "DELETE";
			const body = false;
			const headers = {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			};

			await apiConnection(endpoint, direction, method, body, headers);

			// Actualiza lista de comentarios con nombre de usuariocon el contenido editado (funcion fetchData y assignUserNameToComments)
			try {
				const data = await fetchData("comments", postId, "GET");
				const comentariosConUsuario = await assignUserNameToComments(
					data.comentarios
				);
				setComentarios(comentariosConUsuario);
			} catch (error) {
				console.error(
					"Error al actualizar la lista de comentarios después de la edición: ",
					error
				);
			}

			// Ocultar modal de eliminacion
			handleHideDeleteModal();

			// Mostrar Toast
			ToastOK("Comentario", "eliminado");
		} catch (error) {
			console.error("Error al intentar eliminar el comentario: ", error);
		}
	};

	// Muestra el modal para confirmar la eliminacion del comentario
	const handleShowDeleteModal = (commentId) => {
		setDeleteCommentId(commentId);
	};

	// Ocultar el modal para confirmar la eliminacion del comentario
	const handleHideDeleteModal = () => {
		setDeleteCommentId(null);
	};

	// ------------------ Desde aca, todo para agregar un nuevo comentario ------------------
	// Abre modal para agregar comentario
	const handleShowAgregarModal = () => {
		setShowAgregarModal(true);
	};
	// Guardar nuevo comentario
	const handleSaveComment = async ({ usuario, comentario }) => {
		const user = localStorage.getItem("user");
		const userId = JSON.parse(user).id;
		try {
			const endpoint = "http://127.0.0.1:5000/comments/";
			const direction = postId;
			const method = "POST";
			const body = {
				usuario: userId,
				contenido: comentario,
			};
			let headers = {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			};

			await apiConnection(endpoint, direction, method, body, headers);

			// Actualiza lista de comentarios con nombre de usuariocon el contenido editado (funcion fetchData y assignUserNameToComments)
			try {
				const data = await fetchData("comments", postId, "GET");
				const comentariosConUsuario = await assignUserNameToComments(
					data.comentarios
				);
				setComentarios(comentariosConUsuario);
			} catch (error) {
				console.error(
					"Error al actualizar la lista de comentarios después de la edición: ",
					error
				);
			}

			// Ocultar modal agregar comentario
			setShowAgregarModal(false);

			// Mostrar Toast OK
			ToastOK("Comentario", "guardado");
		} catch (error) {
			console.error("Error al intentar guardar el comentario: ", error);

			// Mostrar Toast ERROR
			ToastError("comentario", "guardar");
		}
	};

	return (
		<>
			<div className="my-0">
				<div className="row justify-content-between">
					<div className="col">
						{/* MUESTRA EL BADGE COMENTARIOS SI HAY ALGUN COMENTARIO */}
						{comentarios.length > 0 && (
							<h4 className="card-title text-start">
								<span className="badge bg-secondary position-relative">
									Comentarios
									<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
										{comentarios.length}
									</span>
								</span>
							</h4>
						)}
					</div>
					{/* BOTON PARA AGREGAR COMENTARIOS */}
					<div className="col-2 align-items-end justify-content-end">
						<button
							className="btn btn-sm btn-success position-relative align-self-end"
							type="button"
							name="agregarComentario"
							onClick={handleShowAgregarModal}
							title="Nuevo comentario">
							<i className="fa-solid fa-comment-dots"></i>
						</button>
					</div>
				</div>
			</div>

			{comentarios.map((comentario) => {
				const currentUserComment = isCurrentUserComment(
						comentario.usuario
					);

				return (
					<div
						className="card border border-primary mb-4"
						key={comentario._id}>
						{/* SI HAY ID DE COMENTARIO, MUESTRA LOS INPUTS PARA MODIFICAR EL COMENTARIO */}
						{editCommentId === comentario._id ? (
							<div className="card-body">
								<textarea
									rows="3"
									value={comentario.contenido}
									className="form-control mb-2"
									onChange={(e) =>
										handleEditContentChange(
											comentario._id,
											e
										)
									}></textarea>
								<button
									className="btn btn-sm btn-success me-2"
									onClick={() =>
										handleSaveEdit(
											comentario.contenido,
											comentario._id
										)
									}
									/* SI EL COMENTARIO ESTA VACIO NO SE PUEDE GUARDAR */
									disabled={!comentario.contenido.trim()} // Deshabilitar si el contenido está vacío
								>
									Guardar
								</button>
								<button
									className="btn btn-sm btn-secondary"
									onClick={handleCancelEdit}>
									Cancelar
								</button>
							</div>
						) : (
							/* SI NO HAY ID DE COMENTARIO SELECCIONADO, MUESTRA LOS COMENTARIOS DEL POSTEO */
							<>
								<div>
									<div className="card-header text-start ps-1">
										<b className="text-success">
											{comentario.userName}
										</b>{" "}
										comentó:
									</div>
									<div className="card-body text-start p-2 fs-6 fst-italic">
										{comentario.contenido}
									</div>
									<div className="card-footer p-1">
										<div className="row justify-content-between">
											<div className="col align-items-start">
												<p className="text-muted text-start align-items-start">
													Publicado el{" "}
													{comentario.fecha &&
														comentario.fecha.substr(
															8,
															2
														) +
															"/" +
															comentario.fecha.substr(
																5,
																2
															) +
															"/" +
															comentario.fecha.substr(
																0,
																4
															)}
												</p>
											</div>
											<div className="col-4 align-items-end justify-content-end me-0">
												<button
													className="btn btn-sm btn-warning me-2"
													onClick={() =>
														handleEdit(
															comentario._id
														)
													}
													title="Editar comentario"
													// SI EL COMENTARIO NO ES DEL USUARIO LOGUEADO, OCULTA EL BOTON
													hidden={
														!currentUserComment
													}>
													<i className="fa-solid fa-regular fa-edit"></i>
												</button>
												<button
													className="btn btn-sm btn-danger"
													onClick={() =>
														handleShowDeleteModal(
															comentario._id
														)
													}
													title="Eliminar comentario"
													// SI EL COMENTARIO NO ES DEL USUARIO LOGUEADO, OCULTA EL BOTON
													hidden={
														!currentUserComment
													}>
													<i className="fa-regular fa-trash-can"></i>
												</button>
											</div>
										</div>
									</div>
								</div>
							</>
						)}
					</div>
				);
			})
			}
			{deleteCommentId && (
				<ModalDelete
					onCancel={handleHideDeleteModal}
					onConfirm={handleConfirmDelete}
					tipoEliminacion="comentario"
				/>
			)}
			{showAgregarModal && (
				<CardModalAgregar
					onSave={handleSaveComment}
					onCancel={() => setShowAgregarModal(false)}
				/>
			)}
			<Toaster />
		</>
	);
};

export default CardModalInfoComments;

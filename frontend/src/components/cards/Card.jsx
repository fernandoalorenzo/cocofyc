/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import ModalInfo from "./CardModalInfo";
import apiConnection from "../../../../backend/functions/apiConnection";

const Card = ({
	titulo,
	imagen,
	descripcion,
	_id,
	fetchData,
	usuario,
	nombre,
	apellido,
	publicado,
}) => {
	const [modalInfo, setModalInfo] = useState(false);

	const [userData, setUserData] = useState(null);

	const maxDescriptionLength = 55 // Longitud maxima de la descripción

	const maxFullNameLength = 15; // Longitud maxima del nombre a mostrar

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const endpoint = "http://127.0.0.1:5000/users/";
				const direction = usuario;
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
				
				setUserData(userData);
			} catch (error) {
				console.error(
					"Error al intentar obtener datos del usuario: ",
					error
				);
			}
		};

		if (usuario) {
			fetchUserData();
		}
	}, [usuario]);


	let displayName = "";
	if (userData) {
		const name = `${userData.nombre}`;
		displayName = name.length > maxFullNameLength ? `${name.slice(0, maxFullNameLength)}` : name;
	}

	return (
		<>
			<div className="card card-border mx-3">
				<div className="card-header">
					<div className="row">
						<div className="col-12">
							{displayName ? (
								<>
									<h5
										className="text-nowrap bd-highlight text-start py-0 my-0"
										style={{ fontStyle: "italic" }}>
										{displayName}{" "}
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
								</>
							) : (
								<br />
							)}
						</div>
					</div>
					<div className="row">
						<div className="col-9">
							<h6 className="card-title text-start text-nowrap">
								{titulo}
							</h6>
						</div>
						<div className="col-1">

						</div>
						<div className="col-2">
							<i
								className="btn fa-solid fa-circle-info fa-fade fa-xl"
								style={{ color: "#1100ff" }}
								onClick={() => setModalInfo(true)}></i>
						</div>
					</div>
				</div>
				<img
					src={imagen}
					className="card-img img-responsive p-2 border-0"
					alt={titulo}
				/>
				<div className="card-body">
					{descripcion.length > maxDescriptionLength ? (
						<p className="card-text text-start text-break word-break: break-word word-wrap: break-word text-wrap">
							{descripcion.slice(0, maxDescriptionLength) + "..."}
						</p>
					) : (
						<p className="card-text text-start">{descripcion}</p>
					)}
				</div>
				<div className="card-footer m-0 p-0 px-2">
					<div className="row">
						<div className="col-12">
							<p className="text-muted text-start align-items-start m-0 p-0">
								Publicado el{" "}
								{publicado &&
									publicado.substr(8, 2) +
										"/" +
										publicado.substr(5, 2) +
										"/" +
										publicado.substr(0, 4)}
							</p>
						</div>
					</div>
				</div>
			</div>
			{modalInfo === true ? (
				<ModalInfo
					_id={_id}
					titulo={titulo}
					descripcion={descripcion}
					imagen={imagen}
					usuario={usuario}
					nombre={nombre}
					apellido={apellido}
					onClose={() => setModalInfo(false)}
					fetchData={fetchData}
				/>
			) : (
				""
			)}
		</>
	);
};

export default Card;

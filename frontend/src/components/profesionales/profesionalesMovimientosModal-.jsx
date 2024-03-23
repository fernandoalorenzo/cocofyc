import React, { useState, useEffect, useMemo } from "react";
import apiConnection from "../../../../backend/functions/apiConnection";

const MovimientosModal = ({ showModal, closeModal, data }) => {
	const [movimientos, setMovimientos] = useState([]);
	const [selectedMovimiento, setSelectedMovimiento] = useState("");
	
	const fetchMovimientos = async () => {
		try {
			const endpoint = "http://localhost:5000/api/movimientos/";
			const direction = "";
			const method = "GET";
			const body = false;
			const headers = {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			};

			const response = await apiConnection(
				endpoint,
				direction,
				method,
				body,
				headers
			);


			if (response && response.data) {
				// Ordenar los movimientos alfabéticamente por nombre antes de establecer el estado
				const sortedMovimientos = response.data.sort((a, b) =>
					a.movimiento.localeCompare(b.movimiento)
				);
				setMovimientos(sortedMovimientos);
			} else {
				console.error(
					"Error fetching movimientos: ",
					response.statusText
				);
			}
		} catch (error) {
			console.error("Error fetching movimientos: ", error);
		}
	};

	// useEffect(() => {
	// 	if (data) {
	// 		fetchMovimientos();
	// 	}
	// }, [data]);

	const handleMovimientoChange = (e) => {
		setSelectedMovimiento(e.target.value);
	};

return (
	<div
		className={`modal fade ${showModal ? "show" : ""}`}
		tabIndex="-1"
		style={{ display: showModal ? "block" : "none" }}
		id="staticBackdrop"
		data-bs-target="#staticBackdrop"
		data-bs-backdrop="static"
		data-bs-keyboard="false"
		aria-labelledby="staticBackdropLabel"
		aria-hidden={!showModal}>
		<div className="modal-dialog modal-dialog-centered modal-xl">
			<div className="modal-content">
				<div className="modal-header">
					<h5 className="modal-title" id="exampleModalLabel">
						Modal title
					</h5>
					<button
						type="button"
						className="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div className="modal-body">
					<ul className="nav nav-tabs" id="myTab" role="tablist">
						<li className="nav-item" role="presentation">
							<button
								className="nav-link active"
								id="home-tab"
								data-bs-toggle="tab"
								data-bs-target="#home"
								type="button"
								role="tab"
								aria-controls="home"
								aria-selected="true">
								Home
							</button>
						</li>
						<li className="nav-item" role="presentation">
							<button
								className="nav-link"
								id="profile-tab"
								data-bs-toggle="tab"
								data-bs-target="#profile"
								type="button"
								role="tab"
								aria-controls="profile"
								aria-selected="false">
								Profile
							</button>
						</li>
						<li className="nav-item" role="presentation">
							<button
								className="nav-link"
								id="contact-tab"
								data-bs-toggle="tab"
								data-bs-target="#contact"
								type="button"
								role="tab"
								aria-controls="contact"
								aria-selected="false">
								Contact
							</button>
						</li>
					</ul>
					<div className="tab-content" id="myTabContent">
						<div
							className="tab-pane fade show active"
							id="home"
							role="tabpanel"
							aria-labelledby="home-tab">
							<p>Home tab content</p>
						</div>
						<div
							className="tab-pane fade"
							id="profile"
							role="tabpanel"
							aria-labelledby="profile-tab">
							<p>Profile tab content</p>
						</div>
						<div
							className="tab-pane fade"
							id="contact"
							role="tabpanel"
							aria-labelledby="contact-tab">
							<p>Contact tab content</p>
						</div>
					</div>
				</div>
				<div className="modal-footer">
					<button
						type="button"
						className="btn btn-secondary"
						data-bs-dismiss="modal">
						Close
					</button>
					<button type="button" className="btn btn-primary">
						Save changes
					</button>
				</div>
			</div>
		</div>
	</div>
);
};

export default MovimientosModal;

import React, { useState, useEffect } from "react";
import apiConnection from "../../../../backend/functions/apiConnection";

const MatriculasActivas = ( { API_ENDPOINT }) => {
	const [totalMatriculasActivas, setTotalMatriculasActivas] = useState(0);

	useEffect(() => {
		const fetchMatriculasActivas = async () => {
			try {
				const endpoint = `${API_ENDPOINT}/profesionales/profesionales-morosos`;
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

				// Filtrar los profesionales cuya propiedad 'activo' sea true
				const matriculasActivas = response.data.filter(
					(profesional) => profesional.activo
				);
				setTotalMatriculasActivas(matriculasActivas.length);
			} catch (error) {
				console.error("Error:", error.message);
			}
		};

		fetchMatriculasActivas();
	}, []);

	return (
		<>
			<div>{totalMatriculasActivas}</div>{" "}
		</>
	);
};

export default MatriculasActivas;

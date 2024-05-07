import React, { useState, useEffect } from "react";
import apiConnection from "./../../../../backend/functions/apiConnection";

const TotalMorosos = () => {
	const [totalProfesionalesMorosos, setTotalProfesionalesMorosos] =
		useState(0);

	useEffect(() => {
		const fetchProfesionalesMorosos = async () => {
			try {
				const endpoint =
					"http://localhost:5000/api/profesionales/profesionales-morosos";
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

				setTotalProfesionalesMorosos(response.data.length);
			} catch (error) {
				console.error("Error:", error.message);
			}
		};

		fetchProfesionalesMorosos();
	}, []);

	return (
		<>
			<div>
				{totalProfesionalesMorosos}
			</div>{" "}
		</>
	);
};

export default TotalMorosos;

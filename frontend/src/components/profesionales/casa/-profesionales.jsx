import React, { useState, useEffect } from "react";
import ProfesionalesTabla from "./profesionalesTabla.jsx";

const Profesionales = () => {
	const [profesionales, setProfesionales] = useState([]);

	useEffect(() => {
		const fetchProfesionales = async () => {
			try {
				const response = await fetch(
					"http://localhost:5000/profesionales"
				);
				if (!response.ok) {
					throw new Error("Error al obtener los datos");
				}
				const data = await response.json();
				setProfesionales(data.data);
			} catch (error) {
				console.error("Error:", error.message);
			}
		};

		fetchProfesionales();
	}, []);

	return (
		<div>
			<ProfesionalesTabla profesionales={profesionales} />
		</div>
	);
};

export default Profesionales;

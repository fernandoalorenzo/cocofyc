import React, { useState, useEffect } from "react";

function EstadoSelect() {
	const [estados, setEstados] = useState([]);
	const [selectedEstado, setSelectedEstado] = useState("");

	useEffect(() => {
		// Función para obtener los estados desde la API
		async function fetchEstados() {
			try {
				const response = await fetch(
					"http://127.0.0.1:5000/api/estados"
				);
				const responseData = await response.json();
				console.log("Datos recibidos de la API:", responseData);
				// Accede al arreglo de estados dentro de responseData.data
				setEstados(responseData.data || []);
			} catch (error) {
				console.error("Error fetching estados:", error);
			}
		}

		fetchEstados();
	}, []);

	const handleChange = (event) => {
		setSelectedEstado(event.target.value);
	};

	return (
		<div className="content-wrapper">
			<div>
				<h2>Selecciona un estado:</h2>
				<select value={selectedEstado} onChange={handleChange}>
					<option value="">Selecciona un estado</option>
					{estados.map((estado) => (
						<option key={estado.id} value={estado.id}>
							{estado.estado}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}

export default EstadoSelect;

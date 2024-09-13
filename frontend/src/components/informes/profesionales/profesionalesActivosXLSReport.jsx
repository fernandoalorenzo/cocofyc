import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import apiConnection from "../../../../../backend/functions/apiConnection";

const ProfesionalesActivosXLSReport = ({
	title,
	nombreInforme,
	API_ENDPOINT,
}) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProfesionalesActivos = async () => {
			setLoading(true);
			try {
				const endpoint = `${API_ENDPOINT}/profesionales`;
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

				// Filtrar solo los profesionales activos
				const profesionalesActivos = response.data.filter(
					(profesional) => profesional.activo
				);

				const sortedData = profesionalesActivos.sort((a, b) => {
					if (a.nombre < b.nombre) return -1;
					if (a.nombre > b.nombre) return 1;
					return 0;
				});

				setData(sortedData);
			} catch (error) {
				console.error("Error:", error.message);
			} finally {
				setLoading(false); // Oculta el spinner después de cargar los datos
			}
		};

		fetchProfesionalesActivos();
	}, []);

	// Función para generar el archivo Excel
	const generateExcel = () => {
		// Crea un nuevo workbook
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(`${nombreInforme}`);

		// Encabezados del Excel
		worksheet.columns = [
			{ header: "Nombre", key: "nombre", width: 35 },
			{ header: "DNI", key: "dni", width: 15 },
			{ header: "CUIT", key: "cuit", width: 20 },
			{ header: "Teléfono", key: "telefono", width: 15 },
			{ header: "Email", key: "email", width: 40 },
			{ header: "Matrícula", key: "matricula", width: 15 },
			{ header: "Domicilio", key: "domicilio", width: 25 },
			{ header: "Localidad", key: "localidad", width: 20 },
			{ header: "Estado", key: "activo_estado", width: 10 },
		];

		// Estilos para la primera fila (encabezados)
		worksheet.getRow(1).font = {
			name: "Calibri",
			color: { argb: "FFFFFFF" },
			family: 2,
			size: 11,
			bold: true,
		};
		worksheet.getRow(1).fill = {
			type: "pattern",
			pattern: "solid",
			fgColor: { argb: "FF000000" }, // Negro
		};
		worksheet.getRow(1).alignment = {
			vertical: "middle",
			horizontal: "center",
		};

		worksheet.autoFilter = "A1:I1";
		worksheet.views = [{ state: "frozen", ySplit: 1, xSplit: 0 }];

		// Agregar la data al Excel
		data.forEach((profesional) => {
			worksheet.addRow({
				nombre: profesional.nombre,
				dni: profesional.dni,
				cuit: profesional.cuit,
				telefono: profesional.telefono,
				email: profesional.email,
				matricula: profesional.matricula,
				domicilio: profesional.domicilio,
				localidad: profesional.localidad,
				activo_estado: profesional.activo_estado,
			});
		});

		// Generar archivo Excel y guardarlo
		workbook.xlsx.writeBuffer().then((buffer) => {
			const blob = new Blob([buffer], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			saveAs(blob, `${nombreInforme}.xlsx`);
		});
	};

	return (
		<div>
			<h5>{title}</h5>
			{loading ? (
				<div className="d-flex justify-content-center">
					<div className="spinner-border" role="status">
						<span className="visually-hidden">Cargando...</span>
					</div>
				</div>
			) : (
				<button className="btn btn-success" onClick={generateExcel}>
					<i className="fas fa-file-excel fa-xl me-2"></i> Descargar
					archivo de {title}...
				</button>
			)}
		</div>
	);
};

export default ProfesionalesActivosXLSReport;
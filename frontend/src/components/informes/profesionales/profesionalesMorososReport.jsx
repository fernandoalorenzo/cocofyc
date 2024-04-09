import React, { useState, useEffect } from "react";
import {
	Document,
	Page,
	View,
	Text,
	StyleSheet,
	Image,
	Font,
} from "@react-pdf/renderer";
import check from "./../../../assets/img/check.png";
import apiConnection from "../../../../../backend/functions/apiConnection";
import Header from "./../header";
import Footer from "./../footer";
import { globalStyles } from "./../styles";

Font.register({
	family: "Oswald",
	src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

const ProfesionalesMorososReport = ({ nombreInforme }) => {
	const [data, setData] = useState([]);
	let totalProfesionales = 0; // Inicializar contador de profesionales
	
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

				const sortedData = [...response.data].sort((a, b) => {
					// Comparar los nombres de los profesionales (columna 0)
					if (a.nombre < b.nombre) return -1;
					if (a.nombre > b.nombre) return 1;
					return 0;
				});

				setData(sortedData);
			} catch (error) {
				console.error("Error:", error.message);
			}
		};

		fetchProfesionalesMorosos();
	}, []);

	// Función para agrupar los datos por profesional y mostrar detalles de cuotas adeudadas
	const renderProfesionalesMorosos = () => {
		const profesionales = {};

		// Agrupar datos por profesional
		data.forEach((profesional) => {
			const { nombre, dni, cuit, telefono, email, matricula, activo } =
				profesional;

			if (!profesionales[nombre]) {
				profesionales[nombre] = {
					dni,
					cuit,
					telefono,
					email,
					matricula,
					activo,
					cuotas: [],
					cantidadCuotasAdeudadas: 0, // Inicializar contador de cuotas adeudadas
				};
				totalProfesionales++; // Incrementar contador de profesionales
			}

			profesionales[nombre].cuotas.push({
				cuota: profesional.cuota,
				vencimiento: profesional.vencimiento,
				importe: profesional.importe,
			});
			// Incrementar el contador de cuotas adeudadas para este profesional
			profesionales[nombre].cantidadCuotasAdeudadas++;
		});

		// Ordenar las cuotas adeudadas por vencimiento
		Object.keys(profesionales).forEach((nombreProfesional) => {
			profesionales[nombreProfesional].cuotas.sort((a, b) => {
				// Parsear las fechas de vencimiento
				const fechaA = new Date(a.vencimiento);
				const fechaB = new Date(b.vencimiento);
				return fechaA - fechaB;
			});
		});

		// Renderizar los datos
		return Object.keys(profesionales).map((nombreProfesional, index) => {
			const {
				telefono,
				email,
				matricula,
				activo,
				cuotas,
				cantidadCuotasAdeudadas,
			} = profesionales[nombreProfesional];

			return (
				<View key={index} style={globalStyles.tableRow}>
					<Text
						style={[globalStyles.tableCell, { textAlign: "left" }]}>
						{nombreProfesional}
					</Text>
					<Text
						style={[
							globalStyles.tableCell,
							{ textAlign: "center" },
						]}>
						{telefono}
					</Text>
					<Text
						style={[globalStyles.tableCell, { textAlign: "left" }]}>
						{email}
					</Text>
					<Text
						style={[
							globalStyles.tableCell,
							{ textAlign: "center" },
						]}>
						{matricula}
					</Text>
					<Text
						style={[
							globalStyles.tableCell,
							{ textAlign: "center" },
						]}>
						{activo ? (
							<Image source={check} style={globalStyles.activo} />
						) : (
							""
						)}
					</Text>
					<Text
						style={[
							globalStyles.tableCell,
							{ textAlign: "center" },
						]}>
						{cantidadCuotasAdeudadas}
					</Text>
					<View
						style={[
							globalStyles.tableCellCuotaTitulo,
							{ backgroundColor: "#EFEFEF" },
						]}>
						{cuotas.map((cuota, index) => (
							<View
								key={index}
								style={[globalStyles.tableRow, { border: 0 }]}>
								<Text
									style={[
										globalStyles.tableCell,
										{ textAlign: "center" },
									]}>
									{cuota.cuota}
								</Text>
								<Text
									style={[
										globalStyles.tableCell,
										{ textAlign: "center" },
									]}>
									{cuota.vencimiento}
								</Text>
								<Text
									style={[
										globalStyles.tableCell,
										{ textAlign: "center" },
									]}>
									{Number(cuota.importe).toLocaleString(
										"es-AR",
										{
											style: "currency",
											currency: "ARS",
										}
									)}
								</Text>
							</View>
						))}
					</View>
				</View>
			);
		});
	};

	return (
		<>
			<Document author="CoCoFyC" title={nombreInforme}>
				<Page
					size="A4"
					orientation="landscape"
					style={globalStyles.page}>
					<Header title={nombreInforme} />
					<View
						style={[
							globalStyles.tableRow,
							{
								height: "18px",
								paddingTop: "1px",
								paddingBottom: "1px",
								fontWeight: "bold",
								backgroundColor: "#000000",
								color: "#ffffff",
							},
						]}>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "left" },
							]}>
							Profesional
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "center" },
							]}>
							Teléfono
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "left" },
							]}>
							E-Mail
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "center" },
							]}>
							Matrícula
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "center" },
							]}>
							Activo
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "center" },
							]}>
							Cant. Cuotas
						</Text>

						<Text
							style={[
								globalStyles.tableCellCuotaTitulo,
								{ textAlign: "center" },
							]}>
							Cuotas Pendientes
						</Text>
					</View>
					{renderProfesionalesMorosos()}
					<View style={globalStyles.footer}>
						<Text>Total de registros: {totalProfesionales}</Text>
						<Text
							style={globalStyles.pageNumber}
							render={({ pageNumber, totalPages }) =>
								`Pág. ${pageNumber} de ${totalPages}`
							}
							fixed
						/>
					</View>
				</Page>
			</Document>
		</>
	);
};

export default ProfesionalesMorososReport;

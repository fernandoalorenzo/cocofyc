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
import Header from "../header";
import Footer from "../footer";
import { globalStyles } from "../styles";

Font.register({
	family: "Oswald",
	src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

const ProfesionalesAlDiaReport = ({ nombreInforme }) => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchProfesionalesAlDia = async () => {
			try {
				const endpoint =
					"http://localhost:5000/api/profesionales/profesionales-aldia";
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

		fetchProfesionalesAlDia();
	}, []);

	// // Función para agrupar los datos por profesional y mostrar detalles de cuotas
	const renderProfesionalesAlDia = () => {
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
				};
			}

		});

		// Renderizar los datos
		return Object.keys(profesionales).map((nombreProfesional, index) => {
			const { telefono, email, matricula, activo } =
				profesionales[nombreProfesional];

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
					{/* <View
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
					</View> */}
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
					</View>
					{renderProfesionalesAlDia()}
					<Footer data={data} />
				</Page>
			</Document>
		</>
	);
};

export default ProfesionalesAlDiaReport;

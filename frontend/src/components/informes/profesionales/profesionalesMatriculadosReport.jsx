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
import apiConnection from "../../../../../backend/functions/apiConnection";
import Header from "./../header";
import Footer from "./../footer";
import { globalStyles } from "./../stylesReports";

Font.register({
	family: "Oswald",
	src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

const ProfesionalesMatriculadosReport = ({
	title,
	nombreInforme,
	API_ENDPOINT,
}) => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchProfesionalesMatriculados = async () => {
			try {
				const endpoint = `${API_ENDPOINT}/profesionales/`;
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

				// Filtrar solo los profesionales Matriculados
				const profesionalesMatriculados = response.data.filter(
					(profesional) => profesional.matricula !== ""
				);

				// Ordenar los profesionales matriculados alfabéticamente por nombre
				const sortedData = profesionalesMatriculados.sort((a, b) => {
					if (a.nombre < b.nombre) return -1;
					if (a.nombre > b.nombre) return 1;
					return 0;
				});

				setData(sortedData);
			} catch (error) {
				console.error("Error:", error.message);
			}
		};

		fetchProfesionalesMatriculados();
	}, []);

	return (
		<>
			<Document author="CoCoFyC" title={nombreInforme}>
				<Page
					size="A4"
					orientation="landscape"
					style={globalStyles.page}>
					{/* Encabezado */}
					<Header title={title} />
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
							Nombre
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "center" },
							]}>
							DNI
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "center" },
							]}>
							CUIT
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
							Email
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
								{ textAlign: "left" },
							]}>
							Domicilio
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "left" },
							]}>
							Localidad
						</Text>
					</View>
					{data.map((profesional) => (
						<View
							style={globalStyles.tableRow}
							key={profesional.id}>
							<Text
								style={[
									globalStyles.tableCell,
									{ textAlign: "left" },
								]}>
								{profesional.nombre}
							</Text>
							<Text
								style={[
									globalStyles.tableCell,
									{ textAlign: "center" },
								]}>
								{profesional.dni}
							</Text>
							<Text
								style={[
									globalStyles.tableCell,
									{ textAlign: "center" },
								]}>
								{profesional.cuit}
							</Text>
							<Text
								style={[
									globalStyles.tableCell,
									{ textAlign: "center" },
								]}>
								{profesional.telefono}
							</Text>
							<Text
								style={[
									globalStyles.tableCell,
									{ textAlign: "left" },
								]}>
								{profesional.email}
							</Text>
							<Text
								style={[
									globalStyles.tableCell,
									{ textAlign: "center" },
								]}>
								{profesional.matricula}
							</Text>
							<Text
								style={[
									globalStyles.tableCell,
									{ textAlign: "left" },
								]}>
								{profesional.domicilio}
							</Text>
							<Text
								style={[
									globalStyles.tableCell,
									{ textAlign: "left" },
								]}>
								{profesional.localidad}
							</Text>
						</View>
					))}
					<Footer data={data} />
				</Page>
			</Document>
		</>
	);
};

export default ProfesionalesMatriculadosReport;

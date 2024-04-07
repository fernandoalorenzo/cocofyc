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
import logo from "./../../assets/img/LogoCOCOFYC_horizontal.png";
import apiConnection from "../../../../backend/functions/apiConnection";

//embad fonts
Font.register({
	family: "Oswald",
	src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		padding: 20,
		fontSize: 9,
	},
	text: {
		fontSize: 9,
		textAlign: "justify",
		fontFamily: "Oswald",
	},
	section: {
		marginBottom: 10,
	},
	header: {
		textAlign: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
		padding: 10,
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
		fontSize: "12px",
	},
	headerRight: {
		flexDirection: "row",
		alignItems: "center",
		fontSize: 11,
		fontSize: "12px",
	},
	logo: {
		height: 50,
		marginRight: 20,
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#AEAEAE",
		alignItems: "center",
		padding: 5,
		fontFamily: "Oswald",
	},
	tableCell: {
		flex: 1,
	},
	footer: {
		borderTopWidth: 1,
		borderTopColor: "#AEAEAE",
		paddingTop: 5,
		position: "absolute",
		bottom: 10,
		left: 10,
		right: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		fontSize: 9,
	},
});

const ProfesionalesMorososReport = ({ nombreInforme }) => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchProfesionalesMorosos = async () => {
			try {
				const endpoint = "http://localhost:5000/api/profesionales/profesionales-morosos";
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
				const profesionalesMorosos = response.data.filter(
					(profesional) => profesional.activo
				);

				setData(profesionalesMorosos);
			} catch (error) {
				console.error("Error:", error.message);
			}
		};

		fetchProfesionalesMorosos();
	}, []);

	return (
		<>
			<Document author="CoCoFyC" title={nombreInforme}>
			<Page size="A4" orientation="landscape" style={styles.page}>
				{/* Encabezado */}
				<View style={styles.header}>
					{/* Lado izquierdo del encabezado con el logo */}
					<View style={styles.headerLeft}>
						<Image source={logo} style={styles.logo} />
						<Text style={styles.title}>{nombreInforme}</Text>
					</View>
					{/* Lado derecho del encabezado con la fecha de emisión */}
					<View style={[styles.headerRight, { fontSize: "9px" }]}>
						<Text>
							Fecha de emisión: {new Date().toLocaleDateString()}
						</Text>
					</View>
				</View>
				<View
					style={[
						styles.tableRow,
						{
							height: "18px",
							paddingTop: "1px",
							paddingBottom: "1px",
							fontWeight: "bold",
							backgroundColor: "#000000",
							color: "#ffffff",
						},
					]}>
					<Text style={[styles.tableCell, { textAlign: "left" }]}>
						Nombre
					</Text>
					<Text style={[styles.tableCell, { textAlign: "center" }]}>
						DNI
					</Text>
					<Text style={[styles.tableCell, { textAlign: "center" }]}>
						CUIT
					</Text>
					<Text style={[styles.tableCell, { textAlign: "center" }]}>
						Teléfono
					</Text>
					<Text style={[styles.tableCell, { textAlign: "left" }]}>
						Email
					</Text>
					<Text style={[styles.tableCell, { textAlign: "center" }]}>
						Matrícula
					</Text>
					<Text style={[styles.tableCell, { textAlign: "left" }]}>
						Domicilio
					</Text>
					<Text style={[styles.tableCell, { textAlign: "left" }]}>
						Localidad
					</Text>
				</View>
				{data.map((profesional) => (
					<View style={styles.tableRow} key={profesional.id}>
						<Text style={[styles.tableCell, { textAlign: "left" }]}>
							{profesional.nombre}
						</Text>
						<Text
							style={[styles.tableCell, { textAlign: "center" }]}>
							{profesional.dni}
						</Text>
						<Text
							style={[styles.tableCell, { textAlign: "center" }]}>
							{profesional.cuit}
						</Text>
						<Text
							style={[styles.tableCell, { textAlign: "center" }]}>
							{profesional.telefono}
						</Text>
						<Text style={[styles.tableCell, { textAlign: "left" }]}>
							{profesional.email}
						</Text>
						<Text
							style={[styles.tableCell, { textAlign: "center" }]}>
							{profesional.matricula}
						</Text>
						<Text style={[styles.tableCell, { textAlign: "left" }]}>
							{profesional.domicilio}
						</Text>
						<Text style={[styles.tableCell, { textAlign: "left" }]}>
							{profesional.localidad}
						</Text>
					</View>
				))}
				<View style={styles.footer}>
					<Text>Total de registros: {data.length}</Text>
					<Text
						style={styles.pageNumber}
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

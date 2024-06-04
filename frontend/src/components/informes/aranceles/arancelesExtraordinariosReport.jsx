import React, { useState, useEffect } from "react";
import {
	Document,
	Page,
	View,
	Text,
	Font,
} from "@react-pdf/renderer";
import apiConnection from "../../../../../backend/functions/apiConnection";
import Header from "../header";
import Footer from "../footer";
import { globalStyles } from "../stylesReports";

Font.register({
	family: "Oswald",
	src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

const ArancelesExtraordinariosReport = ({
	title,
	subtitle,
	nombreInforme,
	refreshKey,
	selectedArancel,
	API_ENDPOINT,
}) => {
	const [data, setData] = useState([]);
	const [profesionales, setProfesionales] = useState([]);
	const [mediosPago, setMediosPago] = useState([]);

	const totalImporte = data
		.reduce((sum, item) => sum + parseFloat(item.importe), 0)
		.toFixed(2);

	useEffect(() => {
		fetchProfesionales();
		fetchMovimientos();
		fetchMediosPago();
	}, [selectedArancel]);

	const fetchProfesionales = async () => {
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
				"",
				method,
				false,
				headers
			);

			const sortedData = response.data.sort((a, b) =>
				a.nombre.localeCompare(b.nombre)
			);
			setProfesionales(sortedData);
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	const fetchMovimientos = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/movimientos/arancel/`;
			const direction = `${selectedArancel}`;
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
			setData(response.data);
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	const fetchMediosPago = async () => {
		try {
			const endpoint = `${API_ENDPOINT}/mediosdepago`;
			const method = "GET";
			const headers = {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			};

			const response = await apiConnection(
				endpoint,
				"",
				method,
				false,
				headers
			);
			setMediosPago(response.data);
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	const getMedioPago = (id) => {
		const medio = mediosPago.find((medio) => medio.id === id);
		return medio ? medio.medio : "";
	};

	// Función para formatear la fecha de "aaaa-mm-dd" a "dd-mm-aaaa"
	const formatDate = (dateString) => {
		const [year, month, day] = dateString.split("-");
		return `${day}-${month}-${year}`;
	};

	return (
		<>
			<Document author="CoCoFyC" title={nombreInforme}>
				<Page
					size="A4"
					orientation="portrait"
					style={globalStyles.page}>
					{/* Encabezado */}
					<Header title={title} subtitle={subtitle} />
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
							Fecha de Pago
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "center" },
							]}>
							Medio de Pago
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "right" },
							]}>
							Importe
						</Text>
					</View>
					{data
						.sort((a, b) => {
							const profA = profesionales.find(
								(p) => p.id === a.profesional_id
							);
							const profB = profesionales.find(
								(p) => p.id === b.profesional_id
							);
							return profA.nombre.localeCompare(profB.nombre);
						})
						.map((data) => {
							const profesional = profesionales.find(
								(p) => p.id === data.profesional_id
							);
							return (
								<View
									style={globalStyles.tableRow}
									key={data.id}>
									<Text
										style={[
											globalStyles.tableCell,
											{ textAlign: "left" },
										]}>
										{profesional ? profesional.nombre : ""}
									</Text>
									<Text
										style={[
											globalStyles.tableCell,
											{ textAlign: "center" },
										]}>
										{formatDate(data.fecha)}
									</Text>
									<Text
										style={[
											globalStyles.tableCell,
											{ textAlign: "center" },
										]}>
										{getMedioPago(data.medio_id)}
									</Text>
									<Text
										style={[
											globalStyles.tableCell,
											{ textAlign: "right" },
										]}>
										{new Intl.NumberFormat("es-AR", {
											style: "currency",
											currency: "ARS",
										}).format(data.importe)}
										{/* {data.importe} */}
									</Text>
								</View>
							);
						})}
					{/* Fila de totalización */}
					<View style={[globalStyles.tableRow, { fontWeight: "bold", backgroundColor: "#dddddd" }]}>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "left", fontWeight: "bold" },
							]}>
							Total
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "center" },
							]}>
							{/* Celda vacía */}
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "center" },
							]}>
							{/* Celda vacía */}
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{
									textAlign: "right",
									maxWidth: "15%",
								},
							]}>
							{new Intl.NumberFormat("es-AR", {
								style: "currency",
								currency: "ARS",
							}).format(totalImporte)}
						</Text>
					</View>
					<Footer data={data} />
				</Page>
			</Document>
		</>
	);
};

export default ArancelesExtraordinariosReport;

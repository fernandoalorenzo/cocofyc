import React, { useState, useEffect } from "react";
import { Document, Page, View, Text, Font } from "@react-pdf/renderer";
import moment from "moment";
import apiConnection from "../../../../../backend/functions/apiConnection";
import Header from "../header";
import Footer from "../footer";
import { globalStyles } from "../stylesReports";

Font.register({
	family: "Oswald",
	src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

const CobranzasPorFechaReport = ({
	title,
	subtitle,
	nombreInforme,
	fechaDesde,
	fechaHasta,
	refreshKey,
}) => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const endpoint = "http://localhost:5000/api/movimientos";
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

				const movimientosEnRango = response.data.filter(
					(movimiento) =>
						moment(movimiento.fecha).isBetween(
							moment(fechaDesde, "YYYY-MM-DD"),
							moment(fechaHasta, "YYYY-MM-DD"),
							null,
							"[]"
						) && movimiento.tipo_operacion === "INGRESO"
				);

				const sortedData = movimientosEnRango.sort((a, b) => {
					if (a.fecha < b.fecha) return -1;
					if (a.fecha > b.fecha) return 1;
					return 0;
				});

				// Obtener los medios de pago para cada movimiento
				for (const movimiento of sortedData) {
					movimiento.medio = await fetchMedioDePago(
						movimiento.medio_id
					);
				}

				// Actualizar el estado
				setData(sortedData);
			} catch (error) {
				console.error("Error:", error.message);
			}
		};

		const fetchMedioDePago = async (id) => {
			try {
				const endpoint = `http://localhost:5000/api/mediosdepago/${id}`;
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

				return response.data.medio;
			} catch (error) {
				console.error("Error obteniendo medio de pago:", error.message);
				return "N/A";
			}
		};

		fetchData();
	}, [refreshKey]);

	// Función para formatear la fecha de "aaaa-mm-dd" a "dd-mm-aaaa"
	const formatDate = (dateString) => {
		const [year, month, day] = dateString.split("-");
		return `${day}-${month}-${year}`;
	};

	const totalImporte = data.reduce((total, movimiento) => {
		if (movimiento.tipo_operacion === "EGRESO") {
			return total - Number(movimiento.importe);
		} else {
			return total + Number(movimiento.importe);
		}
	}, 0);

	const totalColor = totalImporte < 0 ? "red" : "black";

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
								{ textAlign: "left", maxWidth: "15%" },
							]}>
							Fecha
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "left", maxWidth: "30%" },
							]}>
							Tipo de Medio
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "left", maxWidth: "40%" },
							]}>
							Concepto
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{
									textAlign: "right",
									maxWidth: "15%",
									paddingRight: "5px",
								},
							]}>
							Importe
						</Text>
					</View>
					{data.map((movimiento) => (
						<View
							key={movimiento.id}
							style={[
								{
									borderBottomColor: "#AEAEAE",
								},
							]}>
							<View
								style={[
									globalStyles.tableRow,
									{ paddingRight: "0" },
								]}>
								<Text
									style={[
										globalStyles.tableCell,
										{ textAlign: "left", maxWidth: "15%" },
									]}>
									{formatDate(movimiento.fecha)}
								</Text>
								<Text
									style={[
										globalStyles.tableCell,
										{ textAlign: "left", maxWidth: "30%" },
									]}>
									{movimiento.medio || "N/A"}
								</Text>
								<Text
									style={[
										globalStyles.tableCell,
										{ textAlign: "left", maxWidth: "40%" },
									]}>
									{movimiento.concepto}
								</Text>
								<Text
									style={[
										globalStyles.tableCell,
										{
											textAlign: "right",
											maxWidth: "15%",
											paddingRight: "5px",
											color:
												movimiento.tipo_operacion ===
												"EGRESO"
													? "red"
													: "black",
										},
									]}>
									{movimiento.tipo_operacion === "EGRESO"
										? "- "
										: ""}
									{new Intl.NumberFormat("es-AR", {
										style: "currency",
										currency: "ARS",
									}).format(movimiento.importe)}
								</Text>
							</View>
						</View>
					))}
					{/* Totalizador */}
					<View
						style={[
							globalStyles.tableRow,
							{
								padding: "0px",
								marginTop: "0px",
								marginBottom: "0px",
								border: "none",
							},
						]}>
						<Text
							style={[
								globalStyles.tableCell,
								{
									textAlign: "right",
									maxWidth: "85%",
									paddingRight: "5px",
								},
							]}>
							Total:
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{
									textAlign: "right",
									maxWidth: "15%",
									paddingRight: "5px",
									fontWeight: "bold",
									color: totalColor,
									backgroundColor: "#dddddd",
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

export default CobranzasPorFechaReport;

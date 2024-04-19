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

const MovimientosPorFechaReport = ({
	title,
	nombreInforme,
	fechaDesde,
	fechaHasta,
	refreshKey,
}) => {
	const [data, setData] = useState([]);
	const [profesional, setProfesional] = useState([]);

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

				const movimientosEnRango = response.data.filter((movimiento) =>
					moment(movimiento.fecha).isBetween(
						moment(fechaDesde, "YYYY-MM-DD"),
						moment(fechaHasta, "YYYY-MM-DD"),
						null,
						"[]"
					)
				);

				const sortedData = movimientosEnRango.sort((a, b) => {
					if (a.fecha < b.fecha) return -1;
					if (a.fecha > b.fecha) return 1;
					return 0;
				});

				// Obtener nombres de profesionales y establecimientos
				const profesionalIds = new Set(
					sortedData.map((movimiento) => movimiento.profesional_id)
				);

				await fetchProfesionales([...profesionalIds]);

				setData(sortedData);
			} catch (error) {
				console.error("Error:", error.message);
			}
		};

		const fetchProfesionales = async (ids) => {
			try {
				const profesionales = {};
				for (const id of ids) {
					const endpoint = `http://localhost:5000/api/profesionales/${id}`;
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
					// Verificar si la respuesta no es null antes de acceder a 'nombre'
					if (response.data !== null) {
						profesionales[id] = response.data.nombre;
					}
				}
				setProfesional(profesionales);
			} catch (error) {
				console.error(
					"Error obteniendo nombres de profesionales:",
					error.message
				);
			}
		};

		fetchData();
	}, [refreshKey]);

	// Función para formatear la fecha de "aaaa-mm-dd" a "dd-mm-aaaa"
	const formatDate = (dateString) => {
		const [year, month, day] = dateString.split("-");
		return `${day}-${month}-${year}`;
	};

	const totalImporte = data.reduce(
		(total, movimiento) => total + Number(movimiento.importe),
		0
	);

	return (
		<>
			<Document author="CoCoFyC" title={nombreInforme}>
				<Page
					size="A4"
					orientation="portrait"
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
								{ textAlign: "left", maxWidth: "15%" },
							]}>
							Fecha
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
								{ textAlign: "left", maxWidth: "30%" },
							]}>
							Profesional
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{
									textAlign: "right",
									maxWidth: "15%",
									paddingRight: "15px",
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
									borderBottomWidth: 1,
									borderBottomColor: "#AEAEAE",
								},
							]}>
							<View style={globalStyles.tableRow}>
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
										{ textAlign: "left", maxWidth: "40%" },
									]}>
									{movimiento.concepto}
								</Text>
								<Text
									style={[
										globalStyles.tableCell,
										{ textAlign: "left", maxWidth: "30%" },
									]}>
									{profesional[movimiento.profesional_id] ||
										movimiento.profesional_id}
								</Text>
								<Text
									style={[
										globalStyles.tableCell,
										{
											textAlign: "right",
											maxWidth: "15%",
											paddingRight: "15px",
										},
									]}>
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
								backgroundColor: "#bbbbbb",
								paddingTop: "0px",
								paddingBottom: "0px",
								marginTop: "0px",
								marginBottom: "0px",
							},
						]}>
						<Text
							style={[
								globalStyles.tableCell,
								{
									textAlign: "left",
									maxWidth: "85%",
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

export default MovimientosPorFechaReport;

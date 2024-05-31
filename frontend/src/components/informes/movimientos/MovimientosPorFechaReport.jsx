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
	subtitle,
	nombreInforme,
	fechaDesde,
	fechaHasta,
	refreshKey,
	API_ENDPOINT,
}) => {
	const [data, setData] = useState([]);
	const [profesional, setProfesional] = useState([]);
	const [saldoAnterior, setSaldoAnterior] = useState(0);
	const [totalPosterior, setTotalPosterior] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const endpoint = `${API_ENDPOINT}/movimientos`;
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

				const allMovimientos = response.data;

				const movimientosEnRango = allMovimientos.filter((movimiento) =>
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

				// Obtener los medios de pago para cada movimiento
				for (const movimiento of sortedData) {
					movimiento.medio = await fetchMedioDePago(
						movimiento.medio_id
					);
				}

				// Calcular saldo anterior
				const saldoAnterior = calcularSaldoAnterior(allMovimientos);

				// Calcular saldo posterior
				const saldoPosterior = calcularSaldoPosterior(allMovimientos);

				// Actualizar el estado
				setData(sortedData);
				setSaldoAnterior(saldoAnterior);
				setTotalPosterior(saldoPosterior);
			} catch (error) {
				console.error("Error:", error.message);
			}
		};

		const fetchProfesionales = async (ids) => {
			try {
				const profesionales = {};
				for (const id of ids) {
					const endpoint = `${API_ENDPOINT}/profesionales/${id}`;
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

		const fetchMedioDePago = async (id) => {
			try {
				const endpoint = `${API_ENDPOINT}/mediosdepago/${id}`;
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

	// Función para calcular el saldo anterior al día anterior a fechaDesde
	const calcularSaldoAnterior = (movimientos) => {
		const movimientosAnteriores = movimientos.filter((movimiento) =>
			moment(movimiento.fecha).isBefore(moment(fechaDesde, "YYYY-MM-DD"))
		);

		const saldoAnterior = movimientosAnteriores.reduce(
			(saldo, movimiento) => {
				if (movimiento.tipo_operacion === "EGRESO") {
					return saldo - Number(movimiento.importe);
				} else {
					return saldo + Number(movimiento.importe);
				}
			},
			0
		);

		return saldoAnterior;
	};

	// Función para calcular el saldo posterior al día posterior a fechaHasta
	const calcularSaldoPosterior = (movimientos) => {
		// const movimientosPosteriores = movimientos.filter((movimiento) =>
		// 	moment(movimiento.fecha).isAfter(moment(fechaHasta, "YYYY-MM-DD"))
		// );

		const movimientosPosteriores = movimientos.filter(
			(movimiento) =>
				moment(movimiento.fecha).isAfter(
					moment(fechaHasta, "YYYY-MM-DD")
				) && moment(movimiento.fecha).isSameOrBefore(moment(), "day")
		);

		const saldoPosterior = movimientosPosteriores.reduce(
			(saldo, movimiento) => {
				if (movimiento.tipo_operacion === "EGRESO") {
					return saldo - Number(movimiento.importe);
				} else {
					return saldo + Number(movimiento.importe);
				}
			},
			0
		);

		return saldoPosterior;
	};

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
								marginBottom: "20px",
								fontWeight: "bold",
								border: "1",
								borderColor: "#000000",
							},
						]}>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "left", maxWidth: "85%" },
							]}>
							Saldo al{" "}
							{moment(fechaDesde, "YYYY-MM-DD")
								.subtract(1, "days")
								.format("DD-MM-YYYY")}
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{
									textAlign: "right",
									maxWidth: "15%",
									color: saldoAnterior < 0 ? "red" : "black",
								},
							]}>
							{new Intl.NumberFormat("es-AR", {
								style: "currency",
								currency: "ARS",
							}).format(saldoAnterior)}
						</Text>
					</View>
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

					{moment(fechaHasta).isSameOrAfter(
						moment(),
						"day"
					) ? null : (
						<View
							style={[
								globalStyles.tableRow,
								{
									height: "18px",
									paddingTop: "1px",
									paddingBottom: "1px",
									marginTop: "20px",
									fontWeight: "bold",
									border: "1",
									borderColor: "#000000",
								},
							]}>
							<Text
								style={[
									globalStyles.tableCell,
									{ textAlign: "left", maxWidth: "85%" },
								]}>
								Movimientos desde{" "}
								{moment(fechaHasta, "YYYY-MM-DD")
									.add(1, "days")
									.format("DD-MM-YYYY")}
							</Text>
							<Text
								style={[
									globalStyles.tableCell,
									{
										textAlign: "right",
										maxWidth: "15%",
										color:
											totalPosterior < 0
												? "red"
												: "black",
									},
								]}>
								{new Intl.NumberFormat("es-AR", {
									style: "currency",
									currency: "ARS",
								}).format(totalPosterior)}
							</Text>
						</View>
					)}
					<Footer data={data} />
				</Page>
			</Document>
		</>
	);
};

export default MovimientosPorFechaReport;

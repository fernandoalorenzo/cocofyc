import React, { useState, useEffect } from "react";
import { Document, Page, View, Text, Font } from "@react-pdf/renderer";
import apiConnection from "../../../../../backend/functions/apiConnection";
import Header from "../header";
import Footer from "../footer";
import { globalStyles } from "../stylesReports";

Font.register({
	family: "Oswald",
	src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

const DenunciasActivasReport = ({ title, nombreInforme }) => {
	const [data, setData] = useState([]);
	const [profesional, setProfesional] = useState({});
	const [establecimiento, setEstablecimiento] = useState({});

	useEffect(() => {
		const fetchDenunciasActivas = async () => {
			try {
				const endpoint = "http://localhost:5000/api/denuncias";
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

				// Filtrar solo los denuncias activas
				const denunciasActivas = response.data.filter(
					(denuncia) => !denuncia.fecha_cierre
				);

				// Recorrer cada denuncia activa para obtener los seguimientos
				for (const denuncia of denunciasActivas) {
					// Obtener los seguimientos asociados a la denuncia
					const seguimientosEndpoint = `http://localhost:5000/api/denuncias/seguimientos/${denuncia.id}`;
					const seguimientosResponse = await apiConnection(
						seguimientosEndpoint,
						direction,
						method,
						body,
						headers
					);
					// Agregar los seguimientos al objeto de la denuncia
					denuncia.seguimientos = seguimientosResponse.data;
				}

				const sortedData = denunciasActivas.sort((a, b) => {
					if (a.fecha < b.fecha) return -1;
					if (a.fecha > b.fecha) return 1;
					return 0;
				});

				// Obtener nombres de profesionales y establecimientos
				const profesionalIds = new Set(
					sortedData.map((denuncia) => denuncia.profesional_id)
				);
				const establecimientoIds = new Set(
					sortedData.map((denuncia) => denuncia.establecimiento_id)
				);
				await fetchProfesionales([...profesionalIds]);
				await fetchEstablecimientos([...establecimientoIds]);

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
					profesionales[id] = response.data.nombre;
				}
				setProfesional(profesionales);
			} catch (error) {
				console.error(
					"Error obteniendo nombres de profesionales:",
					error.message
				);
			}
		};

		const fetchEstablecimientos = async (ids) => {
			try {
				const establecimientos = {};
				for (const id of ids) {
					const endpoint = `http://localhost:5000/api/establecimientos/${id}`;
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
					establecimientos[id] = response.data.establecimiento;
				}
				setEstablecimiento(establecimientos);
			} catch (error) {
				console.error(
					"Error obteniendo nombres de establecimientos:",
					error.message
				);
			}
		};

		fetchDenunciasActivas();
	}, []);

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
								{ textAlign: "left", maxWidth: "3%" },
							]}>
							Fecha
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "center" },
							]}>
							N° Acta
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "left", maxWidth: "20%" },
							]}>
							Infracción
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "left", maxWidth: "20%" },
							]}>
							Comentario
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "left", maxWidth: "20%" },
							]}>
							Profesional
						</Text>
						<Text
							style={[
								globalStyles.tableCell,
								{ textAlign: "left", maxWidth: "20%" },
							]}>
							Establecimiento
						</Text>
					</View>
					{data.map((denuncia) => (
						<View
							key={denuncia.id}
							style={[
								{
									paddingBottom: "15px",
									borderBottomWidth: 1,
									borderBottomColor: "#AEAEAE",
								},
							]}>
							<View style={globalStyles.tableRow}>
								<Text
									style={[
										globalStyles.tableCell,
										{ textAlign: "left", maxWidth: "3%" },
									]}>
									{formatDate(denuncia.fecha)}
								</Text>
								<Text
									style={[
										globalStyles.tableCell,
										{ textAlign: "center" },
									]}>
									{denuncia.nro_acta}
								</Text>
								<Text
									style={[
										globalStyles.tableCell,
										{ textAlign: "left", maxWidth: "20%" },
									]}>
									{denuncia.infraccion}
								</Text>
								<Text
									style={[
										globalStyles.tableCell,
										{ textAlign: "left", maxWidth: "20%" },
									]}>
									{denuncia.comentario}
								</Text>
								<Text
									style={[
										globalStyles.tableCell,
										{ textAlign: "left", maxWidth: "20%" },
									]}>
									{profesional[denuncia.profesional_id] ||
										denuncia.profesional_id}
								</Text>
								<Text
									style={[
										globalStyles.tableCell,
										{ textAlign: "left", maxWidth: "20%" },
									]}>
									{establecimiento[
										denuncia.establecimiento_id
									] || denuncia.establecimiento_id}
								</Text>
							</View>
							<View
								style={[
									globalStyles.tableRow,
									{
										backgroundColor: "#bbbbbb",
										color: "#ffffff",
										marginLeft: "25%",
										marginTop: "5px",
										marginBottom: "0px",
										paddingTop: "0px",
										paddingBottom: "0px",
									},
								]}>
								<Text
									style={[
										globalStyles.tableCell,
										{
											textAlign: "center",
											maxWidth: "20%",
										},
									]}>
									Fecha
								</Text>
								<Text
									style={[
										globalStyles.tableCell,
										{ textAlign: "left", maxWidth: "60%" },
									]}>
									Respuesta
								</Text>
								<Text
									style={[
										globalStyles.tableCell,
										{
											textAlign: "center",
											maxWidth: "20%",
										},
									]}>
									Prox. Seguimiento
								</Text>
							</View>
							{/* Iterar sobre los seguimientos de la denuncia */}
							<View
								style={[
									{
										backgroundColor: "#EFEFEF",
										padding: "1px",
										marginLeft: "25%",
									},
								]}>
								{denuncia.seguimientos
									.sort(
										(a, b) =>
											new Date(a.fecha) -
											new Date(b.fecha)
									)
									.map((seguimiento) => (
										<View
											key={seguimiento.id}
											style={[
												globalStyles.tableRow,
												{
													border: 0,
													marginTop: "0px",
													marginBottom: "0px",
													padding: "0px",
												},
											]}>
											<Text
												style={[
													globalStyles.tableCell,
													{
														textAlign: "center",
														maxWidth: "20%",
													},
												]}>
												{formatDate(seguimiento.fecha)}
											</Text>
											<Text
												style={[
													globalStyles.tableCell,
													{
														textAlign: "left",
														maxWidth: "60%",
													},
												]}>
												{seguimiento.respuesta}
											</Text>
											<Text
												style={[
													globalStyles.tableCell,
													{
														textAlign: "center",
														maxWidth: "20%",
													},
												]}>
												{
													seguimiento.proximo_seguimiento
												}
											</Text>
										</View>
									))}
							</View>
						</View>
					))}
					<Footer data={data} />
				</Page>
			</Document>
		</>
	);
};

export default DenunciasActivasReport;
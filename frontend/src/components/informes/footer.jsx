import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { globalStyles } from "./stylesReports";

const Footer = ({ data }) => (
	<View style={globalStyles.footer}>
		<Text>Total de registros: {data.length}</Text>
		<Text
			style={globalStyles.pageNumber}
			render={({ pageNumber, totalPages }) =>
				`Pág. ${pageNumber} de ${totalPages}`
			}
			fixed
		/>
	</View>
);

export default Footer;

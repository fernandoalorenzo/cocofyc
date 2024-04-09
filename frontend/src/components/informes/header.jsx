import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import logo from "./../../assets/img/LogoCOCOFYC_horizontal.png";
import { globalStyles } from "./styles";

// const styles = StyleSheet.create({
// 	header: {
// 		textAlign: "center",
// 		flexDirection: "row",
// 		justifyContent: "space-between",
// 		alignItems: "center",
// 		marginBottom: 10,
// 		padding: 10,
// 	},
// 	headerLeft: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		fontSize: "12px",
// 	},
// 	logo: {
// 		height: 50,
// 		marginRight: 20,
// 	},
// });

const Header = ({ title }) => (
	<View style={globalStyles.header}>
		<View style={globalStyles.headerLeft}>
			<Image source={logo} style={globalStyles.logo} />
			<Text style={globalStyles.title}>{title}</Text>
		</View>
		<View style={[globalStyles.headerRight, { fontSize: "9px" }]}>
			<Text>Fecha de emisión: {new Date().toLocaleDateString()}</Text>
		</View>
	</View>
);

export default Header;

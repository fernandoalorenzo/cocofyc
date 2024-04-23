import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import logo from "./../../../assets/img/LogoCOCOFYC_horizontal.png";
import { globalStyles } from "./stylesReports";

const Header = ({ title, subtitle }) => (
	<View style={globalStyles.header}>
		<View style={globalStyles.headerLeft}>
			<Image source={logo} style={globalStyles.logo} />
			<View style={globalStyles.title}>
				<Text style={globalStyles.title}>{title}</Text>
				<Text style={globalStyles.subtitle}>{subtitle}</Text>
			</View>
		</View>
		<View style={[globalStyles.headerRight, { fontSize: "9px" }]}>
			<Text>Fecha de emisión: {new Date().toLocaleDateString()}</Text>
		</View>
	</View>
);

export default Header;

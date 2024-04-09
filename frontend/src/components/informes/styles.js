import { StyleSheet } from "@react-pdf/renderer";

export const globalStyles = StyleSheet.create({
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
		padding: 3,
		fontFamily: "Oswald",
	},
	tableRowCuota: {
		flexDirection: "row",
		flex: 2,
		alignItems: "center",
		fontFamily: "Oswald",
	},
	tableCell: {
		flex: 1,
	},
	tableCellCuota: {
		flex: 3,
		textAlign: "center",
		fontSize: 9,
	},
	tableCellCuotaTitulo: {
		flex: 3,
		textAlign: "center",
		fontSize: 9,
		border: 0,
	},
	activo: {
		width: 10,
		height: 10,
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

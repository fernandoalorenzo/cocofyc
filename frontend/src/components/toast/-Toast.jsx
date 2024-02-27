import { toast } from "react-hot-toast";

export const ToastOK = ( elemento, accion ) => {
	toast.success(elemento + " " + accion + " correctamente", {
		style: {
			border: "1px solid #0dc71a",
			borderRadius: "10px",
			background: "#333",
			color: "#fff",
		},
		position: "top-center",
	});
	return <></>;
};

export const ToastError = ( elemento, accion) => {
	toast.error("Error al intentar " + accion + " el " + elemento + "", {
		style: {
			border: "1px solid #ff000d",
			borderRadius: "10px",
			background: "#333",
			color: "#fff",
		},
		position: "top-center",
	});
	return <></>;
};

export const ToastErrorGenerico = (mensaje) => {
	toast.error(mensaje, {
		style: {
			border: "1px solid #ff000d",
			borderRadius: "10px",
			background: "#333",
			color: "#fff",
		},
		position: "top-center",
	});
	return <></>;
};
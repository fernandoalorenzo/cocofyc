import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const FormularioCargarPago = ({ closeModal, user }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

	const onSubmit = async (data) => {
		// Agregar el campo tipo_operacion con el valor "INGRESO"
		const newData = {
			...data,
			tipo_operacion: "INGRESO",
			user_id: user.id,
		};
		try {
			// Aquí iría tu lógica de envío de datos al servidor
			console.log(newData);
			// Mostrar mensaje de éxito
			Swal.fire({
				title: "Éxito",
				text: "El registro fue creado exitosamente",
				icon: "success",
				timer: 2500,
			});
		} catch (error) {
			console.error("Error al guardar el registro:", error.message);
			Swal.fire({
				title: "Error",
				text: "Ha ocurrido un error al intentar guardar el registro",
				icon: "error",
			});
		}
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setArchivoSeleccionado(file);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{/* user_id obtenido del localStorage */}
			<input
				type="hidden"
				{...register("user_id")}
				value={localStorage.getItem("user_id") || ""}
			/>
			{/* Resto del formulario */}
			{/* ... */}
		</form>
	);
};

export default FormularioCargarPago;

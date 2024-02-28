import React, { useState } from "react";

const Imagen = () => {
	const [imagePreview, setImagePreview] = useState(null);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleUpload = () => {
		if (!imagePreview) {
			console.log("No hay imagen para subir.");
			return;
		}

		const formData = new FormData();
		formData.append("file", imagePreview);

		fetch("http://localhost:5000/api/loadimage/", {
			// Aquí debes especificar la ruta correcta en tu servidor
			method: "POST",
			body: formData,
		})
			.then((response) => {
				if (response.ok) {
					console.log("Imagen subida correctamente.");
					// Aquí puedes agregar lógica adicional después de subir la imagen
				} else {
					console.error("Error al subir la imagen.");
				}
			})
			.catch((error) => {
				console.error("Error de red:", error);
			});
	};

	return (
		<>
			<div className="content-wrapper">
				<div className="content-header">
					<div className="container-fluid">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1 className="m-0">Imagen</h1>
							</div>
						</div>
						<div className="row mb-2">
							<div className="col-sm-6">
								<input
									type="file"
									name="image"
									id="image"
									className="form-control"
									onChange={handleImageChange}
								/>
							</div>
						</div>
						<div className="row">
							<div className="col">
								{imagePreview && (
									<img
										src={imagePreview}
										alt="Vista previa"
										style={{
											maxWidth: "100%",
											maxHeight: "300px",
										}}
									/>
								)}
							</div>
						</div>
						<div className="row mt-2">
							<div className="col">
								<button
									className="btn btn-primary"
									onClick={handleUpload}>
									Subir Imagen
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Imagen;

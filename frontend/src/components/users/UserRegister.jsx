/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

const UserRegister = ( { API_ENDPOINT } ) => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		nombre: "",
		apellido: "",
		rol: "Administrador",
		activo: true,
	});

	const onSubmit = async (event) => {
		event.preventDefault();

		try {
			const url = `${API_ENDPOINT}/usuarios/`;
			const method = "POST";
			const response = await fetch(url, {
				method: method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				console.log("Usuario registrado exitosamente");
			} else {
				const data = await response.json();
				console.error("Error al registrar usuario:", data.message);
			}
		} catch (error) {
			console.error("Error al registrar/actualizar:", error);
		}
	};

	const handleChange = (event) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});
	};

	return (
		<>
			<section className="vh-100 gradient-custom">
				<form onSubmit={onSubmit}>
					<div className="container vh-100">
						<div className="row d-flex justify-content-center align-items-center">
							<div className="col-12 col-md-8 col-lg-6 col-xl-5">
								<div
									className="card bg-dark text-white mt-5"
									style={{ borderRadius: "1rem" }}>
									<div className="card-body p-4 text-center pb-0">
										<div className="mb-md-4">
											<h2 className="fw-bold mb-2 text-uppercase">
												Registro
											</h2>

											<div className="form-outline form-white mb-2">
												<input
													type="nombre"
													className="form-control form-control-lg"
													name="nombre"
													value={formData.nombre}
													onChange={handleChange}
													required
												/>
												<div className="row align-items-start">
													<label className="form-label text-start">
														Nombre
													</label>
												</div>
											</div>

											<div className="form-outline form-white mb-2">
												<input
													type="apellido"
													className="form-control form-control-lg"
													name="apellido"
													value={formData.apellido}
													onChange={handleChange}
												/>
												<div className="row align-items-start">
													<label className="form-label text-start">
														Apellido
													</label>
												</div>
											</div>

											<div className="form-outline form-white mb-2">
												<input
													type="email"
													className="form-control form-control-lg"
													name="email"
													value={formData.email}
													onChange={handleChange}
													required
												/>
												<div className="row align-items-start">
													<label className="form-label text-start">
														Email
													</label>
												</div>
											</div>

											<div className="form-outline form-white mb-2">
												<input
													type="password"
													className="form-control form-control-lg"
													name="password"
													value={formData.password}
													onChange={handleChange}
													required
												/>
												<div className="row align-items-start">
													<label className="form-label text-start">
														Password
													</label>
												</div>
											</div>

											<button
												className="btn btn-outline-light btn-lg me-2 mb-3"
												type="submit">
												Registrar
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</section>
		</>
	);
};

export default UserRegister;

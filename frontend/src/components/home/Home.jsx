/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./../../../assets/img/LogoCOCOFYC.png";
import TotalMorosos from "./homeTotalMorosos";
import MatriculasActivas from "./homeMatriculasActivas";
import EstablecimientosCaducidad from "./homeEstablecimientosCaducidad";

export default function Home({ API_ENDPOINT }) {
	const navigate = useNavigate();
	const [key, setKey] = useState(0);

	useEffect(() => {
		// Incrementa la clave cada vez que el componente Home se monta
		setKey((prevKey) => prevKey + 1);
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("user");
		localStorage.removeItem("token");

		navigate("/login");
	};

	return (
		<>
			{/* <div className="content-wrapper d-flex justify-content-center align-items-center"> */}
			<div className="content-wrapper">
				<div className="content-header">
					<div className="container-fluid">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1 className="m-0">Dashboard</h1>
							</div>
						</div>
					</div>
				</div>
				<div className="col-lg-6">
					<div className="content m-3">
						<div className="card">
							<EstablecimientosCaducidad
								API_ENDPOINT={API_ENDPOINT}
							/>
							{/* <i className="fa-solid fa-id-card">
									<i className="fas fa-arrow-circle-right">
										<div className="col-lg-3 col-6">
											<div className="small-box bg-danger">
												<div className="inner mb-5">
													<h3>
														<totalmorosos api_endpoint="{API_ENDPOINT}"></totalmorosos>
													</h3>
												</div>
												<div className="icon">
													<i className="fa-solid fa-triangle-exclamation" />
												</div>
												<a
													href="#"
													className="small-box-footer text-left ps-2">
													Profesionales Morosos{"{"}"
													"{"}"}
												</a>
											</div>
										</div>
										
										<i className="ion ion-person-add">
											<i className="fas fa-arrow-circle-right">
												<i className="ion ion-pie-graph">
													<i className="fas fa-arrow-circle-right">
														<div className="row">
															<div className="col-md-12 d-flex justify-content-center">
																<img
																	className="img-fluid w-50 my-5"
																	src="{Logo}"
																	alt="Logo"
																/>
															</div>
														</div>
													</i>
												</i>
											</i>
										</i>
									</i>
								</i>  */}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

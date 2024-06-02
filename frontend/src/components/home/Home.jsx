/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./../../../assets/img/LogoCOCOFYC.png";
import TotalMorosos from "./homeTotalMorosos";
import MatriculasActivas from "./homeMatriculasActivas";

export default function Home( {API_ENDPOINT} ) {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("user");
		localStorage.removeItem("token");

		navigate("/login");
	};

	return (
		<>
			<div className="content-wrapper d-flex justify-content-center align-items-center">
				<div className="content-header">
					<div className="container-fluid">
						{/* <div className="row mb-2">
							<div className="col-sm-6">
								<h1 className="m-0">Dashboard</h1>
							</div>
						</div> */}
					</div>
				</div>
				<section className="content">
					<div className="container-fluid">
						{/* Small boxes (Stat box) */}
						{/* <div className="row d-flex align-items-stretch">
							<div className="col-lg-3 col-6">
								<div className="small-box bg-success">
									<div className="inner mb-5">
										<h3>
											<MatriculasActivas API_ENDPOINT={API_ENDPOINT} />
										</h3>
									</div>
									<div className="icon">
										<i className="fa-solid fa-id-card" />
									</div>
									<a href="#" className="small-box-footer text-left ps-2">
										Matrículas Activas{" "}
										<i className="fas fa-arrow-circle-right" />
									</a>
								</div>
							</div>
							<div className="col-lg-3 col-6">
								<div className="small-box bg-danger">
									<div className="inner mb-5">
										<h3>
											<TotalMorosos API_ENDPOINT={API_ENDPOINT} />
										</h3>
									</div>
									<div className="icon">
										<i className="fa-solid fa-triangle-exclamation"></i>
									</div>
									<a
										href="#"
										className="small-box-footer text-left ps-2">
										Profesionales Morosos{" "}
									</a>
								</div>
							</div>
							<div className="col-lg-3 col-6">
								<div className="small-box bg-warning">
									<div className="inner">
										<h3>44</h3>
										<p>User Registrations</p>
									</div>
									<div className="icon">
										<i className="ion ion-person-add" />
									</div>
									<a href="#" className="small-box-footer">
										More info{" "}
										<i className="fas fa-arrow-circle-right" />
									</a>
								</div>
							</div>
							<div className="col-lg-3 col-6">
								<div className="small-box bg-danger">
									<div className="inner">
										<h3>65</h3>
										<p>Unique Visitors</p>
									</div>
									<div className="icon">
										<i className="ion ion-pie-graph" />
									</div>
									<a href="#" className="small-box-footer">
										More info{" "}
										<i className="fas fa-arrow-circle-right" />
									</a>
								</div>
							</div>
						</div> */}
						<div className="row">
							<div className="col-md-12 d-flex justify-content-center">
								<img
									className="img-fluid w-50 my-5"
									src={Logo}
									alt="Logo"
								/>
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}

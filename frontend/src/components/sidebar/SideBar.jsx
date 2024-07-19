import React, { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { Logo } from "./../logo/logo";

export default function SideBar() {
	const navigate = useNavigate();

	const [establecimiento, setEstablecimiento] = useState("");

	useEffect(() => {
		const parametros = JSON.parse(localStorage.getItem("parametros"));
		if (parametros && parametros.establecimiento) {
			setEstablecimiento(parametros.establecimiento);
		}
	}, []);

	const user = JSON.parse(localStorage.getItem("user"));
	const userName = user ? user.nombre : null;
	const isAdmin = user ? user.administrador : false;

	const handleLogout = () => {
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		navigate("/login");
	};

	return (
		<>
			{/* <!-- Main Sidebar Container --> */}
			<aside className="main-sidebar sidebar-dark-primary elevation-4">
				{/* Brand Logo */}
				<Link to="/" className="brand-link text-decoration-none ">
					<Logo />
					<span className="brand-text font-weight-light">
						<span className="brand-text font-weight-light">
							{establecimiento}
						</span>
					</span>
				</Link>
				{/* Sidebar */}
				<div className="sidebar">
					{/* Sidebar user panel (optional) */}
					<div className="user-panel mt-3 pb-3 mb-3 d-flex align-items-center justify-content-between">
						<div className="image left">
							<img
								src="./../assets/img/default_user.png"
								className="img-circle elevation-2"
								alt="Avatar"
							/>
							<a className="text-decoration-none ms-3">
								{userName}
							</a>
						</div>
						<div className="info">
							<div className="right d-flex align-items-center">
								<div className="col-auto">
									<i
										className="fa-solid fa-user text-white"
										style={{ cursor: "pointer" }}
										title="Perfil"
										onClick={() => navigate("/perfil")}></i>
								</div>
								<div className="col-auto p-0">
									<i
										className="fa-solid fa-power-off text-white"
										style={{ cursor: "pointer" }}
										title="Logout"
										onClick={handleLogout}></i>
								</div>
							</div>
						</div>
					</div>
					{/* Sidebar Menu */}
					<nav className="mt-2">
						<ul
							className="nav nav-pills nav-sidebar flex-column"
							data-widget="treeview"
							role="menu"
							data-accordion="false">
							{/* <li className="nav-item menu-open">
								<a href="#" className="nav-link active">
									<i className="nav-icon fas fa-tachometer-alt" />
									<p>
										Dashboard
										<i className="right fas fa-angle-left" />
									</p>
								</a>
								<ul className="nav nav-treeview">
									<li className="nav-item">
										<a
											href="./index.html"
											className="nav-link active">
											<i className="far fa-circle nav-icon" />
											<p>Dashboard v1</p>
										</a>
									</li>
									<li className="nav-item">
										<a
											href="./index2.html"
											className="nav-link">
											<i className="far fa-circle nav-icon" />
											<p>Dashboard v2</p>
										</a>
									</li>
									<li className="nav-item">
										<a
											href="./index3.html"
											className="nav-link">
											<i className="far fa-circle nav-icon" />
											<p>Dashboard v3</p>
										</a>
									</li>
								</ul>
							</li> */}
							<li className="nav-item">
								<NavLink
									to="/"
									className="nav-link"
									activeclassname="active">
									<i className="nav-icon fa-solid fa-house" />
									<p>Dashboard</p>
								</NavLink>
							</li>
							<li className="nav-header text-warning">GESTIÓN</li>
							<li className="nav-item">
								<NavLink
									to="/profesionales"
									className="nav-link"
									activeclassname="active">
									<i className="nav-icon fa-solid fa-user-tie" />
									<p>Profesionales</p>
								</NavLink>
							</li>
							<li className="nav-item">
								<NavLink
									to="/titulares"
									className="nav-link"
									activeclassname="active">
									<i className="nav-icon fa-solid fa-building-user" />
									<p>Titulares</p>
								</NavLink>
							</li>
							<li className="nav-item">
								<NavLink
									to="/establecimientos"
									className="nav-link"
									activeclassname="active">
									<i className="nav-icon fa-solid fa-spa" />
									<p>Establecimientos</p>
								</NavLink>
							</li>
							<li className="nav-item">
								<NavLink
									to="/cuotas"
									className="nav-link"
									activeclassname="active">
									<i className="nav-icon fa-solid fa-gear" />
									<p>Cuotas</p>
								</NavLink>
							</li>
							<li className="nav-item">
								<NavLink
									to="/denuncias"
									className="nav-link"
									activeclassname="active">
									<i className="nav-icon fa-solid fa-person-military-to-person" />
									<p>Denuncias</p>
								</NavLink>
							</li>
							<li className="nav-item">
								<NavLink
									to="/pagos"
									className="nav-link"
									activeclassname="active">
									<i className="nav-icon fa-solid fa-money-check-dollar" />
									<p>Gestión de Pagos</p>
								</NavLink>
							</li>
							<hr className="text-light"></hr>
							<li className="nav-item">
								<NavLink
									to="/informes"
									className="nav-link"
									activeclassname="active">
									<i className="nav-icon fa-regular fa-file-lines" />
									<p>Informes</p>
								</NavLink>
							</li>
							<hr className="text-light"></hr>
							{/*---------- CONFIGURACION ----------*/}
							{isAdmin && (
								<>
									<li className="nav-header text-warning">
										CONFIGURACION
									</li>
									<li className="nav-item">
										<NavLink
											to="/usuarios"
											className="nav-link"
											activeclassname="active">
											<i className="nav-icon fa-regular fa-address-book" />
											<p>Usuarios</p>
										</NavLink>
									</li>
									<li className="nav-item">
										<NavLink
											to="/parametros"
											className="nav-link"
											activeclassname="active">
											<i className="nav-icon fa-solid fa-gear" />
											<p>Parámetros</p>
										</NavLink>
									</li>
								</>
							)}
						</ul>
					</nav>
					{/* /.sidebar-menu */}
				</div>
				{/* /.sidebar */}
			</aside>
		</>
	);
}

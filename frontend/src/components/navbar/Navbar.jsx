/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../logo/logo";

export default function Navbar() {
	const navigate = useNavigate();

	const user = JSON.parse(localStorage.getItem("user"));
	const userName = user ? user.nombre : null;

	const handleLogout = () => {
		// Elimina los datos del localStorage
		localStorage.removeItem("user");
		localStorage.removeItem("token");

		// Redirige al login
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-expand-lg fixed-top navbar-light bg-warning bg-gradient">
			<div className="container-fluid">
				<Link className="navbar-brand m-0" to="/">
					<Logo alt="logo" className="d-inline align-text-top"></Logo>
				</Link>
				<span className="logo-titulo">MeetMe.gram</span>
				{userName && (
					<>
						<button
							className="navbar-toggler"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#navbarSupportedContent"
							aria-controls="navbarSupportedContent"
							aria-expanded="false"
							aria-label="Toggle navigation">
							<span className="navbar-toggler-icon"></span>
						</button>
						<div
							className="collapse navbar-collapse justify-content-end"
							id="navbarSupportedContent">
							<ul className="navbar-nav me-3">
								<li className="nav-item menu-item mx-4">
									<Link className="nav-link" to="/">
										Home
									</Link>
								</li>
							</ul>
							{/* <div className="row text-center">
								<div className="hstack gap-3">
									<div className="vr me-3"></div>
									<div className="col align-self-start d-inline-flex text-nowrap">
										<span className="nav-item">
											{userName}
										</span>
									</div>
									<div className="col align-self-start">
										<Link
											to="/profile">
											<i
												className="btn fa-solid fa-user nav-item"
												title="Perfil"></i>
										</Link>
									</div>
									<div className="col align-self-start">
										<Link
											to="/changepwd">
											<i
												className="btn fa-solid fa-key nav-item"
												title="Contraseña"></i>
										</Link>
									</div>
									<div className="col align-self-start">
										<i
											className="btn fa-solid fa-power-off nav-item"
											title="Logout"
											onClick={handleLogout}></i>
									</div>
								</div>
							</div> */}
							<div className="dropdown">
								<button
									className="btn btn-warning dropdown-toggle nav-item border border-2 border-dark rounded-pill px-4 fs-3"
									type="button"
									id="dropdownMenuButton"
									data-bs-toggle="dropdown"
									aria-haspopup="true"
									aria-expanded="false">
									<i className="fa-solid fa-user me-3"></i>
									{userName}
								</button>
								<div
									className="dropdown-menu dropdown-menu-end bg-dark text-warning border border-2 border-warning rounded-3"
									aria-labelledby="dropdownMenuButton">
									<Link to="/profile" className="my-2">
										<i
											className="btn fa-solid fa-user-pen fa-xl my-3 text-warning"
											title="Perfil">
											<span
												className="ms-3 text-uppercase fs-5 fw-normal"
												style={{
													fontFamily: "sans-serif",
												}}>
												{" "}
												Perfil
											</span>
										</i>
									</Link>
									<Link to="/changepwd">
										<i
											className="btn fa-solid fa-key fa-xl my-3 text-warning"
											title="Contraseña">
											<span
												className="ms-4 text-uppercase fs-5 fw-normal"
												style={{
													fontFamily: "sans-serif",
												}}>
												Contraseña
											</span>
										</i>
									</Link>
									<div className="dropdown-divider bg-warning"></div>
									<div>
										<i
											className="btn fa-solid fa-right-from-bracket fa-xl my-3  text-warning"
											title="Logout"
											onClick={handleLogout}>
											<span
												className="ms-4 text-uppercase fs-5 fw-normal"
												style={{
													fontFamily: "sans-serif",
												}}>
												Salir
											</span>
										</i>
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</nav>
	);
}

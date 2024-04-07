/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useNavigate,
} from "react-router-dom";

import AuthHandler from "./utils/AuthHandler.jsx";
import LoginForm from "./components/users/LoginForm";

import Perfil from "./components/users/PerfilForm.jsx";
import UserRegister from "./components/users/UserRegister";
import Footer from "./components/footer/Footer";
import Home from "./components/home/Home";
import Header from "./components/header/Header";
import SideBar from "./components/sidebar/SideBar";
import Profesionales from "./components/profesionales/profesionales";
import Usuarios from "./components/users/Usuarios.jsx";
import Establecimientos from "./components/establecimientos/establecimientos.jsx";
import Parametros from "./components/parametros/parametros.jsx";
import Cuotas from "./components/cuotas/cuotas.jsx";
import Denuncias from "./components/denuncias/denuncias.jsx";
import Pagos from "./components/pagos/pagos.jsx";
import Informes from "./components/informes/informes.jsx";

const Layout = ({ children }) => (
	<>
		<Header />
		<SideBar />
		{children}
		<Footer />
	</>
);

const App = () => {
	const [currentUser, setCurrentUser] = useState(
		JSON.parse(localStorage.getItem("user"))
	);

	// Obtener la información del usuario desde el localStorage
	const user = JSON.parse(localStorage.getItem("user"));

	return (
		<div className="wrapper">
			<Router>
				<Routes>
					<Route
						path="/"
						element={
							<AuthHandler>
								<Layout>
									<Home />
								</Layout>
							</AuthHandler>
						}
					/>
					<Route
						path="/profesionales"
						element={
							<AuthHandler>
								<Layout>
									<Profesionales />
								</Layout>
							</AuthHandler>
						}
					/>
					<Route
						path="/perfil"
						element={
							<AuthHandler>
								<Layout>
									<Perfil />
								</Layout>
							</AuthHandler>
						}
					/>
					<Route
						path="/establecimientos"
						element={
							<AuthHandler>
								<Layout>
									<Establecimientos />
								</Layout>
							</AuthHandler>
						}
					/>
					<Route
						path="/usuarios"
						element={
							<AuthHandler>
								<Layout>
									<Usuarios />
								</Layout>
							</AuthHandler>
						}
					/>
					<Route
						path="/parametros"
						element={
							<AuthHandler>
								<Layout>
									<Parametros />
								</Layout>
							</AuthHandler>
						}
					/>
					<Route
						path="/cuotas"
						element={
							<AuthHandler>
								<Layout>
									<Cuotas />
								</Layout>
							</AuthHandler>
						}
					/>
					<Route
						path="/denuncias"
						element={
							<AuthHandler>
								<Layout>
									<Denuncias />
								</Layout>
							</AuthHandler>
						}
					/>
					<Route
						path="/pagos"
						element={
							<AuthHandler>
								<Layout>
									<Pagos />
								</Layout>
							</AuthHandler>
						}
					/>
					<Route
						path="/informes"
						element={
							<AuthHandler>
								<Layout>
									<Informes />
								</Layout>
							</AuthHandler>
						}
					/>
					<Route path="/register" element={<UserRegister />} />
					<Route path="/login" element={<LoginForm />} />
				</Routes>
			</Router>
		</div>
	);
};

export default App;

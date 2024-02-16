/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import NoDisponible from "./pages/404";
// import LoginForm from "./components/users/LoginForm";
// import UserInfoForm from "./components/users/UserInfoForm";
// import UserPasswordForm from "./components/users/UserPasswordForm";
import Footer from "./components/footer/Footer";
import Home from "./components/home/Home";
import Header from "./components/header/Header";
import SideNav from "./components/sidenav/SideNav";

import Profesionales from "./components/profesionales/profesionales";
import { useState } from "react";

const App = () => {
	// const [currentUser, setCurrentUser] = useState(
	// 		JSON.parse(localStorage.getItem("user"))
	// );
	
	// ACTUALIZA LOS DATOS DE USUARIO
	// const updateUser = (newUserData) => {
	// 	setCurrentUser(newUserData);
	// };

	// Obtener la información del usuario desde el localStorage
	// const user = JSON.parse(localStorage.getItem("user"));

	// Determinar si hay un usuario logueado, estamos actualizando
	// const isUpdating = !!user;

	return (
		<>
			<div className="wrapper">
				<Router>
					{/* <SideNav updateUser={updateUser} /> */}
					<SideNav />
					<Header />
					<Routes>
						{/* <Home /> */}
						<Route path="/" element={<Home />} />
						<Route
							path="/profesionales"
							element={<Profesionales />}
						/>
					</Routes>
					<Footer />
				</Router>
			</div>
		</>
	);
};

export default App;

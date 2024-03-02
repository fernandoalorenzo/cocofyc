/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/users/LoginForm";
import UserInfoForm from "./components/users/UserInfoForm";
import UserPasswordForm from "./components/users/UserPasswordForm";
import Footer from "./components/footer/Footer";
import Home from "./components/home/Home";
import Header from "./components/header/Header";
import SideBar from "./components/sidebar/SideBar";
import Profesionales from "./components/profesionales/profesionales";
import { useState } from "react";

const App = () => {
	const [currentUser, setCurrentUser] = useState(
			JSON.parse(localStorage.getItem("user"))
	);

	// ACTUALIZA LOS DATOS DE USUARIO
	const updateUser = (newUserData) => {
		setCurrentUser(newUserData);
	};

	// Obtener la información del usuario desde el localStorage
	const user = JSON.parse(localStorage.getItem("user"));

	// Determinar si hay un usuario logueado, estamos actualizando
	const isUpdating = !!user;

	return (
		<>
			<div className="wrapper">
				<Router>
					{/* <SideNav updateUser={updateUser} /> */}
					<SideBar />
					<Header />
					<Routes>
						{/* <Route path="/" element={<Home />} />
						<Route
							path="/profesionales"
							element={<Profesionales />}
						/>*/}
						<Route path="*" element={<Home />} />
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<LoginForm />} />
						<Route
							path="/register"
							element={<UserInfoForm isUpdating={false} />}
						/>
						<Route
							path="/profile"
							element={
								<UserInfoForm
									isUpdating={isUpdating}
									updateUser={updateUser}
								/>
							}
						/>
						<Route
							path="/changepwd"
							element={<UserPasswordForm />}
						/>
					</Routes>
					<Footer />
				</Router>
			</div>
		</>
	);
};

export default App;

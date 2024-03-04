/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/users/LoginForm";
import UserRegister from "./components/users/UserRegister";
import UserPasswordForm from "./components/users/UserPasswordForm";
import Footer from "./components/footer/Footer";
import Home from "./components/home/Home";
import Header from "./components/header/Header";
import SideBar from "./components/sidebar/SideBar";
import Profesionales from "./components/profesionales/profesionales";

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


	// ACTUALIZA LOS DATOS DE USUARIO
	const updateUser = (newUserData) => {
		setCurrentUser(newUserData);
	};

	// Obtener la información del usuario desde el localStorage
	// const user = JSON.parse(localStorage.getItem("user"));

	// Determinar si hay un usuario logueado, estamos actualizando
	// const isUpdating = !!user;
	
	return (
		<div className="wrapper">
			<Router>
				<Routes>
					<Route
						path="/"
						element={
							<Layout>
								<Home />
							</Layout>
						}
					/>
					<Route path="/login" element={<LoginForm />} />
					<Route
						path="/profesionales"
						element={
							currentUser ? (
								<Layout>
									<Profesionales />
								</Layout>
							) : (
								<Navigate to="/login" />
							)
						}
					/>
					<Route
						path="/profile"
						element={
							currentUser ? (
								<Layout>
									<UserRegister
										isUpdating={true}
										updateUser={updateUser}
									/>
								</Layout>
							) : (
								<Navigate to="/login" />
							)
						}
					/>
					<Route
						path="/changepwd"
						element={
							currentUser ? (
								<Layout>
									<UserPasswordForm />
								</Layout>
							) : (
								<Navigate to="/login" />
							)
						}
					/>
				</Routes>
			</Router>
		</div>
	);
};

export default App;

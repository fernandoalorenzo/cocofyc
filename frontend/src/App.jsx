/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/users/LoginForm";
import UserRegister from "./components/users/UserRegister";
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
	// const isUpdating = !!user;

	// return (
	// 	<>
	// 		<div className="wrapper">
	// 			<Router>
	// 				{/* <SideNav updateUser={updateUser} /> */}
	// 				<SideBar />
	// 				<Header />
	// 				<Route path="/login" element={<LoginForm />} />
	// 				<Route
	// 					path="/register"
	// 					element={<UserRegister isUpdating={false} />}
	// 				/>
	// 				<Routes>
	// 					<Route path="/" element={<Home />} />
	// 					<Route
	// 						path="/profesionales"
	// 						element={<Profesionales />}
	// 					/>
	// 					<Route path="*" element={<Home />} />
	// 					<Route path="/" element={<Home />} />
	// 					<Route
	// 						path="/profile"
	// 						element={
	// 							<UserRegister
	// 								isUpdating={isUpdating}
	// 								updateUser={updateUser}
	// 							/>
	// 						}
	// 					/>
	// 					<Route
	// 						path="/changepwd"
	// 						element={<UserPasswordForm />}
	// 					/>
	// 				</Routes>
	// 				<Footer />
	// 			</Router>
	// 		</div>
	// 	</>
	// );

	return (
		<div className="wrapper">
			<Router>
				<Routes>
					<Route
						path="/"
						element={
							currentUser ? (
								<>
									<Header />
									<SideBar />
									<Home />
									<Footer />
								</>
							) : (
								<Navigate to="/login" />
							)
						}
					/>
					<Route path="/login" element={<LoginForm />} />
					<Route
						path="/register"
						element={<UserRegister isUpdating={false} />}
					/>
					<Route
						path="/profesionales"
						element={
							currentUser ? (
								<>
									<Header />
									<SideBar />
									<Profesionales />
									<Footer />
								</>
							) : (
								<Navigate to="/login" />
							)
						}
					/>
					<Route
						path="/profile"
						element={
							currentUser ? (
								<>
									<Header />
									<SideBar />
									<UserRegister
										isUpdating={true}
										updateUser={updateUser}
									/>
									<Footer />
								</>
							) : (
								<Navigate to="/login" />
							)
						}
					/>
					<Route
						path="/changepwd"
						element={
							currentUser ? (
								<>
									<Header />
									<SideBar />
									<UserPasswordForm />
									<Footer />
								</>
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

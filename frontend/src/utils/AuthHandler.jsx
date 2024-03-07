import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthHandler = ({ children }) => {
	const navigate = useNavigate();
	const [tokenExpired, setTokenExpired] = useState(false);

	useEffect(() => {
		const checkTokenExpiration = () => {
			const token = localStorage.getItem("token");
			if (token) {
				const decodedToken = jwtDecode(token);
				const currentTime = Date.now() / 1000;

				if (decodedToken.exp < currentTime) {
					setTokenExpired(true);
					localStorage.removeItem("user");
					localStorage.removeItem("token");
				}
			} else {
				setTokenExpired(true);
				localStorage.removeItem("user");
				localStorage.removeItem("token");
			}
		};

		checkTokenExpiration();
		const intervalId = setInterval(checkTokenExpiration, 60000);

		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		if (tokenExpired) {
			navigate("/login");
		}
	}, [tokenExpired, navigate]);

	return <>{children}</>;
};

export default AuthHandler;

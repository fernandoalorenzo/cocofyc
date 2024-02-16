/* eslint-disable no-unused-vars */
import React from "react";

const Footer = () => {
	return (
		<>
			<div>
				<footer className="main-footer">
					<strong>
						Copyright © 2014-2021{" "}
						<a href="https://adminlte.io">AdminLTE.io</a>.
					</strong>
					All rights reserved.
					<div className="float-right d-none d-sm-inline-block">
						<b>Version</b> 3.2.0
					</div>
				</footer>
				{/* Control Sidebar */}
				<aside className="control-sidebar control-sidebar-dark">
					{/* Control sidebar content goes here */}
				</aside>
				{/* /.control-sidebar */}
			</div>
		</>
		// <footer className="text-center bg-primary bg-gradient align-items-center col align-self-center">
		// 	<p>
		// 		Copyright ©{new Date().getFullYear()}. All rights reserved.
		// 		Powered by Fernando Lorenzo
		// 	</p>
		// </footer>
	);
};

export default Footer;

/* eslint-disable no-unused-vars */
import React from "react";

const Footer = () => {
	return (
		<>
			<div>
				<footer className="main-footer">
					Copyright ©{new Date().getFullYear()}. All rights reserved. Dev by Fernando Lorenzo
					<div className="float-right d-none d-sm-inline">
						<b>Version</b> 1.0.0 | {new Date().getDate()}-
						{("0" + (new Date().getMonth() + 1)).slice(-2)}-
						{new Date().getFullYear()}
					</div>
				</footer>
				{/* Control Sidebar */}
				<aside className="control-sidebar control-sidebar-dark">
					{/* Control sidebar content goes here */}
				</aside>
				{/* /.control-sidebar */}
			</div>
		</>
	);
};

export default Footer;

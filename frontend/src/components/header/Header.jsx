/* eslint-disable no-unused-vars */

export default function Header() {
	return (
		<>
			{/* <!-- Navbar --> */}
			<nav className="main-header navbar navbar-expand navbar-white navbar-light">
				{/* Left navbar links */}
				<ul className="navbar-nav">
					<li className="nav-item">
						<a
							className="nav-link"
							data-widget="pushmenu"
							href="#"
							role="button">
							<i className="fas fa-bars" />
						</a>
					</li>
				</ul>
				{/* Right navbar links */}
				<ul className="navbar-nav ml-auto">
					<li className="nav-item">
						<a
							className="nav-link"
							data-widget="fullscreen"
							href="#"
							role="button">
							<i className="fas fa-expand-arrows-alt" />
						</a>
					</li>
					{/* <li className="nav-item">
						<a
							className="nav-link"
							data-widget="control-sidebar"
							data-controlsidebar-slide="true"
							href="#"
							role="button">
							<i className="fas fa-th-large" />
						</a>
					</li> */}
				</ul>
			</nav>

			{/* <!-- /.navbar --> */}
		</>
	);
}

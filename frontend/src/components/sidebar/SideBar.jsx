/* eslint-disable no-unused-vars */
import { Link, useNavigate, NavLink } from "react-router-dom";
import { Logo } from "../logo/logo";

export default function SideBar() {
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
		<>
			{/* <!-- Main Sidebar Container --> */}
			<aside className="main-sidebar sidebar-dark-primary elevation-4">
				{/* Brand Logo */}
				<Link to="/" className="brand-link">
					<Logo />
					<span className="brand-text font-weight-light ms-3">
						CoCoFyC
					</span>
				</Link>
				{/* Sidebar */}
				<div className="sidebar">
					{/* Sidebar user panel (optional) */}
					<div className="user-panel mt-3 pb-3 mb-3 d-flex">
						<div className="image">
							<img
								src="dist/img/user2-160x160.jpg"
								className="img-circle elevation-2"
								alt="User Image"
							/>
						</div>
						<div className="info">
							<a href="#" className="d-block">
								Alexander Pierce
							</a>
						</div>
					</div>
					{/* Sidebar Menu */}
					<nav className="mt-2">
						<ul
							className="nav nav-pills nav-sidebar flex-column"
							data-widget="treeview"
							role="menu"
							data-accordion="false">
							{/* <li className="nav-item menu-open">
								<a href="#" className="nav-link active">
									<i className="nav-icon fas fa-tachometer-alt" />
									<p>
										Dashboard
										<i className="right fas fa-angle-left" />
									</p>
								</a>
								<ul className="nav nav-treeview">
									<li className="nav-item">
										<a
											href="./index.html"
											className="nav-link active">
											<i className="far fa-circle nav-icon" />
											<p>Dashboard v1</p>
										</a>
									</li>
									<li className="nav-item">
										<a
											href="./index2.html"
											className="nav-link">
											<i className="far fa-circle nav-icon" />
											<p>Dashboard v2</p>
										</a>
									</li>
									<li className="nav-item">
										<a
											href="./index3.html"
											className="nav-link">
											<i className="far fa-circle nav-icon" />
											<p>Dashboard v3</p>
										</a>
									</li>
								</ul>
							</li> */}
							<li className="nav-item">
								<NavLink
									to="/"
									className="nav-link"
									activeclassname="active">
									<i className="nav-icon fa-solid fa-house" />
									Dashboard
								</NavLink>
							</li>
							<li className="nav-item">
								<NavLink
									to="/profesionales"
									className="nav-link"
									activeclassname="active">
									<i className="nav-icon fa-solid fa-user-tie" />
									Profesionales
								</NavLink>
							</li>
							<li className="nav-item">
								<a
									href="pages/widgets.html"
									className="nav-link">
									<i className="nav-icon fas fa-th" />
									<p>
										Widgets
										<span className="right badge badge-danger">
											New
										</span>
									</p>
								</a>
							</li>
							<li className="nav-item">
								<a href="#" className="nav-link">
									<i className="nav-icon fas fa-copy" />
									<p>
										Layout Options
										<i className="fas fa-angle-left right" />
										<span className="badge badge-info right">
											6
										</span>
									</p>
								</a>
								<ul className="nav nav-treeview">
									<li className="nav-item">
										<a
											href="pages/layout/top-nav.html"
											className="nav-link">
											<i className="far fa-circle nav-icon" />
											<p>Top Navigation</p>
										</a>
									</li>
									<li className="nav-item">
										<a
											href="pages/layout/top-nav-sidebar.html"
											className="nav-link">
											<i className="far fa-circle nav-icon" />
											<p>Top Navigation + Sidebar</p>
										</a>
									</li>
									<li className="nav-item">
										<a
											href="pages/layout/boxed.html"
											className="nav-link">
											<i className="far fa-circle nav-icon" />
											<p>Boxed</p>
										</a>
									</li>
									<li className="nav-item">
										<a
											href="pages/layout/fixed-sidebar.html"
											className="nav-link">
											<i className="far fa-circle nav-icon" />
											<p>Fixed Sidebar</p>
										</a>
									</li>
									<li className="nav-item">
										<a
											href="pages/layout/fixed-sidebar-custom.html"
											className="nav-link">
											<i className="far fa-circle nav-icon" />
											<p>
												Fixed Sidebar{" "}
												<small>+ Custom Area</small>
											</p>
										</a>
									</li>
									<li className="nav-item">
										<a
											href="pages/layout/fixed-topnav.html"
											className="nav-link">
											<i className="far fa-circle nav-icon" />
											<p>Fixed Navbar</p>
										</a>
									</li>
									<li className="nav-item">
										<a
											href="pages/layout/fixed-footer.html"
											className="nav-link">
											<i className="far fa-circle nav-icon" />
											<p>Fixed Footer</p>
										</a>
									</li>
									<li className="nav-item">
										<a
											href="pages/layout/collapsed-sidebar.html"
											className="nav-link">
											<i className="far fa-circle nav-icon" />
											<p>Collapsed Sidebar</p>
										</a>
									</li>
								</ul>
							</li>
							<li className="nav-header">EXAMPLES</li>
							<li className="nav-item">
								<a
									href="pages/calendar.html"
									className="nav-link">
									<i className="nav-icon far fa-calendar-alt" />
									<p>
										Calendar
										<span className="badge badge-info right">
											2
										</span>
									</p>
								</a>
							</li>
							<li className="nav-item">
								<a
									href="pages/gallery.html"
									className="nav-link">
									<i className="nav-icon far fa-image" />
									<p>Gallery</p>
								</a>
							</li>
							<li className="nav-item">
								<a
									href="pages/kanban.html"
									className="nav-link">
									<i className="nav-icon fas fa-columns" />
									<p>Kanban Board</p>
								</a>
							</li>

							<li className="nav-header">LABELS</li>
							<li className="nav-item">
								<a href="#" className="nav-link">
									<i className="nav-icon far fa-circle text-danger" />
									<p className="text">Important</p>
								</a>
							</li>
							<li className="nav-item">
								<a href="#" className="nav-link">
									<i className="nav-icon far fa-circle text-warning" />
									<p>Warning</p>
								</a>
							</li>
							<li className="nav-item">
								<a href="#" className="nav-link">
									<i className="nav-icon far fa-circle text-info" />
									<p>Informational</p>
								</a>
							</li>
						</ul>
					</nav>
					{/* /.sidebar-menu */}
				</div>
				{/* /.sidebar */}
			</aside>
		</>
	);
}
import React from "react";
import { useReactTable } from "@tanstack/react-table";

const Profesionales = () => {
	useReactTable({
		data: [],
		columns: [],
	});
	return (
		<div className="content-wrapper">
			<div className="content-header">
				<div className="container-fluid">
					<div className="row mb-2">
						<div className="col-sm-6">
							<h1 className="m-0">Profesionales</h1>
						</div>
					</div>
				</div>
			</div>
			<section className="content">
				<div className="container-fluid">
					<div className="d-flex justify-content-end mb-3">
						<div className="row">
							{/* <div className="col">
								<input
									value={globalFilter || ""}
									onChange={(e) =>
										setGlobalFilter(e.target.value)
									}
									placeholder="Buscar profesionales..."
									className="form-control mb-3"
								/>
							</div> */}
							<div className="col">
								<button
									type="button"
									className="btn btn-primary align-self-end"
									id="abrirModalAgregar"
									onClick={() => handleAgregar()}>
									<i className="fa-regular fa-square-plus"></i>{" "}
									Agregar
								</button>
							</div>
						</div>
					</div>
					<div>
						<div className="table-responsive">
							<table className="table table-striped table-hover table-borderless table-primary align-middle">
								<thead className="table-light">
									<tr>
										<th>Column 1</th>
										<th>Column 2</th>
										<th>Column 3</th>
									</tr>
								</thead>
								<tbody className="table-group-divider">
									<tr className="table-primary">
										<td scope="row">Item</td>
										<td>Item</td>
										<td>Item</td>
									</tr>
									<tr className="table-primary">
										<td scope="row">Item</td>
										<td>Item</td>
										<td>Item</td>
									</tr>
								</tbody>
								<tfoot></tfoot>
							</table>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Profesionales;

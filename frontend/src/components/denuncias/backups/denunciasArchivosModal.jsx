import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import apiConnection from "../../../../../backend/functions/apiConnection";
import { useForm } from "react-hook-form";

const DenunciasArchivosModal = ({
	showModalArchivos,
	closeModalArchivos,
	dataSeguimiento,
}) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm();

	const [archivos, setArchivos] = useState([]);
	const user = JSON.parse(localStorage.getItem("user")) || {};

	// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ ARCHIVOS ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
	// const [selectedFiles, setSelectedFiles] = useState([]);

	// const onSelectFile = (event) => {
	// 	const selectedFiles = event.target.files;
	// 	const selectedFilesArray = Array.from(selectedFiles);

	// 	const filesArray = selectedFilesArray.map((file) => {
	// 		// return URL.createObjectURL(file);
	// 		return {
    //             url: URL.createObjectURL(file),
    //             name: file.name,
	// 			type: file.type,
	// 		};
	// 	});

	// 	setSelectedFiles((previousFiles) => previousFiles.concat(filesArray));

	// 	// FOR BUG IN CHROME
	// 	event.target.value = "";
	// };

	function deleteHandler(fileUrl) {
		setSelectedFiles((previousFiles) =>
			previousFiles.filter((file) => file.url !== fileUrl)
		);
	}
	// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ ARCHIVOS ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

	return (
		<>
			<div
				className={`modal fade ${showModalArchivos ? "show" : ""}`}
				tabIndex="-1"
				style={{ display: showModalArchivos ? "block" : "none" }}
				id="staticBackdrop"
				data-bs-target="#staticBackdrop"
				data-bs-backdrop="static"
				data-bs-keyboard="false"
				aria-labelledby="staticBackdropLabel"
				aria-hidden={!showModalArchivos}>
				<div
					className="modal-dialog modal-xl modal-dialog-scrollable"
					style={{ maxHeight: "75vh", overflowY: "auto" }}>
					<div className="modal-content">
						<div
							className="modal-header"
							style={{ background: "#efb68b" }}>
							<h5 className="modal-title">Archivos</h5>
							<button
								type="button"
								className="btn-close"
								aria-label="Close"
								onClick={closeModalArchivos}></button>
						</div>
						<div className="modal-body">
							<div className="container-fluid p-0">
								{/* <div className="row mb-3">
									<div className="col-2">
										<label className="btn btn-success position-relative">
											<i className="fa-solid fa-square-plus fa-lg"></i>
											{"  "}
											Archivos
											{selectedFiles.length > 0 && (
												<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
													{selectedFiles.length}
												</span>
											)}
											<input
												type="file"
												name="files"
												onChange={onSelectFile}
												multiple
												accept="image/png , image/jpeg, image/webp, application/pdf"
												style={{ display: "none" }}
											/>
										</label>
									</div>
								</div> */}
								<div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
									{selectedFiles &&
										selectedFiles.map((file, index) => {
											const fileIcon = file.type.includes(
												"pdf"
											)
												? "../../../assets/img/icon_pdf_512.png"
												: file.url;
											return (
												<div
													className="col"
													key={file.url}>
													<div
														className="card shadow h-100"
														style={{
															maxWidth:
																"21.25rem",
															minWidth:
																"21.25rem",
															maxHeight: "9rem",
															minHeight: "9rem",
														}}>
														<div className="row g-0 h-100">
															<div className="col-md-4 p-1 d-flex justify-content-center align-items-center">
																<img
																	style={{
																		width: "100%",
																		objectFit:
																			"cover",
																		borderRadius:
																			".25rem",
																		maxHeight:
																			"7rem",
																	}}
																	className="img-fluid rounded-start"
																	src={
																		fileIcon
																	}
																	alt={
																		file.type.includes(
																			"pdf"
																		)
																			? "PDF icon"
																			: "Preview"
																	}
																/>
															</div>
															<div className="col-md-8 d-flex flex-column">
																<div className="card-body p-2 flex-grow-1">
																	<div className="d-flex justify-content-between align-items-center">
																		<h6
																			className="card-title"
																			style={{
																				overflow:
																					"hidden",
																				textOverflow:
																					"ellipsis",
																				whiteSpace:
																					"nowrap",
																				fontSize:
																					"smaller",
																			}}
																			title={
																				file.name
																			}>
																			{
																				file.name
																			}
																		</h6>

																		<span
																			className="badge rounded-circle bg-danger d-flex justify-content-center align-items-center mb-2"
																			style={{
																				width: "1.65rem",
																				height: "1.65rem",
																				cursor: "pointer",
																			}}
																			onClick={() =>
																				deleteHandler(
																					file.url
																				)
																			}>
																			<i className="fa-solid fa-trash text-white fa-lg"></i>
																		</span>
																	</div>
																	<textarea
																		className="form-control"
																		style={{
																			minHeight:
																				"5.5rem",
																			maxHeight:
																				"5.5rem",
                                                                            resize: "none",
                                                                            fontSize: "smaller",
																		}}
																		placeholder="Descripción"></textarea>
																</div>
															</div>
														</div>
													</div>
												</div>
											);
										})}
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<div className="row w-100">
								<div className="col d-flex justify-content-end">
									<button
										type="button"
										className="btn btn-secondary"
										data-bs-dismiss="modal"
										onClick={closeModalArchivos}>
										Cerrar
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default DenunciasArchivosModal;

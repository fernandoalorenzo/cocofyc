function Logo () {
    return (
		<img
			className="brand-image elevation-3"
			// src="./src/assets/img/LogoCOCOFYC.png"
			src="./src/assets/img/LogoCOCOFYC_redondo.png"
			alt="logo"
			style={{ opacity: ".8" }}
		/>
	);
}

function LogoInformes () {
    return (
        <img
            className="brand-image elevation-3"
            src="./src/assets/img/LogoCOCOFYC_horizontal.png"
            alt="logo"
        />
    );
}

export { Logo, LogoInformes }
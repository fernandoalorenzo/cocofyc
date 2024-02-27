import { useEffect } from "react";
import Swal from "sweetalert2";

const sweetAlert = (icon, title, message, timerDuration = 1500, showConfirmation = false) => {
	Swal.fire({
		icon: icon,
		title: title,
		text: message,
		showConfirmButton: showConfirmation,
		timer: timerDuration,
	});
};

export default sweetAlert;
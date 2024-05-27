import cron from "node-cron";
import nodemailer from "nodemailer";
// import moment from "moment";
import moment from "moment-timezone";
import fs from "fs";

// Configuración del momento de ejecución del script
// Segundos (0-59) Minutos (0-59) Horas (0-23) Días del mes (1-31) Meses (1-12) Días de la semana (0-7, donde 0 y 7 representan Domingo)
// "0 8 * * *" // se ejecutara a las 08.00
// "0 1 * * *" // se ejecutara a las 01.00

// const momento = "00 00 09 * * *"; // se ejecutara a las 09.00

// Zona horaria local deseada
const desiredTimezone = "America/Argentina/Buenos_Aires";

// Determinar la zona horaria del servidor
const serverTimezone = moment.tz.guess();

// Calcular la diferencia horaria entre el servidor y la zona horaria local deseada
const serverOffset = moment.tz(serverTimezone).utcOffset();
// const serverOffset = moment.tz("America/New_York").utcOffset();
const desiredOffset = moment.tz(desiredTimezone).utcOffset();
const timezoneDifference = (desiredOffset - serverOffset) / 60; // Diferencia en horas

// Establecer la hora deseada
const horaDeseada = 23;
const minutoDeseado = 0;
const segundoDeseado = 0;

// const desiredTime = moment().startOf("day").add(9 - timezoneDifference, "hours");
const desiredTime = moment()
	.startOf("day")
	.add(horaDeseada - timezoneDifference, "hours")
	.add(minutoDeseado, "minutes")
	.add(segundoDeseado, "seconds");


// Extraer los componentes de hora, minutos y segundos de la hora deseada
const year = "*";
const month = "*"; // Los meses en JavaScript empiezan en 0
const day = "*";
const hour = desiredTime.hours().toString().padStart(2, "0"); // Formatear a dos dígitos
const minute = desiredTime.minutes().toString().padStart(2, "0"); // Formatear a dos dígitos
const second = "00";

// Formatear los componentes en una cadena cron
const cronTime = `${second} ${minute} ${hour} ${day} ${month} ${year}`;

// Lee la imagen como base64
const imgLogo = fs.readFileSync(
	"./../frontend/assets/img/LogoCOCOFYC_horizontal.png",
	{ encoding: "base64" }
);

let nombreInstitucion;
let emailInstitucion;

// Función para obtener el mes y el día actual
const getMesDia = () => {
	const currentDate = moment();
	const month = currentDate.format("MM");
	const day = currentDate.format("DD");
	return { month, day };
};

// Función para obtener los profesionales cuyo cumpleaños coincide con el día y el mes actual
const getprofesionalesCumpleHoy = async () => {
	try {
		// Obtener el mes y el día actual
		const { month, day } = getMesDia();

		// Realizar la solicitud a la API
		const response = await fetch(
			`http://localhost:5000/api/profesionales/${month}/${day}`
		);

		if (!response.ok) {
			throw new Error("Error al obtener los profesionales");
		}

		// Procesar la respuesta
		const data = await response.json();

		return data.data;
	} catch (error) {
		console.error("Error:", error.message);
		return [];
	}
};

// Función para enviar correos electrónicos
const transporter = nodemailer.createTransport({
	service: "Gmail",
	host: "smtp.gmail.com",
	port: 465,
	auth: {
		user: "fernando.a.lorenzo@gmail.com",
		pass: "estfibwgrbaihvxm",
	},
});

// Función para enviar el correo electrónico
const sendEmail = async (profesional) => {
	try {
		const mailOptions = {
			from: nombreInstitucion + " <" + emailInstitucion + ">",
			to: profesional.email,
			subject: "Feliz Cumpleaños!",
			text: `¡Feliz cumpleaños, ${profesional.nombre}! Esperamos que tengas un día maravilloso.`,
			html: `
                <div style="font-family: Arial, sans-serif;">
                    <img src="data:image/png;base64,${imgLogo}" alt="Logo Institucional" style="width: 100%;">
                    <h1 style="color: #336699;">¡Feliz cumpleaños, ${profesional.nombre}!</h1>
                    <p style="font-size: 16px;">Esperamos que tengas un día maravilloso y lleno de alegría.</p>
                    <p style="font-size: 16px;">Atentamente,</p>
                    <p style="font-size: 16px;">Equipo de ${nombreInstitucion}</p>
                </div>
            `,
		};

		const info = await transporter.sendMail(mailOptions);
		// console.log("Email sent to", profesional.nombre, ":", info.response);
	} catch (error) {
		console.error("Error sending email to", profesional.nombre, ":", error);
	}
};

const fetchParametros = async () => {
	try {
		const endpoint = "http://localhost:5000/api/parametros/sinToken/1";
		const method = "GET";
		const headers = {
			"Content-Type": "application/json",
		};

		// Realizar la solicitud
		const response = await fetch(endpoint, {
			method: method,
			headers: headers,
		});

		// Verificar si la solicitud fue exitosa
		if (response.ok) {
			const data = await response.json(); // Convertir la respuesta a JSON
			emailInstitucion = data.data.email;
			nombreInstitucion = data.data.establecimiento;
		} else {
			// Manejar errores de la solicitud
			console.error(
				"Error al obtener los datos de los parametros:",
				response.statusText
			);
		}
	} catch (error) {
		console.error("Error al obtener los datos de los parametros:", error);
	}
};

fetchParametros().then(() => {
	cron.schedule(cronTime, async () => {
		await sendBirthdayEmails();
	});
});

const sendBirthdayEmails = async () => {
	try {
		// Obtener los profesionales con cumpleaños hoy
		const profesionales = await getprofesionalesCumpleHoy();

		// Enviar un correo por cada profesional
		for (const profesional of profesionales) {
			await sendEmail(profesional);
			console.log("Correo enviado a ", profesional.nombre);
		}

		console.log(
			"¡Correos electrónicos de saludos por cumpleaños enviados satisfactoriamente!"
		);
	} catch (error) {
		console.error("Error sending birthday emails:", error);
	}
};

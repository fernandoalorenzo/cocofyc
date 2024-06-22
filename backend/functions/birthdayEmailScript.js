import cron from "node-cron";
import nodemailer from "nodemailer";
import moment from "moment-timezone";
import fs from "fs";
import { config } from "dotenv";
config();

const API_ENDPOINT = process.env.API_ENDPOINT;
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT, 10);
const EMAIL_SECURE = process.env.EMAIL_SECURE === "true";
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_MAX_HORA = parseInt(process.env.EMAIL_MAX_HORA, 10);

// Zona horaria local deseada
const desiredTimezone = "America/Argentina/Buenos_Aires";

// Determinar la zona horaria del servidor
const serverTimezone = moment.tz.guess();

// Calcular la diferencia horaria entre el servidor y la zona horaria local deseada
const serverOffset = moment.tz(serverTimezone).utcOffset();
const desiredOffset = moment.tz(desiredTimezone).utcOffset();
const timezoneDifference = (desiredOffset - serverOffset) / 60; // Diferencia en horas

let transporter;
let nombreInstitucion;
let emailInstitucion;
let birthday_hora;
let birthday_minutos;

// Función para obtener el mes y el día actual
const getMesDia = () => {
	const currentDate = moment();
	const month = currentDate.format("MM");
	const day = currentDate.format("DD");
	return { month, day };
};

// Lee la imagen como base64
const imgLogo = fs.readFileSync(
	process.env.NODE_ENV === "production"
		? `${process.env.PROD_IMAGES_PATH}/LogoCOCOFYC_horizontal.png`
		: `${process.env.DEV_IMAGES_PATH}/LogoCOCOFYC_horizontal.png`,
	{ encoding: "base64" }
);

// Función para obtener los parámetros
const fetchParametros = async () => {
	try {
		const endpoint = `${API_ENDPOINT}/parametros/sinToken/1`;
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
			const data = await response.json();
			emailInstitucion = data.data.email;
			nombreInstitucion = data.data.establecimiento;
			birthday_hora = data.data.birthday_hora;
			birthday_minutos = data.data.birthday_minutos;
			
			transporter = nodemailer.createTransport({
				service: "NeoIt",
				host: EMAIL_HOST,
				port: EMAIL_PORT,
				secure: EMAIL_SECURE,
				auth: {
					user: EMAIL_USER,
					pass: EMAIL_PASSWORD,
				},
			});

			// Calcular la hora deseada
			let horaDeseada = Number(birthday_hora);
			let minutoDeseado = Number(birthday_minutos);
			let segundoDeseado = 0;

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
			const second = desiredTime.seconds().toString().padStart(2, "0"); // Formatear a dos dígitos

			// Formatear los componentes en una cadena cron
			const cronTime = `${second} ${minute} ${hour} ${day} ${month} ${year}`;

			// Programar la tarea cron
			cron.schedule(cronTime, async () => {
				await sendBirthdayEmails();
			});
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

fetchParametros();

// Función para obtener los profesionales cuyo cumpleaños coincide con el día y el mes actual
const getProfesionalesCumpleHoy = async () => {
	try {
		const { month, day } = getMesDia();

		const response = await fetch(
			`${API_ENDPOINT}/profesionales/${month}/${day}`
		);

		if (!response.ok) {
			throw new Error("Error al obtener los profesionales");
		}

		const data = await response.json();

		return data.data;
	} catch (error) {
		console.error("Error:", error.message);
		return [];
	}
};

// Función para enviar el correo electrónico
const sendEmail = async (profesional) => {
	try {
		const mailOptions = {
			from: `${nombreInstitucion} <${emailInstitucion}>`,
			to: profesional.email,
			subject: "Feliz Cumpleaños!",
			text: `¡Feliz cumpleaños, ${profesional.nombre}! Esperamos que tengas un día maravilloso.`,
			html: `
                <div style="font-family: Arial, sans-serif;">
                    <img src="data:image/png;base64,${imgLogo}" alt="Logo Institucional" style="width: 100%;">
                    <h1 style="color: #336699;">¡Feliz cumpleaños, ${profesional.nombre}!</h1>
                    <p style="font-size: 16px;">Esperamos que tengas un día maravilloso y lleno de alegría.</p>
                    <p style="font-size: 16px;">Atentamente,</p>
                    <p style="font-size: 16px;">Equipo de <strong>${nombreInstitucion}</strong></p>
                </div>
            `,
		};

		await transporter.sendMail(mailOptions);
		console.log("Correo enviado a", profesional.nombre);
	} catch (error) {
		console.error("Error sending email to", profesional.nombre, ":", error);
	}
};

// Función para enviar los correos electrónicos de cumpleaños
const sendBirthdayEmails = async () => {
	try {
		// Obtener los profesionales con cumpleaños hoy
		const profesionales = await getProfesionalesCumpleHoy();

		// Si no hay profesionales con cumpleaños hoy, no hace nada
		if (profesionales.length === 0) {
			console.log("No se encontraron profesionales con cumpleaños hoy.");
			return;
		}

		// Calcular el intervalo de tiempo entre envíos para no exceder el límite por hora
		const interval = 3600000 / EMAIL_MAX_HORA; // Intervalo en milisegundos (3600000 ms = 1 hora)

		// Función para enviar correos con un retardo
		const sendEmailsWithDelay = async (profesionales) => {
			for (let i = 0; i < profesionales.length; i++) {
				await sendEmail(profesionales[i]);

				// Si no es el último correo, esperar el intervalo antes de enviar el siguiente
				if (i < profesionales.length - 1) {
					await new Promise((resolve) =>
						setTimeout(resolve, interval)
					);
				}
			}
		};

		// Enviar correos con el retardo calculado
		await sendEmailsWithDelay(profesionales);

		console.log(
			"¡Correos electrónicos de saludos por cumpleaños enviados satisfactoriamente!"
		);

	} catch (error) {
		console.error("Error sending birthday emails:", error);
	}
};
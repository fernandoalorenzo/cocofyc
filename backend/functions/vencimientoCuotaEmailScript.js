import { Sequelize } from "sequelize";
import cron from "node-cron";
import nodemailer from "nodemailer";
import moment from "moment";
import fs from "fs";
import Cuota from "./../models/cuotasModel.js";
import Profesionales_Cuotas from "./../models/profesionales_cuotasModel.js";
import Profesional from "./../models/profesionalesModel.js";
import { config } from "dotenv";
config();

const API_ENDPOINT = process.env.API_ENDPOINT;
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT, 10);
const EMAIL_SECURE = process.env.EMAIL_SECURE === "true";
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_MAX_HORA = parseInt(process.env.EMAIL_MAX_HORA, 10); // Nueva constante

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
let aviso_cuota_hora;
let aviso_cuota_minutos;

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
			aviso_cuota_hora = data.data.aviso_cuota_hora;
			aviso_cuota_minutos = data.data.aviso_cuota_minutos;

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
			let horaDeseada = Number(aviso_cuota_hora);
			let minutoDeseado = Number(aviso_cuota_minutos);
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
				await enviarAvisoVencimientoCuotas();
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

// Función para enviar correos electrónicos
const enviarAvisoVencimientoCuotas = async () => {
	try {
		const cuota = await Cuota.findOne({
			where: {
				vencimiento: {
					[Sequelize.Op.between]: [
						moment().startOf("month").toDate(),
						moment().endOf("month").toDate(),
					],
				},
			},
		});
		if (!cuota) {
			console.log("No hay cuotas que venzan este mes.");
			return;
		}

		// Encontrar los profesionales asociados a esa cuota
		const profesionalesCuotas = await Profesionales_Cuotas.findAll({
			where: {
				cuota_id: cuota.id,
			},
		});

		if (profesionalesCuotas.length === 0) {
			console.log("No hay profesionales asociados a esta cuota.");
			return;
		}

		// Obtener los datos de los profesionales
		const profesionalesIds = profesionalesCuotas.map(
			(pc) => pc.profesional_id
		);
		const profesionales = await Profesional.findAll({
			where: {
				id: {
					[Sequelize.Op.in]: profesionalesIds,
				},
			},
		});

		// Calcular el intervalo de tiempo entre envíos para no exceder el límite por hora
		const interval = 3600000 / EMAIL_MAX_HORA; // Intervalo en milisegundos (3600000 ms = 1 hora)

		// Función para enviar correos con un retardo
		const sendEmailsWithDelay = async (profesionales) => {
			for (let i = 0; i < profesionales.length; i++) {
				await sendEmail(profesionales[i], cuota);

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
			"Avisos de vencimiento de cuotas enviados satisfactoriamente."
		);
	} catch (error) {
		console.error(
			"Error al enviar los avisos de vencimiento de cuotas:",
			error
		);
	}
};

// Función para enviar el correo electrónico
const sendEmail = async (profesional, cuota) => {
	try {
		const vencimientoFormateado = moment(cuota.vencimiento).format(
			"DD/MM/YYYY"
		);

		const mailOptions = {
			from: `${nombreInstitucion} <${emailInstitucion}>`,
			to: profesional.email,
			subject: "Aviso de Vencimiento de Cuota - " + nombreInstitucion,
			text: `Estimado/a ${profesional.nombre}`,
			html: `
                <div style="font-family: Arial, sans-serif;">
                    <img src="data:image/png;base64,${imgLogo}" alt="Logo Institucional" style="width: 100%;">
                    <p style="color: #336699; font-size: 14px;"><strong>Estimado/a, ${profesional.nombre}</strong></p>
                    <p style="font-size: 14px;">Este es un aviso de vencimiento de la cuota ${cuota.cuota} que tiene vencimiento el dia <strong>${vencimientoFormateado}</strong>.</p>
                    <p style="font-size: 16px;">Atentamente, equipo de <strong>${nombreInstitucion}</strong></p>
                </div>
            `,
		};

		await transporter.sendMail(mailOptions);
		console.log(`Correo electrónico enviado a ${profesional.nombre}`);
	} catch (error) {
		console.error("Error sending email to", profesional.nombre, ":", error);
	}
};
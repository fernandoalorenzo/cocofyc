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

// Configuración del momento de ejecución del script
// Segundos (0-59) Minutos (0-59) Horas (0-23) Días del mes (1-31) Meses (1-12) Días de la semana (0-7, donde 0 y 7 representan Domingo)
// const momento = "0 0 10 1 * *"; // Ejecutar los días 1 a las 10:00 AM
const momento = "32 16 20 27 * * "; // Ejecutar los días 27 a las xx:xx AM

// Lee la imagen como base64
const imgLogo = fs.readFileSync(
	"./../frontend/assets/img/LogoCOCOFYC_horizontal.png",
	//"./public/assets/img/LogoCOCOFYC_horizontal.png",
	{ encoding: "base64" }
);

let nombreInstitucion;
let emailInstitucion;

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

// Función para enviar correos electrónicos
const enviarAvisoVencimientoCuotas = async () => {
	try {
		// Obtener el ID de la cuota que vence este mes
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

		// Enviar correos electrónicos a los profesionales
		for (const profesional of profesionales) {
			const vencimientoFormateado = moment(
				cuota.vencimiento
			).format("DD/MM/YYYY");

			const mailOptions = {
				from: nombreInstitucion + " <" + emailInstitucion + ">",
				to: profesional.email,
				subject:
					"Aviso de Vencimiento de Cuota - " + nombreInstitucion,
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
		}

		console.log("----------------------------------");
		console.log(
			"Avisos de vencimiento de cuotas enviados satisfactoriamente."
		);
		console.log("----------------------------------");
	} catch (error) {
		console.error(
			"Error al enviar los avisos de vencimiento de cuotas:",
			error
		);
	}
};

fetchParametros().then(() => {
	// Programar la ejecución del aviso de vencimiento de cuotas
	cron.schedule(momento, async () => {
		await enviarAvisoVencimientoCuotas();
	});
});

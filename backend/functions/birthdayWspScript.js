// import { Client, LocalAuth } from "whatsapp-web.js";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";
import moment from "moment";

// Configurar el cliente de WhatsApp
const client = new Client({
	authStrategy: new LocalAuth(),
});

// Función para iniciar sesión en WhatsApp
const iniciarSesion = () => {
	client.on("qr", (qr) => {
		console.log(
			"Escanea el siguiente código QR con tu teléfono para iniciar sesión:"
		);
		qrcode.generate(qr, { small: true });
	});

	client.on("ready", () => {
		console.log("¡Sesión iniciada en WhatsApp!");
		// Llamar a la función para enviar el saludo
		// enviarSaludo();
	});

	client.on("auth_failure", () => {
		console.error(
			"Error de autenticación en WhatsApp. Por favor, revisa tus credenciales."
		);
	});

	client.initialize();
};

// Función para sanitizar el número de teléfono
const sanitizarNumero = (numero) => {
	// Eliminar caracteres no numéricos
	const numeroSoloDigitos = numero.replace(/\D/g, "");

	// Añadir el código de país si no está presente
	let numeroFinal = numeroSoloDigitos;
	if (!numeroSoloDigitos.startsWith("+")) {
		numeroFinal = `+${numeroSoloDigitos}`;
	}

	return numeroFinal;
};

// Función para enviar un saludo al número de teléfono especificado
	const enviarSaludo = async () => {
		const numeroTelefono = "5493412030485"; // Número de teléfono al que se enviará el saludo
		const numeroSanitizado = sanitizarNumero(numeroTelefono) + "@c.us"; // Número de teléfono formateado, final
		const mensaje =	"¡Hola! ¿Cómo estás? Este es un saludo desde WhatsApp Web."; // Mensaje de saludo
		
		try {
			await client.sendMessage(numeroSanitizado, mensaje);
			console.log(`Saludo enviado al número ${numeroSanitizado}`);
		} catch (error) {
			console.error("Error al enviar el saludo:", error);
		}
	};

// Iniciar sesión en WhatsApp
iniciarSesion();
const apiConnection = async (endpoint, direction, method, body, headers) => {
	try {
		// Crear una nueva URL con el endpoint
		const url = new URL(endpoint);
		url.pathname += direction;

		// Verifica si existe la propiedad 'Authorization' en el objeto de headers
		if (!headers || !headers.Authorization) {
			throw new Error("Token no encontrado en los encabezados");
		}

		// Verifica si existe la propiedad 'Authorization' en el objeto de headers
		// if (
		// 	!/usuarios|roles/.test(endpoint) &&
		// 	(!headers || !headers.Authorization)
		// ) {
		// 	throw new Error("Token no encontrado en los encabezados");
		// }

		if (endpoint == "http://localhost:5000/api/denuncias/seguimiento/archivos/") {
			console.log("***************************************************************************");
			console.log("endpoint: ", endpoint);
			console.log("direction: ", direction);
			console.log("method: ", method);
			console.log("body: ", body);
			console.log("headers: ", headers);
			console.log("url: ", url.href);
			console.log("***************************************************************************");
			return;
		}

		const response = await fetch(url.href, {
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined,
		});

		if (!response.ok) {
			throw new Error(`Error ${response.status}: ${response.statusText}`);
		}

		const responseData = await response.json();

		if (responseData.error) {
			// Si hay un error en la respuesta, lanzar un error con el mensaje de error
			throw new Error(responseData.error);
		}

		return responseData;
	} catch (error) {
		throw new Error(`Error en la conexión API: ${error.message}`);
	}
};

export default apiConnection;

///////////////////////////////
// EJEMPLO DE IMPLEMENTACION
///////////////////////////////
// HACER IMPORTACION DE LA FUNCION apiConnection
// import apiConnection from "../../../../backend/functions/apiConnection";
///////////////////////////////

// const fetchUserInfo = async (postUserId) => {
// 	try {
// 		const endpoint = "http://127.0.0.1:5000/api/users/";
// 		const filter = props.usuario; // "" si es para POST
// 		const method = "GET";

// ******** ELEGIR CASO SEGUN CORRESPONDA ********
// 		const body = false; // FALSE para solicitud GET o DELETE
// -----------------------------------------------
//      const body = {
//          titulo: editedTitle,
//          descripcion: editedDescription,
//          imagen: editedImage,
//      };
// ***********************************************

// 		const headers = {
// 			"Content-Type": "application/json",
// 			Authorization: localStorage.getItem("token"),
// 		};

// 		const userData = await apiConnection(
// 			endpoint,
// 			filter,
// 			method,
// 			body,
// 			headers
// 		);
// 	} catch (error) {
// 		console.error("Error al intentar obtener datos del usuario: ", error);
// 	}
// };
///////////////////////////////

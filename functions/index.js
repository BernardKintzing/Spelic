const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.createStudentAccountFunction = functions.https.onCall(
	(data, context) => {

		console.log("YATTA: " + data.text);

		return({text: data.text})

		// response.set('Access-Control-Allow-Origin', 'http://localhost:5050/');
		// response.set('Access-Control-Allow-Credentials', 'true');
	  
		// // if (req.method === 'OPTIONS') {
		//   // Send response to OPTIONS requests
		//   response.set('Access-Control-Allow-Methods', 'GET');
		//   response.set('Access-Control-Allow-Headers', 'Authorization');
		//   response.set('Access-Control-Max-Age', '3600');
		//   response.status(204).send("YATTA");
		// } else {
		// 	response.send('Hello World!');
		// }

		// cors(request, response, () => {
		// 	response.set("Access-Control-Allow-Origin", "*");
		// 	response.set("Access-Control-Allow-Methods", "GET");
		// 	response.set("Access-Control-Allow-Headers", "Content-Type");
		// 	response.set("Access-Control-Max-Age", "3600");
			// console.log(data);
		// 	response.status(200).send("YAAAA");
		// });
	}
);

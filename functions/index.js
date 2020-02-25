const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.createStudentAccountFunction = functions.https.onRequest(
	(data, request, response) => {
		cors(request, response, () => {
			console.log(data);
		});
	}
);

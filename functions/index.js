const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.createStudentAccountFunction = functions.https.onCall(
	(data, context) => {
		return admin
			.auth()
			.createUser({
				email: data.name + "@" + data.teacherName + ".com",
				displayName: data.name,
				password: data.password
			})
			.then(function(userRecord) {
				// See the UserRecord reference doc for the contents of userRecord.
				console.log("Successfully created new user:", userRecord.uid);
				return { uid: userRecord.uid };
			})
			.catch(function(error) {
				console.log("Error creating new user:", error);
				return { error: error };
			});
	}
);

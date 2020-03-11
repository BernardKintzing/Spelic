const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();


/**
 * @description Attempt to create a student account using 
 * Firebase Admin function. 
 * @see admin.auth().createUser()
 * 
 * @async
 * @function
 * @param {String} name displayName for student account
 * @param {String} password the password for new student account
 * @param {String} teacherName displayName of students teacher
 * @returns {Promise} on success the uid of the new student is 
 * returned, else an error is returned.
 * 
 * @todo rethink student email format. Current has high potential 
 * for duplicates.
 */
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
				console.log("Error creating new user: ", error);
				return { error: error };
			});
	}
);

/**
 * @description Retrieve the name of student given their uid.
 * Uses Firebase Authentication Admin functions.
 * @see admin.auth().getUser()
 * 
 * @async
 * @function retrieveStudentNamesFunction
 * @param {String} id the firebase auth id of the requested 
 * student
 * @returns {Promise} on success an array or length two is 
 * is returned in the format: [uid, displayName]. On error
 * the array is in format: ["nil", error]
 */
exports.retrieveStudentNamesFunction = functions.https.onCall(
	(data, context) => {
		return admin
			.auth()
			.getUser(data.id)
			.then(function(userRecord) {
				console.log("Successfully retreived user:", userRecord.uid);
				return [userRecord.uid, userRecord.displayName];
			})
			.catch(function(error) {
				console.log("Error retrieving student name: ", error)
				return ["nil", error];
			});
	}
);

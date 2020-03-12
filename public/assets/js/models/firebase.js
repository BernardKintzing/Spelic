// Firebase Variables
var auth = firebase.auth();
var database = firebase.database();
var functions = firebase.functions();

// Functions variables
var createStudentAccountFunction = functions.httpsCallable(
	"createStudentAccountFunction"
);

var retrieveStudentNamesFunction = functions.httpsCallable(
	"retrieveStudentNamesFunction"
);

/**
 * @description extension on Firebase Authentication
 * user object. Implements listener functionality
 * allowing seperate classes to listen for change.
 */
var authUser = {
	aInternal: null,
	aListener: function(val) {},
	set data(val) {
		this.aInternal = val;
		this.aListener(val);
	},
	get data() {
		return this.aInternal;
	},
	registerListener: function(listener) {
		this.aListener = listener;
	}
};

/**
 * @description custom variable designed to hold
 * all information for a teacher account. This
 * data is stored using Firebase Realtime database.
 */
var realtimeTeacher = {
	accountType: null,
	students: null,
	words: null
};

// Firebase Auth Functions

/**
 * @description Firebase Authentication default
 * function triggered by user sign in or sign
 * out. Updates local authUser var.
 *
 * @param {firebase.auth().user} updatedUser
 */
auth.onAuthStateChanged(function(updatedUser) {
	authUser.data = updatedUser;
});

/**
 * @description Attempt to sign in user
 *
 * @async
 * @function signInWithEmailAndPassword
 * @param {String} email
 * @param {String} password
 * @return {Promise} If successful the Firebase
 * Authentication user object is return, else error
 * is returned.
 */
async function signInWithEmailAndPassword(email, password) {
	return auth
		.signInWithEmailAndPassword(email, password)
		.then(function(result) {
			return result;
		})
		.catch(function(error) {
			return error;
		});
}

/**
 * @description Attempt to create a user account in
 * Firebase Authentication
 *
 * @async
 * @function createUserWithEmailAndPassword
 * @param {String} email
 * @param {String} password
 * @returns {Promise} On success the the Firebase
 * Authentication user object is returned, else
 * the error is returned.
 */
async function createUserWithEmailAndPassword(email, password) {
	return auth
		.createUserWithEmailAndPassword(email, password)
		.then(function(result) {
			return result;
		})
		.catch(function(error) {
			return error;
		});
}

/**
 * @description Attempt to sign out the
 * current user.
 *
 * @async
 * @function signOutFirebaseUser
 * @returns {Promise} On success a boolean true
 * is returned else the error is returned.
 */
async function signOutFirebaseUser() {
	return auth
		.signOut()
		.then(function() {
			return true;
		})
		.catch(function(error) {
			return error;
		});
}

/**
 * @description Attempt to update the display name of
 * current user. The display name is stored in the
 * users Firebase Authentication user object.
 *
 * @async
 * @function updateUserDisplayName
 * @param {String} name Updated name for current user
 * @returns {Promise} On success boolean true is returned
 * else an error is returned.
 */
async function updateUserDisplayName(name) {
	return authUser.data
		.updateProfile({
			displayName: name
		})
		.then(function() {
			return true;
		})
		.catch(function(error) {
			return error;
		});
}

/**
 * @description Attempt to send a password reset email
 * using Firebase Authentication method. This method
 * is only used to reset the password of a teacher
 * account. Student password reset is done through
 * Firebase Admin.
 * @see resetStudentPassword
 *
 * @async
 * @function sendPasswordResetEmail
 * @param {String} email teachers email.
 * @returns {Promise} Return the message to be displayed
 * to user.
 */
async function sendPasswordResetEmail(email) {
	return auth
		.sendPasswordResetEmail(email)
		.then(function() {
			return "Reset link has been emailed to " + email;
		})
		.catch(function(error) {
			return error;
		});
}

// Firebase Realtime functions

/**
 * @description create a new user account in Firebase
 * Realtime Database.
 *
 * @async
 * @function pushBlankUserToDatabase
 * @param {String} uid The unique id of the user provided
 * my Firebase Authentication.
 * @param {String} status The account type of the user
 * either ACCOUNT_TYPE_TEACHER or ACCOUNT_TYPE_STUDENT.
 * @returns {Promise} On success return the boolean true
 * else return the error.
 */
async function pushBlankUserToDatabase(uid, status) {
	return database
		.ref("users/" + uid)
		.set({
			accountType: status
		})
		.then(function() {
			return true;
		})
		.catch(function(error) {
			return error;
		});
}
/**
 * @description Attempt to add a custom word to to a teachers
 * profile in the databse.
 *
 * @async
 * @function addWordToDatabase
 * @param {String} word Teachers custom word
 * @param {String} grade The grade that the word is associated
 * with.
 * @returns {Promise} On success a boolean true is returned
 * else the error is returned
 */
async function addWordToDatabase(word, grade) {
	return database
		.ref("users/" + authUser.data.uid + "/words/" + grade)
		.push({
			word
		})
		.then(function() {
			return true;
		})
		.catch(function(error) {
			return error;
		});
}

/**
 * @description Creates the association of a student to a
 * teacher. Once the student account is created there
 * account is added to the datanse as well as the association
 * under the teachers account.
 * @see createStudentAccount
 * @see pushBlankUserToDatabase
 *
 * @async
 * @function addStudentToTeacher
 * @param {String} uid The unique identifier of the student account
 * @returns {Promise} On success true is returned, else the
 * error is returned.
 */
async function addStudentToTeacher(uid) {
	var promise = pushBlankUserToDatabase(uid, ACCOUNT_TYPE_STUDENT);

	return promise.then(function(result) {
		if (result == true) {
			return database
				.ref("users/" + authUser.data.uid + "/students/")
				.push({
					uid
				})
				.then(function() {
					return true;
				})
				.catch(function(error) {
					return error;
				});
		} else {
			// TODO: Should the error be returned to the user?
			alert(error);
		}
	});
}

/**
 * @description retrieve all the students associated with the currently
 * signed in account. First the id's are retrieved from the teachers
 * database profile, then the names are retrieved using a Firebase
 * Authentication Admin function
 * @see retrieveStudentNames
 *
 * @async
 * @function retrieveStudents
 * @returns {Promise} An array of length two is returned. Index 0 of the
 * promise holds a boolean variable true or false depending on the
 * success of the retrieval. On success the 1 index holds an array of
 * students, else an error is returned ain index 1.
 *
 * @todo Add protection to prevent this function from being called
 * if a student is signed in .
 */
async function retrieveStudents() {
	var students = [];
	return database
		.ref("users/" + authUser.data.uid + "/students/")
		.once("value")
		.then(function(snapshot) {
			snapshot.forEach(function(studentSnapshot) {
				students.push(studentSnapshot.val().uid);
			});

			var promise = retrieveStudentNames(students);
			return promise
				.then(function(result) {
					return [true, result];
				})
				.catch(function(error) {
					console.log(error);
				});
		})
		.catch(function(error) {
			return [false, error];
		});
}

/**
 * @description Retrieve a list of all custom words the 
 * teacher has added to her account.
 * 
 * @async
 * @function retrieveWords
 * @returns {Promise} On success the Firebase Database
 * snapshot of custom words is returned, else the error
 * is returned.
 * 
 * @todo error handling if authUser.data.uid is null
 * @todo catch to prevent student from calling function
 */
async function retrieveWords() {
	return database
		.ref("users/" + authUser.data.uid + "/words/")
		.once("value")
		.then(function(snapshot) {
			return snapshot;
		})
		.catch(function(error) {
			return error;
		});
}

/**
 * @description retrieve the default words for a given 
 * grade level.
 * 
 * @async
 * @function retrieveGameWords
 * @param {String} grade 
 * @returns {Promise} On success a list of default words
 * are returned, else an error is returned
 */
async function retrieveGameWords(grade) {
	var words = []
	return database
		.ref("words/" + grade)
		.once("value")
		.then(function(snapshot) {
			snapshot.forEach(function(wordSnapshot) {
				words.push([wordSnapshot.val().word, wordSnapshot.val().hint])
			});

			return words;
		})
		.catch(function(error) {
			return error;
		});
}

/**
 * @description retrieve the account type of the signed in user
 * either ACCOUNT_TYPE_TEACHER or ACCOUNT_TYPE_STUDENT.
 *
 * @async
 * @function getUserAccountType
 * @returns {Promise} An array of length two is returned. Index 0
 * of the promise holds a boolean variable true or false depending
 * on the success of the retrieval. On success Index 1 holds the
 * account type, else and error is returned in this place.
 */
async function getUserAccountType() {
	return database
		.ref("users/" + authUser.data.uid + "/accountType/")
		.once("value")
		.then(function(snapshot) {
			// Convert the snapshot into an array
			return [true, snapshot.val()];
		})
		.catch(function(error) {
			return [false, error];
		});
}

/**
 * @description Attempt to create a student account.
 * using Firebase Authentication Admin on Firebase
 * Functions.
 * @see createStudentAccountFunction
 *
 * @async
 * @function createStudentAccount
 * @param {String} studentName
 * @param {String} studentPassword
 *
 * @todo add check to make sure that only a teacher can
 * add a student.
 * @todo possibly return the error instead of alerting the user.
 */
async function createStudentAccount(studentName, studentPassword) {
	createStudentAccountFunction({
		name: studentName,
		password: studentPassword,
		teacherName: authUser.data.displayName
	})
		.then(function(result) {
			if (result.data.uid != null) {
				promise = addStudentToTeacher(result.data.uid);

				promise
					.then(function(result) {
						if (result == true) {
							alert("Student successfully created");
						} else {
							alert(result);
						}
					})
					.catch(function(error) {
						alert(error);
					});
			} else if (result.data.error != null) {
				alert(result.data.error.errorInfo.message);
			} else {
				alert("An unknown error occured");
			}
		})
		.catch(function(error) {
			alert(error);
		});
}

/**
 * @description Attempt to retrieve a list of student
 * names for a given list of student ids using Firebase
 * Authentication Admin.
 * @see retrieveStudentNamesFunction
 *
 * @async
 * @function retrieveStudentNames
 * @param {[String]} studentIDs a list of the student
 * ids which require a name
 * @returns {Promise} an array of length two is returned.
 * The 0 index holds a boolean depending on the success of
 * the retrieval. If successful index 1 holds a list of
 * student names, else this index is filled with an error.
 */
async function retrieveStudentNames(studentIDs) {
	// console.log(studentIDs)
	var studentData = [];
	var promises = [];

	for (i = 0; i < studentIDs.length; i++) {
		var promise = retrieveStudentNamesFunction({
			id: studentIDs[i]
		});
		promises.push(promise);
	}

	return Promise.all(promises).then(function(values) {
		return values;
	});
}

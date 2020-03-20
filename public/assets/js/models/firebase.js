// Firebase Variables
var auth = firebase.auth();
var database = firebase.database();
var functions = firebase.functions();

// Firebase Functions functions
var createStudentAccountFunction = functions.httpsCallable(
	"createStudentAccountFunction"
);

var retrieveStudentAuthFunction = functions.httpsCallable(
	"retrieveStudentAuthFunction"
);

/**
 * @description Hold the data on the user currently signed in
 *
 * @var currentUser
 */
var currentUser = undefined;

/**
 * @description Allow other classes to listen for changes on
 * currentUser
 *
 * @var currentUserListener
 */
var currentUserListener = {
	aListener: function(val) {},
	registerListener: function(listener) {
		this.aListener = listener;
	},
	triggerListener: function(val){
		this.aListener(val);
	}
}

//-------------- VARIABLE GETTERS & SETTERS --------------//

/**
 * @description return the account type of the currentUser
 *
 * @function currentUserIsTeacher
 * @returns {Boolean} True if the currentUser is a teacher,
 * false otherwise.
 */
function currentUserIsTeacher() {
	return currentUser.accountType == ACCOUNT_TYPE_TEACHER;
}

/**
 * @description return the account type of the currentUser
 *
 * @function currentUserIsStudent
 * @returns {Boolean} True if the currentUser is a student,
 * false otherwise.
 */
function currentUserIsStudent() {
	return currentUser.accountType == ACCOUNT_TYPE_STUDENT;
}

//----------- FIREBASE AUTHENTICATION FUNCTIONS -----------//

/**
 * @description Firebase Authentication default function
 * triggered by user sign in or sign out. On trigger the
 * currentUser vart is updated
 *
 * @param {firebase.auth().user} authUser
 */
auth.onAuthStateChanged(function(authUser) {
	if (authUser) {
		// User signed in

		// The number of async tasks that need to be completed
		tasks = 2;

		var currentUserSnapshotPromise = retrieveUserSnapshot(authUser.uid);
		currentUserSnapshotPromise.then(function(result) {
			if (result.success) {
				// Snapshot successfully retrieved

				var currentUserSnapshot = result.return;
				if (
					currentUserSnapshot.val().accountType ==
					ACCOUNT_TYPE_TEACHER
				) {
					// Teacher account
					currentUser = Object.assign({}, teacher);
					currentUser.auth = authUser;

					// Retrieve students
					var studentPromises = [];
					var studentsSnapshot = currentUserSnapshot.child(
						"students"
					);
					studentsSnapshot.forEach(function(studentSnapshot) {
						var studentPromise = retrieveStudentAuth(
							studentSnapshot.val().uid
						);
						studentPromises.push(studentPromise);
					});

					Promise.all(studentPromises).then(function(values) {
						values.forEach(function(studentPromise) {
							if (studentPromise.data[0]) {
								// Auth account successfully retrieved
								var newStudent = Object.assign({}, student);
								newStudent.auth = studentPromise.data[1];
								currentUser.students.push(newStudent);
							} else {
								// Error retrieving student auth account
								console.log(studentPromise.data[1]);
							}
						});

						tasks--
						if(!tasks) {
							currentUserListener.triggerListener(true)
						}
					});

					// Retrieve custom words
					customWordsPromise = retrieveCustomWords(
						currentUser.auth.uid
					);
					customWordsPromise.then(function(result) {
						if (result.success) {
							// Custom words successfully retrieved
							
							currentUser.words = customWords
							result.return.forEach(function(gradeSnapshot) {
								var grade = parseInt(gradeSnapshot.key);
								gradeSnapshot.forEach(function(wordSnapshot) {
									var newWord = Object.assign({}, customWord);
									newWord.word = wordSnapshot.val().word;
									newWord.hint = wordSnapshot.val().hint;

									switch (grade) {
										case FIRST_GRADE:
											currentUser.words.FIRST_GRADE.push(newWord);
											break;
										case SECOND_GRADE:
											currentUser.words.SECOND_GRADE.push(newWord);
											break;
										case THIRD_GRADE:
											currentUser.words.THIRD_GRADE.push(newWord);
											break;
										case FOURTH_GRADE:
											currentUser.words.FOURTH_GRADE.push(newWord);
											break;
										case FIFTH_GRADE:
											currentUser.words.FIFTH_GRADE.push(newWord);
											break;
									}
								});
							});
						} else {
							console.log("Error retrieving custom words.")
						}

						tasks--
						if(!tasks) {
							currentUserListener.triggerListener(true)
						}
					});
				} else if (
					currentUserSnapshot.val().accountType ==
					ACCOUNT_TYPE_STUDENT
				) {
					// Student account
					currentUser = Object.assign({}, student);
					currentUser.auth = authUser;
				}
			} else {
				// Error retrieving snapshot
				console.log("Error retriving user snapshot.")
			}
		});
	} else {
		// User signed out
		currentUser = undefined;
		currentUserListener.triggerListener(false)
	}
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
	return currentUser.auth
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

//-------------- FIREBASE REALTIME FUNCTIONS --------------//

/**
 * @description retrieve all data for user with a given uid
 *
 * @async
 * @function
 * @param {String} uid The unique id of the user provided
 * by Firebase Authentication.
 * @returns {asyncReturn} Either the snapshot of the user
 * or an error
 */
async function retrieveUserSnapshot(uid) {
	var result = asyncReturn;
	return database
		.ref("users/" + uid)
		.once("value")
		.then(function(snapshot) {
			result.success = true;
			result.return = snapshot;
			return result;
		})
		.catch(function(error) {
			result.success = false;
			result.return = error;
			return result;
		});
}

/**
 * @description Retrieve a list of all custom words the
 * teacher has added to her account.
 *
 * @async
 * @function retrieveCustomWords
 * @param {auth.uid} uid The unique identifier for the
 * requested accounts custom words.
 * @returns {Promise} returns an asyncPromise object
 * with the success of the request along with the result
 *
 * @todo catch to prevent student from calling function
 */
async function retrieveCustomWords(uid) {
	var result = asyncReturn;
	return database
		.ref("users/" + uid + "/words/")
		.once("value")
		.then(function(snapshot) {
			result.success = true;
			result.return = snapshot;
			return result;
		})
		.catch(function(error) {
			result.success = false;
			result.return = error;
			return result;
		});
}

/**
 * @description create a new user account in Firebase
 * Realtime Database.
 *
 * @async
 * @function pushBlankUserToDatabase
 * @param {String} uid The unique id of the user provided
 * by Firebase Authentication.
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
		.ref("users/" + currentUser.auth.uid + "/words/" + grade)
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
				.ref("users/" + currentUser.auth.uid + "/students/")
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
	var words = [];
	return database
		.ref("words/" + grade)
		.once("value")
		.then(function(snapshot) {
			snapshot.forEach(function(wordSnapshot) {
				words.push([wordSnapshot.val().word, wordSnapshot.val().hint]);
			});

			return words;
		})
		.catch(function(error) {
			return error;
		});
}

/**
 * @description Attempt to create a student account.
 * using Firebase Authentication Admin on Firebase
 * Functions.
 * @see createStudentAccountFunction
 * @see addStudentToTeacher
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
		teacherName: currentUser.auth.displayName
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
 * @see retrieveStudentAuthFunction
 *
 * @async
 * @function retrieveStudentAuth
 * @param {[String]} uid the unique identifier for the
 * requested student
 * @returns {Promise} an array of length two is returned.
 * The 0 index holds a boolean depending on the success of
 * the retrieval. If successful index 1 holds a list of
 * student names, else this index is filled with an error.
 */
async function retrieveStudentAuth(uid) {
	var promise = retrieveStudentAuthFunction({
		uid: uid
	});

	return promise.then(function(result) {
		return result;
	});
}

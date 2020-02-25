// Firebase Variables
var auth = firebase.auth();
var database = firebase.database();
var functions = firebase.functions();

// Functions variables
var createStudentAccountFunction = functions.httpsCallable(
	"createStudentAccountFunction"
);

// User variables
var user = {
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

// Firebase Auth Functions

// Listener method for state of user
// If user is signed in, their profile is retrieved
// If signed out, user is set to null
auth.onAuthStateChanged(function(updatedUser) {
	user.data = updatedUser;
});

// Sign user in with a given username and email
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

// Create a user account with given name, email, and password
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

// Sign out the current user
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

// Update the users display name in Firebase auth
async function updateUserDisplayName(name) {
	return user.data
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

// Send a reset email to email address
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

async function addWordToDatabase(word, grade) {
	return database
		.ref("users/" + user.data.uid + "/words/" + grade)
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

async function addStudentToTeacher(uid) {
	promise = pushBlankUserToDatabase(uid, ACCOUNT_TYPE_STUDENT);

	return promise.then(function(result) {
		if (result == true) {
			return database
				.ref("users/" + user.data.uid + "/students/")
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
			alert(error);
		}
	});
}

async function getUserAccountType() {
	console.log("in")
	return database
		.ref("users/" + user.data.uid + "/accountType/")
		.once("value")
		.then(function(snapshot) {
			// Convert the snapshot into an array
			return [true, snapshot.val()]
		})
		.catch(function(error) {
			console.log(error);
			return [false, error];
		});
}

// Interact with Firebase Functions

async function createStudentAccount(studentName, studentPassword) {
	createStudentAccountFunction({
		name: studentName,
		password: studentPassword,
		teacherName: user.data.displayName
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

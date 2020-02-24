// Firebase Variables
var auth = firebase.auth();
var database = firebase.database();

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
			return true
		})
		.catch(function(error) {
			return error
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

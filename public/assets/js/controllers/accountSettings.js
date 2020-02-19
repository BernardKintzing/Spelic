var user = firebase.auth().currentUser;
console.log(user);

firebase.auth().onAuthStateChanged(function(user) {
	console.log(user);
});

const credential = firebase.auth.EmailAuthProvider.credential(
	user.email,
	userProvidedPassword
);

// Reauthenticate User before updating password
user.reauthenticateWithCredential(credential)
	.then(function() {
		// User re-authenticated.
	})
	.catch(function(error) {
		// An error happened.
		var errorMessage = document.querySelector("#error-message");
		errorMessage.innerHTML = error.message;
	});
document
	.querySelector("#update-password")
	.addEventListener("click", function(e) {
		var email = user.email;
		// Update Password
		user.sendPasswordResetEmail(email)
			.then(function() {
				// Update successful.
			})
			.catch(function(error) {
				// An error happened.
			});
	});

function signIn() {
	errorMessage = document.querySelector("#error-message");
	email = document.querySelector("#email").value;
	password = document.querySelector("#password").value;

	firebase
		.auth()
		.signInWithEmailAndPassword(email, password)
		.then(function(result) {
			window.location.replace("/home.html");
		})
		.catch(function(error) {
			errorMessage.innerHTML = error.message;
		});
}

function forgotPassword() {
	errorMessage = document.querySelector("#error-message");
	email = document.querySelector("#email").value;

	firebase
		.auth()
		.sendPasswordResetEmail(email)
		.then(function() {
			errorMessage.innerHTML =
				"Reset link has been emailed to " + email;
		})
		.catch(function(error) {
			errorMessage.innerHTML = error.message;
		});
}

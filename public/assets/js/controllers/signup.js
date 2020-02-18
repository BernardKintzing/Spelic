function signUp() {
	errorMessage = document.querySelector("#error-message");
	name = document.querySelector("#name").value
	email = document.querySelector("#email").value
	password = document.querySelector("#password").value
	confirmPassword = document.querySelector("#confirm-password").value


	if (password == confirmPassword) {
		promise = createUserWithEmailAndPassword(name, email, password)

		promise.then(function(result) {
	
			if (result.user != null) {
				// User is successfully logged in

				// TODO: dynamically redirect user based on if 
				// user account is teacher or student.
				window.location.replace("teacherHome.html");
			} else {
				// Error attempting to sign in user
				errorMessage.innerHTML = result
			}
		})
	} else {
		errorMessage.innerHTML = "Passwords do not match"
	}
}
function signUp() {
	var errorMessage = document.querySelector("#error-message");
	var name = document.querySelector("#name").value
	var email = document.querySelector("#email").value
	var password = document.querySelector("#password").value
	var confirmPassword = document.querySelector("#confirm-password").value


	if (password == confirmPassword) {
		promise = createUserWithEmailAndPassword(email, password)

		promise.then(function(result) {
	
			if (result.user != null) {
				// User is successfully logged in

				// TODO: dynamically redirect user based on if 
				// user account is teacher or student.
				updateUserDisplayName(name)
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
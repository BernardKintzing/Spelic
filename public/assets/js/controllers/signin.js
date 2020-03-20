function signIn() {
	errorMessage = document.querySelector("#error-message")
	email = document.querySelector("#email").value
	password = document.querySelector("#password").value

	promise = signInWithEmailAndPassword(email, password)

	promise.then(function(result) {

        if (result.user != null) {
			// User is successfully logged in

			// TODO: dynamically redirect user based on if 
			// user account is teacher or student.
			if(currentUserIsTeacher()) {
				window.location.replace("teacher/home.html")
			} else if(currentUserIsStudent()) {
				window.location.replace("student/home.html")
			} else {
				console.log("Unkown user account type")
			}
        } else {
            // Error attempting to sign in user
            errorMessage.innerHTML = result
        }
    })
}

function forgotPassword() {
	errorMessage = document.querySelector("#error-message");
	email = document.querySelector("#email").value;

	promise = sendPasswordResetEmail(email)

	promise.then(function(result) {
		errorMessage.innerHTML = result
	})
}

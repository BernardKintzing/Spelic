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
			promise = getUserAccountType()

			promise.then(function(result) {
				if(result[0] == true) {
					if(result[1] == ACCOUNT_TYPE_TEACHER) {
						window.location.replace("teacher/home.html")
					} else if(result[1] == ACCOUNT_TYPE_STUDENT) {
						window.location.replace("studentHome.html")
					} else {
						alert("Unable to retrieve account type")
					}
				} else {
					alert(result[1])
				}
			})
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

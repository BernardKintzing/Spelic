function signUp() {
	errorMessage = document.querySelector("#error-message");
	name = document.querySelector("#name").value
	email = document.querySelector("#email").value
	password = document.querySelector("#password").value
	confirmPassword = document.querySelector("#confirm-password").value

    console.log("check")
	if (password == confirmPassword) {
        console.log("password confirm")
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then(function(result) {
				result.user.updateProfile({
					displayName: name
				});
				// TODO: see if the user is a teacher or student
				window.location.replace("/teacherHome.html");
			})
			.catch(function(error) {
				errorMessage.innerHTML = error.message;
			});
	} else {
        errorMessage.innerHTML = "Passwords do not match"
    }
}
var title = document.querySelector("#title")
var errorMessage = document.querySelector("#error-message")
var name = document.querySelector("#name")
var email = document.querySelector("#email")
var password = document.querySelector("#password")
var confirmPassword = document.querySelector("#confirm-password")
var submit = document.querySelector("#submit")
var forgotPassword = document.querySelector("#forgot-password")
var createAccount = document.querySelector("#create-account")

// 0: Log in
// 1: Sign up
// 2: Forgot password
var submitStatus = 0

// Submit Request
submit.addEventListener("click", function(e) {
	e.preventDefault();
	e.stopPropagation();

	if (submitStatus == 0) {
		// Log user in

		errorMessage.innerHTML = "";
		var validLogIn = true;

		// Check for valid email
		if (email.value.length == 0) {
			validLogIn = false;
			errorMessage.innerHTML = "Email is required.";
		} else {
			var check = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

			if (!check.test(email.value.toLowerCase())) {
				validLogIn = false;
				errorMessage.innerHTML = "Invalid email address.";
			}
		}

		// Check for valid password
		if (password.value.length == 0) {
			validLogIn = false;
			errorMessage.innerHTML += " Password is required.";
		}

		if (validLogIn) {
			firebase
				.auth()
				.signInWithEmailAndPassword(email.value, password.value)
				.then(function(result) {
					window.location.replace("/home.html");
				})
				.catch(function(error) {
					errorMessage.innerHTML = error.message;
				});
		}
	} else if (submitStatus == 1) {
		// Create user account

		errorMessage.innerHTML = "";
		var validSignUp = true;

		// Check for valid name
		if (name.value.length == 0) {
			validSignUp = false;
			errorMessage.innerHTML += " Name is required.";
		}

		// Check for valid email
		if (email.value.length == 0) {
			validSignUp = false;
			errorMessage.innerHTML = "Email is required.";
		} else {
			var check = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

			if (!check.test(email.value.toLowerCase())) {
				validSignUp = false;
				errorMessage.innerHTML = "Invalid email address.";
			}
		}

		// Check for valid password
		if (password.value.length == 0) {
			validSignUp = false;
			errorMessage.innerHTML += " Password is required.";
		}

		// Check for valid confirm password
		if (confirmPassword.value.length == 0) {
			validSignUp = false;
			errorMessage.innerHTML += " Confirm password is required.";
		}

		// Check if passwords match
		if (password.value != confirmPassword.value) {
			validSignUp = false;
			errorMessage.innerHTML += " Passwords do not match";
		}

		if (validSignUp) {
			firebase
				.auth()
				.createUserWithEmailAndPassword(email.value, password.value)
				.then(function(result) {
					result.user.updateProfile({
						displayName: name.value
					});
					window.location.replace("/home.html");
				})
				.catch(function(error) {
					errorMessage.innerHTML = error.message;
				});
		}
	} else if (submitStatus == 2) {
        // Forgot password

        var auth = firebase.auth();
        auth.sendPasswordResetEmail(emailAddress.value)
            .then(function() {
                errorMessage.innerHTML = "Reset link has been emailed to " + emailAddress.value
            })
            .catch(function(error) {
                var errorMessage = document.querySelector("#error-message");
                errorMessage.innerHTML = error.message;
            });
    }
});

// Create an account
createAccount.addEventListener("click", function(e) {
	e.preventDefault();
	e.stopPropagation();

	title.innerHTML = "Create Account";
	name.classList.remove("display-none");
	confirmPassword.classList.remove("display-none");
	createAccount.classList.add("display-none");
	forgotPassword.classList.add("display-none");

	submitButton.value = "Create Account";
	submitStatus = 1;
});

// Reset Password
forgotPassword.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    submitButton.value = "Reset Password";
    password.classList.add("display-none");
    forgotPassword.classList.add("display-none")
    createAccount.classList.add("display-none")
    
    submitStatus = 2;
});

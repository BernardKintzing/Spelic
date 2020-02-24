// Variable
var username = document.getElementById("name");

// Retrive current users information
user.registerListener(function(val) {
	if (val.displayName != null) {
		username.value = val.displayName;
	}
});

// Update the name of user
function updateName() {
	promise = updateUserDisplayName(username.value);

	promise.then(function(result) {
		if (result == true) {
			alert("Name successfully updated");
		} else {
			alert(result);
		}
	});
}

function updatePassword() {
	var email = user.data.email;

	if (email != null) {
		var promise = sendPasswordResetEmail(email);

		promise.then(function(result) {
			alert("Password reset email sent to: " + email);
		});
	} else {
		alert("No email found");
	}
}

function signOut() {
	var promise = signOutFirebaseUser();

	promise.then(function(result) {
		if(result = true) {
			window.location.replace("signin.html")
		} else {
			alert(result)
		}
	});
}

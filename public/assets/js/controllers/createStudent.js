var studentName = document.getElementById("student-name");
var studentPassword = document.getElementById("student-password");
var studentConfirmPassword = document.getElementById(
	"student-confirm-password"
);

// Create a student account
async function addStudentAccount() {
	var name = studentName.value;
	var password = studentPassword.value;
	var confirmPassword = studentConfirmPassword.value;

	if (password == confirmPassword) {
		createStudentAccount(name, password);
	} else {
		alert("Passwords do not match");
	}
}

var studentName = document.getElementById("student-name");
var studentPassword = document.getElementById("student-password");
var studentConfirmPassword = document.getElementById(
	"student-confirm-password"
);

// Create a student account
async function addStudentAccount() {
	createStudentAccount("name", "password")
}

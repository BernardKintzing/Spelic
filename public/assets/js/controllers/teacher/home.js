var titleHeader = document.getElementById("title-header");

var wordInputField = document.getElementById("new-word");
var sort = document.getElementById("sort");
var firstGradeSelect = document.getElementById("first-grade");
var secondGradeSelect = document.getElementById("second-grade");
var thirdGradeSelect = document.getElementById("third-grade");
var fourthGradeSelect = document.getElementById("fourth-grade");
var fifthGradeSelect = document.getElementById("fifth-grade");

firstGradeSelect.value = FIRST_GRADE;
secondGradeSelect.value = SECOND_GRADE;
thirdGradeSelect.value = THIRD_GRADE;
fourthGradeSelect.value = FOURTH_GRADE;
fifthGradeSelect.value = FIFTH_GRADE;

var username = document.getElementById("name");

var studentsList = document.getElementById("students-list");
let wordsList = document.getElementById("custom-words");

var studentName = document.getElementById("student-name");
var studentPassword = document.getElementById("student-password");
var studentConfirmPassword = document.getElementById(
	"student-confirm-password"
);

/**
 * @description listen to updates on the user status. If the
 * user is signed in we update the ui of home page.
 */
currentUserListener.registerListener(function(val) {
	if (val) {
		// User is signed in
		if (currentUserIsTeacher()) {
			// Update display name
			var displayName = currentUser.auth.displayName;
			if (displayName) {
				username.value = displayName;
				titleHeader.innerHTML = "Welcome " + displayName;
			} else {
				username.value = null;
			}

			// Update students
			studentsList.innerHTML = "";
			currentUser.students.forEach(function(student) {
				studentsList.innerHTML += "<li>" + student.auth.displayName + ", (" + student.auth.uid + ")</li>";
			});

			//Update custom words
			wordsList.innerHTML = "";

			wordsList.innerHTML += "<h3>First Grade</h3>";
			currentUser.words.FIRST_GRADE.forEach(function(word) {
				wordsList.innerHTML += "<li>" + word.word + ", " + word.hint +"</li>";
			})

			wordsList.innerHTML += "<h3>Second Grade</h3>";
			currentUser.words.SECOND_GRADE.forEach(function(word) {
				wordsList.innerHTML += "<li>" + word.word + ", " + word.hint +"</li>";
			})

			wordsList.innerHTML += "<h3>Third Grade</h3>";
			currentUser.words.THIRD_GRADE.forEach(function(word) {
				wordsList.innerHTML += "<li>" + word.word + ", " + word.hint +"</li>";
			})

			wordsList.innerHTML += "<h3>Fourth Grade</h3>";
			currentUser.words.FOURTH_GRADE.forEach(function(word) {
				wordsList.innerHTML += "<li>" + word.word + ", " + word.hint +"</li>";
			})

			wordsList.innerHTML += "<h3>Fifth Grade</h3>";
			currentUser.words.FIFTH_GRADE.forEach(function(word) {
				wordsList.innerHTML += "<li>" + word.word + ", " + word.hint +"</li>";
			})
		} else if (currentUserIsStudent) {
			// window.location.replace("student/home.html");
		} else {
			console.log("Unknown user account type.");
		}
	} else {
		// User is not signed in
		window.location.replace("/");
	}
});

/**
 * @description Update the display name of the current user.
 * @see updateUserDisplayName
 *
 * @function updateName
 */
function updateName() {
	promise = updateUserDisplayName(username.value);

	promise.then(function(result) {
		if (result == true) {
			titleHeader.innerHTML = "Welcome " + username.value;
			alert("Name successfully updated");
		} else {
			alert(result);
		}
	});
}

/**
 * @description Update the password of the current
 * user by sending a recovery link to users email.
 * Uses Firebase Authentication Function.
 * @see sendPasswordResetEmail
 *
 * @function updatePassword
 */
function updatePassword() {
	var email = currentUser.auth.email;

	if (email != null) {
		var promise = sendPasswordResetEmail(email);

		promise.then(function(result) {
			alert("Password reset email sent to: " + email);
		});
	} else {
		alert("No email found");
	}
}

/**
 * @description sign out the current user and return them
 * to the home page. Uses Firebase Authentication function.
 * @see signOutFirebaseUser
 *
 * @function signOut
 */
function signOut() {
	var promise = signOutFirebaseUser();

	promise.then(function(result) {
		if ((result = true)) {
			window.location.replace("/");
		} else {
			alert(result);
		}
	});
}

/**
 * @description create a student account using Firebase
 * Authentication methods.
 * @see createStudentAccount
 *
 * @function addStudentAccount
 *
 * @todo handle promise
 * @todo update ui with new student
 */
function addStudentAccount() {
	var name = studentName.value;
	var password = studentPassword.value;
	var confirmPassword = studentConfirmPassword.value;

	if (password == confirmPassword) {
		createStudentAccount(name, password);
	} else {
		alert("Passwords do not match");
	}
}

/**
 * @description Attempt to add a new word to the database.
 * Inputs are taken from wordInputField and from sort.
 *
 * @function addWord
 *
 * @todo Create check to make sure word input field is
 * popolated and that a grade is selected.
 * @todo update ui with new word
 */
function addWord() {
	var newWord = wordInputField.value;
	var grade = sort.options[sort.selectedIndex].value;

	var promise = addWordToDatabase(newWord, grade);

	promise.then(function(result) {
		if (result == true) {
			alert("Word successfully added");
		} else {
			alert(result);
		}
	});
}

/**
 * @description Display a modal with given id.
 *
 * @function displayModal
 * @param {String} modalName ID of modal being opened
 *
 * @todo prevent one model from opening if another is open
 */
function displayModal(modalName) {
	let modal = document.getElementById(modalName);
	modal.style.display = "block";
}

/**
 * @description Close a model with given id.
 *
 * @function closeModal
 * @param {String} modalName Id of the modal being hidden
 */
function closeModal(modalName) {
	let modal = document.getElementById(modalName);
	modal.style.display = "none";
}

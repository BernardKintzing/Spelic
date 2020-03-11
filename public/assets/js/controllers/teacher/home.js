let titleHeader = document.getElementById("title-header");

let wordInputField = document.getElementById("new-word");
let sort = document.getElementById("sort");
let firstGradeSelect = document.getElementById("first-grade");
let secondGradeSelect = document.getElementById("second-grade");
let thirdGradeSelect = document.getElementById("third-grade");
let fourthGradeSelect = document.getElementById("fourth-grade");
let fifthGradeSelect = document.getElementById("fifth-grade");

firstGradeSelect.value = FIRST_GRADE;
secondGradeSelect.value = SECOND_GRADE;
thirdGradeSelect.value = THIRD_GRADE;
fourthGradeSelect.value = FOURTH_GRADE;
fifthGradeSelect.value = FIFTH_GRADE;

let username = document.getElementById("name");

var studentName = document.getElementById("student-name");
var studentPassword = document.getElementById("student-password");
var studentConfirmPassword = document.getElementById(
	"student-confirm-password"
);

/**
 * @description listen to updates on the user status. If the
 * user is signed in we update their name across the dashboard.
 */
authUser.registerListener(function(val) {
	if (val != null) {
		if (val.displayName != null) {
			username.value = val.displayName;
			titleHeader.innerHTML = "Welcome " + val.displayName;
		} else {
			username.value = null;
		}

		populateStudents();
		populateWords();
	}
});

/**
 * @description Populate a ul with the name and id's of all
 * the students registered under a teacher.
 * @see retrieveStudents
 *
 * @function populateStudents
 *
 * @todo check data flow for unhandled errors
 */
function populateStudents() {
	let studentsList = document.getElementById("students-list");
	studentsList.innerHTML = "";

	var promise = retrieveStudents();
	promise.then(function(result) {
		if (result[0] == true) {
			for (i = 0; i < result[1].length; i++) {
				studentsList.innerHTML +=
					"<li>" +
					result[1][i].data[1].charAt(0).toUpperCase() +
					result[1][i].data[1].slice(1) +
					", (" +
					result[1][i].data[0] +
					")</li>";
			}
		} else {
			alert[result[1]];
		}
	});
}

/**
 * @description Populate ul with a list of all custom words
 * the teacher has created.
 * @see retrieveWords
 *
 * @function populateWords
 *
 * @todo check data flow for unhandled errors
 */
function populateWords() {
	let wordsList = document.getElementById("custom-words");
	wordsList.innerHTML = "";

	var promise = retrieveWords();
	promise.then(function(result) {
		result.forEach(function(gradeSnapshot) {
			let grade = parseInt(gradeSnapshot.key);
			switch (grade) {
				case FIRST_GRADE:
					wordsList.innerHTML += "<h3>First Grade</h3>";
					break;
				case SECOND_GRADE:
					wordsList.innerHTML += "<h3>Second Grade</h3>";
					break;
				case THIRD_GRADE:
					wordsList.innerHTML += "<h3>Third Grade</h3>";
					break;
				case FOURTH_GRADE:
					wordsList.innerHTML += "<h3>Fourth Grade</h3>";
					break;
				case FIFTH_GRADE:
					wordsList.innerHTML += "<h3>Fifth Grade</h3>";
					break;
			}

			gradeSnapshot.forEach(function(wordSnapshot) {
				// console.log(wordSnapshot.val())
				wordsList.innerHTML +=
					"<li>" + wordSnapshot.val().word + "</li>";
			});
		});
	});
}

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
	var email = authUser.data.email;

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

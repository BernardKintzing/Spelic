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
	if (val.displayName != null) {
        username.value = val.displayName;
        titleHeader.innerHTML = "Welcome " + val.displayName
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
            titleHeader.innerHTML = "Welcome " + username.value
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
		if(result = true) {
			window.location.replace("/")
		} else {
			alert(result)
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
    let modal = document.getElementById(modalName)
    modal.style.display = "block";
}

/**
 * @description Close a model with given id. 
 * 
 * @function closeModal
 * @param {String} modalName Id of the modal being hidden
 */
function closeModal(modalName) {
    let modal = document.getElementById(modalName)
    modal.style.display = "none";
}


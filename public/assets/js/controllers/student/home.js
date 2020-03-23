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
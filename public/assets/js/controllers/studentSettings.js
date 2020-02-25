var studentWrapper = document.getElementById("student-wrapper");

// Retrive current users information
user.registerListener(function(val) {
	populateStudents()
});


function populateStudents() {
	studentWrapper.innerHTML = "";
	promise = retrieveStudents();

	promise.then(function(result) {
		if (result[0] == true) {
			for (i = 0; i < result[1].length; i++) {
				studentWrapper.innerHTML += "<ul>" + result[1][i] + "</ul>";
			}
		} else {
			alert[result[1]];
		}
	});
}

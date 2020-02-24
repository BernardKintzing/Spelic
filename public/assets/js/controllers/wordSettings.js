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

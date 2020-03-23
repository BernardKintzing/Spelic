// Load background
particlesJS.load(
	"particles-js",
	"/assets/js/particles/particles.json",
	function() {
		console.log("particles.js loaded - callback");
	}
);

var asteroid = document.getElementById("asteroid");
asteroid.style = "position: absolute; ";
var asteroidWord = asteroid.children[0];
var playToggle = document.getElementById("play-pause");

var gameWords = [];
var isPlaying = false;
var lives = 3;
var hiddenVowel = "";

//game settings
var vowels = ["a", "e", "i", "o", "u"];
var speed = 1;
var currentPos =
	-20 * parseFloat(getComputedStyle(document.documentElement).fontSize);
var motionInterval = undefined;

// TODO: retrieve users progress, game words, and custom
// words on completion of all promises start the game
var promise = retrieveGameWords(FIRST_GRADE);
promise.then(function(result) {
	if (result.success) {
		// Words successfully retrieved
		gameWords = result.return;
	} else {
		// Error retrieving words
		console.log(result.return);
	}
});

function play() {
	if(gameWords.length == 0) {
		alert("You win")
	} else {
		sendAsteroid();
	}
}

function sendAsteroid() {
	console.log(gameWords);
	var ran = Math.floor(Math.random() * gameWords.length);
	console.log(ran);
	var testWord = gameWords.splice(ran, 1)[0];
	console.log(testWord);
	testWord.word = removeVowel(testWord.word);
	asteroidWord.innerHTML = testWord.word;

	motionInterval = setInterval(function() {
		currentPos += speed;
		// if (currentPos >= 800 && speed > 0) {
		// 	currentPos = 800;
		// 	speed = -2 * speed;
		// 	asteroid.style.width = parseInt(elem.style.width) * 2 + "px";
		// 	asteroid.style.height = parseInt(elem.style.height) * 2 + "px";
		// }
		// if (currentPos <= 0 && speed < 0) {
		// 	clearInterval(motionInterval);
		// }
		asteroid.style.left = currentPos + "px";
	}, 20);
}

function submitVowel(vowel) {
	console.log(vowel);
	console.log(hiddenVowel);
	// TODO: make both lowercase
	if (vowel == hiddenVowel) {
		clearInterval(motionInterval);
		asteroid.style.left =
			-20 *
			parseFloat(getComputedStyle(document.documentElement).fontSize);
		currentPos =
			-20 *
			parseFloat(getComputedStyle(document.documentElement).fontSize);
		play();
	}
}

function removeVowel(word) {
	var vowelIndices = [];

	for (i = 0; i < word.length; i++) {
		console.log(word[i]);
		if (vowels.includes(word[i])) {
			console.log(i);
			vowelIndices.push(i);
		}
	}

	var i = vowelIndices.splice(
		Math.floor(Math.random() * vowelIndices.length),
		1
	)[0];

	console.log(i);
	hiddenVowel = word[i];
	word = word.substr(0, i) + "_" + word.substr(i + "_".length);

	console.log(word);
	return word;
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function togglePlay() {
	if (isPlaying) {
		isPlaying = false;
		playToggle.classList = "icon fa-play";
	} else {
		isPlaying = true;
		playToggle.classList = "icon fa-pause";
		play();
	}
}

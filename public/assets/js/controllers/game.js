// Constants
const ASTEROID_WIDTH =
  20 * parseFloat(getComputedStyle(document.documentElement).fontSize);
const EARTH_DIAMETER =
  60 * parseFloat(getComputedStyle(document.documentElement).fontSize);

// DOM elements
var earth = document.getElementById("earth");
var asteroid = document.getElementById("asteroid");
var asteroidWord = asteroid.children[0];
var playToggle = document.getElementById("play-pause");

// Game settings
var gameWords = [];
var isPlaying = false;
var lives = 3;
var hiddenVowel = "";
var vowels = ["a", "e", "i", "o", "u"];
var speed = 5;
var currentPos = -ASTEROID_WIDTH;
var motionInterval = undefined;

function init() {
  // Load background
  particlesJS.load("particles-js", "/assets/js/particles/particles.json");

  // Set asteroid styling
  asteroid.style.width = ASTEROID_WIDTH + "px";
  asteroid.style.height = ASTEROID_WIDTH / 2 + "px";
  asteroid.style.left = -ASTEROID_WIDTH + "px";

  // TODO: retrieve users progress, game words, and custom
  // words on completion of all promises start the game
  var promise = retrieveGameWords(FIRST_GRADE);
  promise.then(function(result) {
    if (result.success) {
      // Words successfully retrieved
      gameWords = result.return;
      play();
    } else {
      // Error retrieving words
      console.log(result.return);
    }
  });
}
init();

function play() {
  if (gameWords.length == 0) {
    alert("You win");
  } else if (lives == 0) {
    alert("You lose");
  } else {
    sendAsteroid();
  }
}

function sendAsteroid() {
  var ran = Math.floor(Math.random() * gameWords.length);
  var testWord = gameWords.splice(ran, 1)[0];
  testWord.word = removeVowel(testWord.word);
  asteroidWord.innerHTML = testWord.word;

  motionInterval = setInterval(function() {
    if (isPlaying) {
      currentPos += speed;
      asteroid.style.left = currentPos + "px";
      var asteroidRect = asteroid.getBoundingClientRect();
      var earthRect = earth.getBoundingClientRect();
      if (asteroidRect.right > earthRect.left) {
		var heart = document.getElementById("life" + lives);
        heart.style.color = "gray";
        lives--;
        asteroid.style.left = -ASTEROID_WIDTH;
        currentPos = -ASTEROID_WIDTH;
        play();
      }
    }
  }, 20);
}

function submitVowel(vowel) {
  // TODO: make both lowercase
  if (vowel == hiddenVowel) {
    clearInterval(motionInterval);
    asteroid.style.left = -ASTEROID_WIDTH;
    currentPos = -ASTEROID_WIDTH;
    play();
  }
}

function removeVowel(word) {
  var vowelIndices = [];

  for (i = 0; i < word.length; i++) {
    if (vowels.includes(word[i])) {
      vowelIndices.push(i);
    }
  }

  var i = vowelIndices.splice(
    Math.floor(Math.random() * vowelIndices.length),
    1
  )[0];

  hiddenVowel = word[i];
  word = word.substr(0, i) + "_" + word.substr(i + "_".length);
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
  }
}

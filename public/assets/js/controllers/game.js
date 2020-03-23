// Load background
particlesJS.load(
	"particles-js",
	"/assets/js/particles/particles.json",
	function() {
		console.log("particles.js loaded - callback");
	}
);

let asteroid = document.getElementById("asteroid");
let word = asteroid.children[0];

let gameWords = [];

var promise = retrieveGameWords(FIRST_GRADE);
promise.then(function(result) {
	gameWords = result;
	console.log(result)
});

// function move() {
//   var elem = document.getElementById("asteroid"),
//       speed = 1,
//       currentPos = 0;
//   // Reset the element
//   elem.style.left = 0+"px";
//   elem.style.right = "auto";
//   var motionInterval = setInterval(function() {
//       currentPos += speed;
//       if (currentPos >= 800 && speed > 0) {
//          currentPos = 800;
//          speed = -2 * speed;
//          elem.style.width = parseInt(elem.style.width)*2+"px";
//          elem.style.height = parseInt(elem.style.height)*2+"px";
//       }
//       if (currentPos <= 0 && speed < 0) {
//          clearInterval(motionInterval);
//       }
//       elem.style.left = currentPos+"px";
//   },20);
// }

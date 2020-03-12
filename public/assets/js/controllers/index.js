// If user is already signed in then they are
// automatically redirected to the dashboard.
authUser.registerListener(function(val) {
	if (val != null) {
		let promise = getUserAccountType();

		promise.then(function(result) {
			// Successfully retreived account type
			if (result[0]) {
				if (result[1] == ACCOUNT_TYPE_TEACHER) {
					window.location.replace("teacher/home.html");
				} else if (result[1] == ACCOUNT_TYPE_STUDENT) {
					window.location.replace("studentHome.html");
				} else {
					alert("Unkown account type");
				}
			} else {
				// TODO: better error handling
				alert("Unable to retrieve account type");
			}
		});
	} else {
		// Populate the HTML for home, this should only
		// be done if the user is not signed in

		let body = document.getElementsByTagName("BODY")[0];
		body.innerHTML = `
			<header id="header">
				<a class="logo">Spelic</a>
				<nav>
					<ul>
						<li>
							<a href="signup.html">Sign Up</a>
						</li>
						<li>
							<a href="signin.html">Sign In</a>
						</li>
					</ul>
				</nav>
			</header>

			<section id="main" class="wrapper alt">
				<div class="inner">
					<h1>Spelic</h1>
					<p>Spelic is a neat little app to help student learn to spell. Spelic needs a better description.</p>
				</div>
			</section>

			<!-- Firebase Scripts -->
			<script src="/__/firebase/7.8.0/firebase-app.js"></script>
			<script src="/__/firebase/7.8.0/firebase-auth.js"></script>
			<script src="/__/firebase/7.8.2/firebase-database.js"></script>
			<script src="/__/firebase/7.9.1/firebase-functions.js"></script>
			<script src="/__/firebase/init.js"></script>
		
			<script src="./assets/js/constants.js"></script>
			<script src="./assets/js/particles/particles.js"></script>
			<script src="./assets/js/models/firebase.js"></script>
			<script src="./assets/js/controllers/game.js"></script>
		
			<script src="./assets/js/ui/jquery.min.js"></script>
			<script src="./assets/js/ui/jquery.scrolly.min.js"></script>
			<script src="./assets/js/ui/jquery.scrollex.min.js"></script>
			<script src="./assets/js/ui/skel.min.js"></script>
			<script src="./assets/js/ui/util.js"></script>
			<script src="./assets/js/ui/main.js"></script>
		`;
	}
});

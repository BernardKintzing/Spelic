// If user is already signed in then they are
// automatically redirected to the dashboard.
user.registerListener(function(val) {
	if (val != null) {
        // TODO: dynamically redirect user based on if 
        // user account is teacher or student.
		window.location.replace("teacherHome.html");
	}
});

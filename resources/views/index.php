<!doctype html>
<html>
<head>
	<title>Angular app</title>
	<link rel="stylesheet" type="text/css" href="assets/css/app.css">
</head>
<body ng-app="ShApp" ng-controller="campaignController" id="app_wrapper">
	<div id="app_wrapper">
		<header id="app_banner">
		    <div class="logo"></div><span class="logotext">agohamnen</span>
		    <div class="white_stroke"></div>
		</header>

		<div id="app_content">
		    {{ apa }}
		    <button ng-click="logOut()">Logga ut</button>
	    </div>

	    <div id="app_footer"></div>
    </div> <!-- end app_wrapper -->

    <script src="assets/js/app.js"></script>
    <script>
    /*var url = 'http://localhost:8000/public/login';
	$.get( url, function( data ) {
		console.log(data);
	});*/
    </script>
</body>
</html>
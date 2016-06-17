<!doctype html>
<html>
<head>
	<title>Angular app</title>
	<link rel="stylesheet" type="text/css" href="assets/css/app.css">
</head>
<body ng-app="ShApp" ng-controller="campaignController">
	<h1>Index sidan då va</h1>

    {{ apa }}

    <button ng-click="logOut()">Logga ut</button>


    <script src="assets/js/app.js"></script>
    <script>
    /*var url = 'http://localhost:8000/public/login';
	$.get( url, function( data ) {
		console.log(data);
	});*/
    </script>
</body>
</html>
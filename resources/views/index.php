<!doctype html>
<html>
<head>
	<title>Angular app</title>
	<link rel="stylesheet" type="text/css" href="assets/css/app.css">
	<script type="text/javascript">
    if (window.location.hash && window.location.hash == '#_=_') {
        window.location.hash = '';
    }
</script>
</head>
<body ng-app="ShApp" ng-controller="MainController">
	<div id="app_wrapper" ng-contrller="CampaignController">
		<header id="app_banner">
		    <div class="logo"></div><span class="logotext">agohamnen</span>
		    <div class="white_stroke"></div>
		    <div id="user_section" >
		    	<a ng-href="#/login" class="loginBt"><i class="fa fa-sign-in" aria-hidden="true"></i> Logga in</a>
		    	<div class="user_bootstrap">
					<div class="btn-group">
					  <a class="btn btn-default" href="#"><i class="fa fa-user fa-fw"></i> {{username}}</a>
					  <a class="btn btn-default dropdown-toggle" data-toggle="dropdown" href="#">
					    <span class="fa fa-caret-down" title="Användarmeny"></span>
					  </a>
					  <ul class="dropdown-menu">
					    <li><a href="#"><i class="fa fa-eye" aria-hidden="true"></i> Visa profil</a></li>
					    <li><a href="#"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> </i>Ändra</a></li>
					    <li class="divider"></li>
					    <li><a ng-href="/logout"><i class="fa fa-sign-out" aria-hidden="true"></i> Logga ut</a></li>
					  </ul>
					</div>
				</div>

		    </div>
		</header>



		<div id="app_nav">
			<ul>
				<li><a ng-href="#/">Hem</a> </li>
				<li><a ng-href="#/campaign/new">Ny kampanj</a></li>
			</ul>
		</div>

		<div id="app_content">
		    {{ apa }}
		    <div ng-view ></div>

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

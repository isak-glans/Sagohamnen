<!doctype html>
<html lang="sv" ng-app="ShApp">
<head>
	<title>Angular app</title>

	<link rel="stylesheet" type="text/css" href="assets/css/app.css">
	<script type="text/javascript">
    if (window.location.hash && window.location.hash == '#_=_') {
        window.location.hash = '';
    }

</script>
</head>
<body ng-controller="MainController">
	<div id="app_wrapper">
	<!--<div id="app_wrapper" ng-contrller="CampaignController">-->
		<header id="app_banner">
		    <a class="logo" ng-href="#/home"></a><span class="logotext">agohamnen</span>
		    <div class="white_stroke"></div>
		    <div id="user_section" >
		    	<a ng-href="#/login" ng-hide="meSignedIn" class="loginBt"><i class="fa fa-sign-in" aria-hidden="true"></i> Logga in</a>

		    	<div class="user_bootstrap" ng-show="meSignedIn">
					<div class="btn-group">
					  <a class="btn btn-default" href="#/user/{{myId}}"><i class="fa fa-user fa-fw"></i> {{myName}}</a>
					  <div class="btn btn-default dropdown-toggle" data-toggle="dropdown" href="#">
					    <span class="fa fa-caret-down" title="Användarmeny"></span>
					  </div>
					  <ul class="dropdown-menu">
					    <li><a href="#/user/{{myId}}"><i class="fa fa-eye" aria-hidden="true"></i> Visa profil</a></li>
					    <li><a href="#"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> </i>Ändra</a></li>
					    <li class="divider"></li>
					    <li><a ng-href="/logout"><i class="fa fa-sign-out" aria-hidden="true"></i> Logga ut</a></li>
					  </ul>
					</div>
				</div>
		    </div>
		</header>

		<ol class="breadcrumb">
		  	<li><a href="#/home"><span class="glyphicon glyphicon-home"></span></a></li>
	  		<li ng-repeat="page in navigation" ng-class="{active : page.active}">
	  			<a ng-if="page.active == false" ng-href="{{page.url}}">{{page.title}}</a>
	  			<span ng-if="page.active">{{page.title}}</span>
	  		</li>
		</ol>

		<div id="app_content">
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

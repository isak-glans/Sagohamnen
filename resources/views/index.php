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
<body ng-controller="MainController" >
	<div id="app_wrapper">
	<!--<div id="app_wrapper" ng-contrller="CampaignController">-->
		<header id="app_banner">
		    <a class="logo" ng-href="#/home"></a><span class="logotext">agohamnen</span>
		    <div class="white_stroke"></div>
		    <header-menu></header-menu>
		</header>

		<ol class="breadcrumb">
		  	<li><a href="#/home"><span class="glyphicon glyphicon-home"></span></a></li>
	  		<li ng-repeat="page in navigation" ng-class="{active : page.active}">
	  			<a ng-if="page.active == false" ng-href="{{page.url}}">{{page.title}}</a>
	  			<span ng-if="page.active">{{page.title}}</span>
	  		</li>
		</ol>

		<div id="app_content">
			<route-loading-indicator></route-loading-indicator>
		    <div ng-view ng-show='!isRouteLoading' ></div>
	    </div>

	    <div id="app_footer"></div>
    </div> <!-- end app_wrapper -->

	<?php if ( Config::get('app.debug') ) { ?>
	    <script src="assets/js/vendors.js"></script>
	    <script src="assets/js/sagohamnen.js"></script>
	<?php } else { ?>
	    <script src="assets/js/sagohamnen_build.js"></script>
	<?php } ?>

</body>
</html>

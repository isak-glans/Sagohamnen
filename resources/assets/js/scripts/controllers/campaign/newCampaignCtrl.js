angular.module('ShApp')

// inject the Comment service into our controller
.controller('newCampaignCtrl', function($scope, $location, $window, NavigationService, CampaignFactory ) {

	$scope.setup = function(){
		//$scope.form.max_nr_players = 4;
	}

	$scope.cancel = function(){
		$window.history.back();

	}

	$scope.submit_new_campaign = function(){
		console.log("Spara", $scope.form.name);
		var campaign = new CampaignFactory;
		campaign.name 				=  $scope.form.name;
		campaign.genre 				=  $scope.form.genre;
		campaign.description 		=  $scope.form.description;
		campaign.max_nr_players 	=  $scope.form.max_nr_players;
		campaign.$save();

		$location.path("home");
	}

	$scope.setup();
});
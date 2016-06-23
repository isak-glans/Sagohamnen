angular.module('ShApp')

// inject the Comment service into our controller
.controller('CampaignController', function($scope, $http, DbService) {

	$scope.username = "";

	$scope.logIn = function() {
    	if ( UserService.login() ) $scope.init();
    }

    $scope.logOut = function() {
    	UserService.logout().then(function() {
    		console.log("Utloggad");
    	}, function() {
    		console.log("Misslyckades att utlogga");
    	});
    };

});
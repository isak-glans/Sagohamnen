angular.module('ShApp')

// inject the Comment service into our controller
.controller('headerMenuCtrl', function($scope, $rootScope, UserService, $location) {
	$scope.menuUser = { name: "", id: 0, loggedIn: false };

	$scope.$on('loginChange', function(event, response){
		// UserService.currentUser.id
		$scope.menuUser.id = UserService.currentUser.id;
		$scope.menuUser.name = UserService.currentUser.name;
		$scope.menuUser.loggedIn = UserService.currentUser.loggedIn;
		//$scope.$digest();
	});

	$scope.logout = function() {
		UserService.logout();
	}

});
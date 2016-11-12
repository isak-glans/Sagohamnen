angular.module('ShApp')

// inject the Comment service into our controller
.controller('headerMenuCtrl', function($scope, $rootScope, UserService, $location) {

	$scope.currentUser = { name: "", id: 0, loggedIn: false };

	$scope.$on('loginChange', function(){
		$scope.currentUser = UserService.currentUser;
	});

	$scope.logout = function() {
		UserService.logout().then(function(response){
			//UserService.currentUser = {name : "", id: 0, loggedIn: false};
			$scope.currentUser 		= {name : "", id: 0, loggedIn: false};
			$location.path("/home");
		}, function(error) {
			console.log(error);
		});
	}

});
angular.module('ShApp')

// inject the Comment service into our controller
.controller('MainController', function($scope, UserService, PortraitService, $rootScope, SessionFactory, $location) {

	$scope.$on('$viewContentLoaded', function() {
		// Get current page.
		// Send this to userservice.
		var page = $location.url().substring(1);

    	UserService.checkIfLoggedIn(page);
	});

    function login(){
        UserService.checkIfLoggedIn();
    };

});



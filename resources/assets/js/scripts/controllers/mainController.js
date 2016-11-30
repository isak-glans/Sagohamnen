angular.module('ShApp')

// inject the Comment service into our controller
.controller('MainController', function($scope, UserService, PortraitService, $rootScope, SessionFactory) {

	$scope.init = function(){
		setTimeout(function() {
	        login();
		},1 );
	}

    function login(){
        UserService.login();
    };

    $scope.init();
});



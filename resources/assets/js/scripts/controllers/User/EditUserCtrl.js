angular.module('ShApp')

// inject the Comment service into our controller
.controller('EditUserCtrl', function($scope, $location, $routeParams, config, NavigationService, setupEditUserData, UserFactory ) {

	$scope.form;
	$scope.title;

	$scope.setup = function() {
		$scope.form = setupEditUserData;
		$scope.title = setupEditUserData.name;
	}

	$scope.editUser_save = function() {
        UserFactory.updateA({id: $scope.form.id}, $scope.form, function(response){
        	$location.path("user/" + $scope.form.id);
        }, function(response) {
        	$location.path("error/401");
        });
	}

	$scope.cancelBt = function(){
		$location.path("user/" + $scope.form.id);
	}

	$scope.setup();

});
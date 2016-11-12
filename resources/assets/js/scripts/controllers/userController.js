angular.module('ShApp')

// inject the Comment service into our controller
.controller('UserController', function($scope, $http, DbService, $routeParams, $sce, $location, $rootScope ) {

	$scope.userData = [];
	$scope.userFound = false;

	$scope.editUser_save = function() {
		console.log("Vill updatera", $scope.form);
		var changedData = angular.copy($scope.form);
        //console.log("Kom till spara.", changedData);

        DbService.updateUser(changedData)
        .success(function(response) {
            //$scope.campaignData = response.data;
            $location.path("user/" + changedData.id);
        })
        .error(function(response) {
            console.log("Error", response);
            $location.path("error/401");
        });
	}

});
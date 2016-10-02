angular.module('ShApp')

// inject the Comment service into our controller
.controller('UserController', function($scope, $http, DbService, $routeParams, $sce, $location ) {

	$scope.userData = [];
	$scope.userFound = false;

	$scope.getSingleUser = function()
	{
		var theId = $routeParams.userId;
        if( theId == null) {
            console.log("The user ID is missing.");
            return;
        }

        DbService.getUser(theId).then(function successCallback(response) {
			console.log(response);
            $scope.form = response.data;
            /*$scope.form.campaigns = response.data.campaigns;*/
        	$scope.form.updated_at = new Date( response.data.updated_at );
        	$scope.userFound = true;
        	// Make a copy for forms.
        	//$scope.form = angular.copy(response.data);
		}, function errorCallback(response) {
			if(response.status == 404) {
				$location.path("error/404");
			} else {
                console.log(response);
            }
		});
	}

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
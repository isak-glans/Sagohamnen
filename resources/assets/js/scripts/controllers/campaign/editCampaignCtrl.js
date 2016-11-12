angular.module('ShApp')

// inject the Comment service into our controller
.controller('EditCampaignCtrl', function($scope, $location, config, NavigationService, editCampaignData, CampaignFactory, $mdDialog ) {

	$scope.form;
	$scope.headerName = "";

	$scope.setup = function(){
		//console.log(editCampaignData);
		$scope.form = editCampaignData;

		// Set the header name.
		$scope.headerName = editCampaignData.name;

		// Update the navigation.
        NavigationService.set([
        	{"url" : "/#/campaign/"+editCampaignData.id, 'title': editCampaignData.name, 'active' : false},
        	{"url" : "", 'title': "Redigera", 'active' : true}]);
	}

	$scope.editCampaign_save = function() {
        var changedData = $scope.form;

        CampaignFactory.update({id: $scope.form.id}, changedData, function(response){
        	//console.log(response);
        	$location.path("campaign/" + changedData.id);
        }, function(response){
        	$location.path("error/500");
        });
    }

    $scope.editCampaign_cancel = function() {
        $location.path("campaign/" + $scope.form.id);
    }

    $scope.removeCampaign = function() {

        var confirm = $mdDialog.confirm()
          .title('Vill du verkligen ta bort ' + $scope.form.name + "?")
          .textContent('Kampanjen kommer att bli arkiverad.')
          .ariaLabel('Sagohamnen.se')
          .targetEvent(event)
          .ok('Ja')
          .cancel('Nej');
        // Confirm delete.
        $mdDialog.show(confirm).then(function() {
            CampaignFactory.remove({campaign_id : $scope.form.id }, function(success) {
                $location.path("campaign/" + $scope.form.id);
            }, function(error) {
                $location.path("error/500");
            });

        }, function() {
             console.log("Nope");
        });
    }

	$scope.setup();
});
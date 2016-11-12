angular.module('ShApp')

// inject the Comment service into our controller
.controller('ApplyCampaignCtrl', function($scope,  $location, identifyCampaign, CharacterFactory ) {

    console.log("inne i kampapply");

	$scope.form;
    $scope.campaign = { id : 0, name : ""};
    $scope.currentPortrait = {id : 0, name: ""};
    $scope.defaultPortrait = { id: 6,  url: "http://localhost:8000/assets/img/portraits/default.png" };

	$scope.campaignApplication_init = function() {
        $scope.currentPortrait.id = $scope.defaultPortrait.id;
        $scope.currentPortrait.url = $scope.defaultPortrait.url;

        console.log(identifyCampaign);
		$scope.campaign.id = identifyCampaign.id;
        $scope.campaign.name = identifyCampaign.name;
    }

    $scope.save = function() {
        $scope.apply.portrait_id = $scope.currentPortrait.id;
        $scope.apply.campaign_id = $scope.campaign.id;

        console.log("ändring?");
        CharacterFactory.save($scope.apply, function(data){
            $location.path("campaign/" + $scope.campaign.id);
        }, function(error){
            //console.log("error");
            $location.path("error/403");
        });
    }

    $scope.cancel = function() {
    	$location.path("campaign/" + $scope.campaign.id);
    }
});
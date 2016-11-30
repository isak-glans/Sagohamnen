angular.module('ShApp')

// inject the Comment service into our controller
.controller('ApplyCampaignCtrl', function($scope,  $location, identifyCampaign, CharacterFactory ) {

	$scope.form;
    $scope.campaign = { id : 0, name : ""};
    $scope.portrait = {id:6, url:"http://localhost:8000/assets/img/portraits/default.png"};

	$scope.campaignApplication_init = function() {
		$scope.campaign.id = identifyCampaign.id;
        $scope.campaign.name = identifyCampaign.name;
    }

    $scope.save = function() {
        $scope.apply.portrait_id = $scope.portrait.id;
        $scope.apply.campaign_id = $scope.campaign.id;

        console.log("portrait id " + $scope.apply.portrait_id);

        //return;

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
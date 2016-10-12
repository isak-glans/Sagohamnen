angular.module('ShApp')

// inject the Comment service into our controller
.controller('ApplyCampaignCtrl', function($scope, $location, $routeParams, CampaignService, CampaignFactory, CampaignUser ) {

    console.log("inne i kampapply");

	$scope.form;
    $scope.campaign = { id : 0, name : ""};
    $scope.currentPortrait = {id : 0, name: ""};
    $scope.defaultPortrait = { id: 6,  url: "http://localhost:8000/assets/img/portraits/default.png" };

	$scope.campaignApplication_init = function() {
        var campaignId = $routeParams.campaignId;
        $scope.currentPortrait.id = $scope.defaultPortrait.id;
        $scope.currentPortrait.url = $scope.defaultPortrait.url;
        CampaignFactory.identify({ id: campaignId }, function(data) {
			$scope.campaign.id = data.id;
            $scope.campaign.name = data.name;
		}, function(error) {
			$location.path("error/500");
		});
    }

    $scope.save = function() {
        var campaignId = $routeParams.campaignId;
        $scope.apply.portrait_id = $scope.currentPortrait.id;
        $scope.apply.campaign_id = $scope.campaign.id;
        CampaignUser.save($scope.apply, function(data){
            //console.log(data);
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
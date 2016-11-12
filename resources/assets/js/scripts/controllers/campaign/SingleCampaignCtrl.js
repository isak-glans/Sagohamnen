angular.module('ShApp')

// inject the Comment service into our controller
.controller('SingleCampaignCtrl', function($scope, $http, DbService, $routeParams, $sce, $location, $route, $timeout, CampaignFactory, CampaignService, config, NavigationService, campaignData) {

    $scope.showAlternatives = false;

	$scope.setupCampaign = function() {
        //console.log("Innen i single camp ctrl");
        var campaignId = $routeParams.campaignId;
        if( campaignId == null) $location.path("error/404");

        response = campaignData;
        var characters = response.player_characters;
        response.created_at = new Date( response.created_at );
        response.updated_at = new Date( response.updated_at );

        response.archived = response.status == config.campaginArchived;

        // Update the navigation.
        NavigationService.set([{"url" : "/#/campaign/"+campaignData.id, 'title': campaignData.name, 'active' : true}]);

        $scope.form = response;
    }

    $scope.applyToCampaign = function() {
        var userId = $scope.myId;
        var campaignId = $scope.form.id;
        $location.path("campaign_apply/" + campaignId);
    }

    $scope.approveCharacterApply = function(applyer)
    {
        moveApplyerToPlayer(applyer);
    }

    function moveApplyerToPlayer(applyer){
    	// Move it from applyer list to player list.
        for (var i = 0; i < $scope.form.appliers.length; i++) {
            // Find the applyer in list.
            if ($scope.form.appliers[i].id == applyer.id) {
            	// Remove it from array.
            	$scope.form.appliers.splice(i, 1);
            	$scope.form.players.push(applyer);
            	i--;
            }
        }
    }

    $scope.showAlt = function(){
        $scope.showAlternatives = $scope.showAlternatives == true? false : true;
    }

    $scope.edit = function(){
        $location.path('edit_campaign/'+ $scope.form.id );
    }
    $scope.handleApplicants = function(){
        $location.path('campaign_applications/' + $scope.form.id);
    }

    $scope.activateCampaign = function(){
        CampaignFactory.activate({ id : $scope.form.id}, function(success){
            console.log("Ej arkiverad");
            $scope.form.archived = false;
        }, function (error) {

        });
    }
});
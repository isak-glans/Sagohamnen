angular.module('ShApp')

// inject the Comment service into our controller
.controller('SingleCampaignCtrl', function($scope, $http, DbService, $routeParams, $sce, $location, $route, MediaService, $timeout, CampaignFactory, CampaignService, config, NavigationService, campaignData) {

	$scope.setupCampaign = function() {
        console.log("Innen i single camp ctrl");
        var campaignId = $routeParams.campaignId;
        if( campaignId == null) $location.path("error/404");

        response = campaignData;
        //console.log(campaignData);
        var characters = response.player_characters;
        response.created_at = new Date( response.created_at );
        response.updated_at = new Date( response.updated_at );

        //console.log(campaignData.id, campaignData.name, campaignData);
        NavigationService.set([{"url" : "/#/campaign/"+campaignData.id, 'title': campaignData.name, 'active' : false}]);
        //[{"url" : "/#/campaign/"+response.id, 'title': response.name, 'active' : false}, {"url" : '', 'title': 'Ansökningar', 'active' : true }]

        response.players = [];
        response.applicants = [];
        $.each( response.characters, function( index, value ){
            if(value.status == config.charStatusApplying) response.applicants.push(value);
            if(value.status == config.charStatusPlaying) response.players.push(value);
        });
        $scope.form = response;

        /*CampaignFactory.get({campaign_id : campaignId}, function(response){
        	console.log(response)

        	var characters = response.player_characters;
        	response.created_at = new Date( response.created_at );
	        response.updated_at = new Date( response.updated_at );

	        var player_characters = response.player_characters;
	        response.players = [];
	        response.appliers = [];
	        $.each( characters, function( index, value ){
	            if(value.status == config.charStatusApplying) response.appliers.push(value);
	            if(value.status == config.charStatusPlaying) response.players.push(value);
	        });

	        $scope.form = response;

        }, function(response){
        	console.log("Failure");
        })*/
    }

    $scope.applyToCampaign = function() {
        var userId = $scope.myId;
        var campaignId = $scope.form.id;
        $location.path("campaign_apply/" + campaignId);
    }

    $scope.approveCharacterApply = function(applyer)
    {
        console.log("Inne");
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
});
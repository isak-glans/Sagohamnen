angular.module('ShApp')

// inject the Comment service into our controller
.controller('CampApplicationCtrl', function($scope, $routeParams, $location, CampaignFactory, config, NavigationService, campaignData, CharacterFactory ) {

    $scope.data = [];
    $scope.data.players = [];
    $scope.data.applicants = [];

	$scope.setupApplications = function(){
		var campaignId = $routeParams.campaignId;
        if( campaignId == null) $location.path("error/404");
        console.log(campaignData);
        $scope.data.maxNrPlayers = campaignData.max_nr_players;

        $.each(campaignData.characters, function( index, value ){
            if(value.status == config.charStatusApplying) $scope.data.applicants.push(value);
            if(value.status == config.charStatusPlaying) $scope.data.players.push(value);
        });

        // Update the main navigationmenu.
        NavigationService.set([{"url" : "/#/campaign/"+campaignData.id, 'title': campaignData.name, 'active' : false}, {"url" : '', 'title': 'Ansökningar', 'active' : true }]);
	}

	$scope.approve_applicant = function(applyer)
    {
        console.log("Inne");
        //moveApplyerToPlayer(applyer);
        moveCharacter(applyer, $scope.data.applicants, $scope.data.players);
        CharacterFactory.changeStatus({id : 1, status : 2}, function(response) {
            console.log(response);
        }, function(response){
            console.log("Failure");
        });
    };

    $scope.remove_player = function(player)
    {
        console.log("Ienn");
        //$scope.data.players.delete(player);
        moveCharacter(player, $scope.data.players, $scope.data.applicants);
    }

    function moveCharacter(character, fromArray, toArray){
    	// Move it from applyer list to player list.
        for (var i = 0; i < fromArray.length; i++) {
            // Find the applyer in list.
            if (fromArray[i].id == character.id) {
            	// Remove it from array.
            	fromArray.splice(i, 1);
            	toArray.push(character);
            	i--;
            }
        }

    }

});
angular.module('ShApp')

// inject the Comment service into our controller
.controller('CampApplicationCtrl', function($scope, $routeParams, $location, CampaignFactory, config, NavigationService, campaignData, CharacterFactory, $mdDialog ) {

    $scope.data = [];
    $scope.data.players = [];
    $scope.data.applicants = [];


	$scope.setupApplications = function(){
		var campaignId = $routeParams.campaignId;
        if( campaignId == null) $location.path("error/404");

        $scope.data.maxNrPlayers = campaignData.max_nr_players;
        $scope.data.name = campaignData.name;

        $.each(campaignData.characters, function( index, value ){
            if(value.status == config.charStatusApplying) $scope.data.applicants.push(value);
            if(value.status == config.charStatusPlaying) $scope.data.players.push(value);
        });

        // Update the main navigationmenu.
        NavigationService.set([{"url" : "/#/campaign/"+campaignData.id, 'title': campaignData.name, 'active' : false}, {"url" : '', 'title': 'Ansökningar', 'active' : true }]);
	}

	$scope.approveApplicant = function(applyer)
    {
       changeStatus(applyer, config.charStatusPlaying);
    };

    $scope.removePlayer = function(player)
    {
        changeStatus(player, config.charStatusApplying);
    }

    $scope.removeApplicant = function(event, player)
    {
        var confirm = $mdDialog.confirm()
          .title('Vill du verkligen ta bort ' + player.name + "?")
          .textContent('Karaktären kommer att bli arkiverad.')
          .ariaLabel('Sagohamnen.se')
          .targetEvent(event)
          .ok('Ja')
          .cancel('Nej');

        // Confirm delete.
        $mdDialog.show(confirm).then(function() {
            changeStatus(player, config.charStatusArchived);
        }, function() {
        });
    }

    function changeStatus(character, newStatus)
    {
        // Call backend API
        CharacterFactory.changeStatus({id : character.id,  status: newStatus }, function(response) {
            // On success.
            var fromArray, toArray;

            if (newStatus == config.charStatusApplying) {
                fromArray   =  $scope.data.players;
                toArray     = $scope.data.applicants;
            } else if (newStatus == config.charStatusPlaying) {
                fromArray    =  $scope.data.applicants;
                toArray      = $scope.data.players;
            } else if (newStatus == config.charStatusArchived) {

                // Remove from applicants array.
                var index = $scope.data.applicants.indexOf(character);
                if (index > -1) {
                    $scope.data.applicants.splice(index, 1);
                }
                return;
            }

            moveCharacter(character, fromArray, toArray);
        }, function(response){
            console.log("Failure");
        });
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
angular.module('ShApp')

// inject the Comment service into our controller
.controller('EditCharacterCtrl', function($scope, $location, $routeParams, CharacterFactory, config, $mdDialog) {

	$scope.form = {};
	$scope.portrait = {id : 0, url: ""};

	//var status = { 0=>'Arkiverad', 1=>'Ansöker', 2=>'Spelare', 3=>'SLP'};

	$scope.setup = function () {
		var characterId = $routeParams.characterId;
    	if( characterId == null) $location.path("error/404");

    	var theCharacter = CharacterFactory.get({id: characterId}, function(response) {

    		// If character is archived then user are not allowed to edit it.
    		if (response.can_edit == false){
    			$location.path("error/403");
    		}

    		$scope.campaignId = response.id;
			response.created_at = new Date( response.created_at );
			response.updated_at = new Date( response.updated_at );

			$scope.portrait.id 	= response.portrait.id;
			$scope.portrait.url 	= response.portrait.medium;

			$scope.headline = angular.copy(response.name);
			$scope.form = response;
	      //console.log(response);
	    }, function(response) {
	      if(response.status == 404) $location.path("error/404");
	    } );
	}

	$scope.saveEdit = function(){
		//console.log("Dags att spara");

		var postData = {};
		postData.id 				= $scope.form.id;
		postData.name 				= $scope.form.name;
		postData.description 		= $scope.form.description;
		postData.secret_data 		= $scope.form.secret_data;
		postData.portrait_id 		= $scope.portrait.id;
		postData.excerpt 			= $scope.form.excerpt;
		//postData.campaign_id		= $scope.form.campaign.id;

		CharacterFactory.update({id: $scope.form.id}, postData, function(response) {
			//console.log(response);
			$location.path("character/"+postData.id);
	    }, function(response) {
    		//console.log(response);
	      //if(response.status == 404) $location.path("error/404");
	    } );

	}

	$scope.cancelEdit = function()
	{
		$location.path("character/" + $scope.form.id);
	}

	$scope.remove = function()
	{
		var confirm = $mdDialog.confirm()
          .title('Vill du verkligen ta bort ' + $scope.form.name + "?")
          .textContent('Karaktären kommer att bli arkiverad.')
          .ariaLabel('Sagohamnen.se')
          .targetEvent(event)
          .ok('Ja')
          .cancel('Nej');

        // Confirm delete.
        $mdDialog.show(confirm).then(function() {
        	CharacterFactory.changeStatus({id: $scope.form.id, status: config.charStatusArchived} , function(response) {
        		$location.path("character/"+$scope.form.id);
			}, function(response){
				console.log("failure");
				$location.path("error/500");
			});
        }, function() {
             console.log("Nope");
        });

	}
});
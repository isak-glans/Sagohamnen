angular.module('ShApp')

// inject the Comment service into our controller
.controller('EditCharacterCtrl', function($scope, $location, $routeParams, config, $mdDialog, setupData, CharacterService) {

	$scope.form = {};
	$scope.portrait = {id : 0, url: ""};

	//var status = { 0=>'Arkiverad', 1=>'Ansöker', 2=>'Spelare', 3=>'SLP'};

	$scope.setup = function () {
		$scope.campaignId = setupData.id;
		setupData.created_at = new Date( setupData.created_at );
		setupData.updated_at = new Date( setupData.updated_at );

		$scope.portrait.id 	= setupData.portrait.id;
		$scope.portrait.url 	= setupData.portrait.medium;

		$scope.headline = angular.copy(setupData.name);
		$scope.form = setupData;
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

		var result = CharacterService.update($scope.form.id, postData);
		result.then(function(response){
			$location.path("character/"+postData.id);
		});

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
        	// Ask server to change status.
        	var characterID = $scope.form.id;
        	var newStatus = config.charStatusArchived;

        	CharacterService.changeStatus(characterID, newStatus).then(function(response){
        		$location.path( "character/" + characterID );
        	});
        	/*CharacterFactory.changeStatus({id: $scope.form.id, status: config.charStatusArchived} , function(response) {
        		$location.path("character/"+$scope.form.id);
			});*/
        }, function() {
             console.log("Nope");
        });

	}
});
angular.module('ShApp')

// inject the Comment service into our controller
.controller('EditCharacterCtrl', function($scope, $location, $routeParams, CharacterFactory, config ) {

	$scope.form = {};
	$scope.currentPortrait = {id : 0, url: ""};

	var char_status_none     = config.charStatusNone;
	var char_status_applying = config.charStatusApplying;
	var char_status_playing  = config.charStatusplaying;
	var char_status_slp      = config.charStatusSlp;
	var char_status_blocked  = config.charStatusBlocked;

	//var status = { 0=>'Arkiverad', 1=>'Ansöker', 2=>'Spelare', 3=>'SLP'};

	$scope.setup = function () {
		var characterId = $routeParams.characterId;
    	if( characterId == null) $location.path("error/404");

    	var theCharacter = CharacterFactory.get({id: characterId}, function(response) {
			response.created_at = new Date( response.created_at );
			response.updated_at = new Date( response.updated_at );

			$scope.currentPortrait.id 	= response.portrait.id;
			$scope.currentPortrait.url 	= response.portrait.medium;

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
		postData.id 					= $scope.form.id;
		postData.name 					= $scope.form.name;
		postData.description 		= $scope.form.description;
		postData.secret_data 		= $scope.form.secret_data;
		postData.portrait_id 		= $scope.currentPortrait.id;

		CharacterFactory.save(postData, function(response) {
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

	$scope.leaveCampaign = function()
	{
		console.log("Ska du verkligen lämna?");
		CharacterFactory.leaveCampaign({id : $scope.form.id }, function(response){
			console.log(response);
			$location.path("character/" + $scope.form.id);
		}, function(response){
			console.log(response);
		});
	}
});
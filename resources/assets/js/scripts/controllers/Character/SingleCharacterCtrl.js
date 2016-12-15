angular.module('ShApp')

// inject the Comment service into our controller
.controller('SingleCharacterCtrl', function($scope, singleCharacter, config, NavigationService, CharacterService ) {

	$scope.form = {};
	$scope.showConfirmArchive = false;
	$scope.charAction = {'title' : "", 'status' : 0, 'icon' : ""};
	$scope.relationText = "";
	$scope.archived = false;
	$scope.showAlternatives = false;

	$scope.setup = function() {
		singleCharacter.created_at = new Date( singleCharacter.created_at );
		singleCharacter.updated_at = new Date( singleCharacter.updated_at );
		$scope.form = singleCharacter;

		// Character status as text.
		setStatusText(singleCharacter.status);

		// Update the navigation.
        NavigationService.set([
        	{"url" : "/#/campaign/"+singleCharacter.campaign.id, 'title': singleCharacter.campaign.name, 'active' : false},
        	{"url" : "/#/character/"+singleCharacter.id, 'title': singleCharacter.name, 'active' : true}]);
	}

	function setStatusText(charStatus)
	{
		$scope.archived = false;
		if (charStatus == config.charStatusArchived) {
			$scope.relationText = "Arkiverad";
			$scope.archived = true;
		}
		else if (charStatus == config.charStatusApplying) $scope.relationText = "Ansöker att delta";
		else if (charStatus == config.charStatusPlaying) $scope.relationText = "Spelare";
		else if (charStatus == config.charStatusNpc) $scope.relationText = "Spelledarekaraktär";
	}

	var changeCharStatus = function(newStatus){

		var characterID = $scope.form.id;

    	CharacterService.changeStatus(characterID, newStatus).then(function(response){
    		setStatusText(newStatus);
    	});
	}

	$scope.showAlt = function() {
		$scope.showAlternatives = $scope.showAlternatives == true ? false : true;
	}

	$scope.setApplier = function() {
		changeCharStatus(config.charStatusApplying);
	}

	$scope.setNpc = function() {
		changeCharStatus(config.charStatusNpc);
	}

	$scope.setup();
});
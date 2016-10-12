angular.module('ShApp')

// inject the Comment service into our controller
.controller('SingleCharacterCtrl', function($scope, $location, $routeParams, CharacterFactory, config ) {

  $scope.form = {};
  var char_status_none     = config.charStatusNone;
  var char_status_applying = config.charStatusApplying;
  var char_status_playing  = config.charStatusplaying;
  var char_status_slp      = config.charStatusSlp;
  var char_status_blocked  = config.charStatusBlocked;

	$scope.setup = function() {
		var characterId = $routeParams.characterId;
    if( characterId == null) $location.path("error/404");

    var theCharacter = CharacterFactory.get({id: characterId}, function(response) {
      response.created_at = new Date( response.created_at );
      response.updated_at = new Date( response.updated_at );
      $scope.form = response;
      if (response.status == char_status_none) {
        $scope.form.relation = "Arkiverad";
        $scope.form.archived = true;
      } else $scope.form.archived = false;
      if (response.status == char_status_applying) $scope.form.relation = "Ansöker att delta";
      if (response.status == char_status_playing) $scope.form.relation = "Spelare";
      if (response.status == char_status_slp) $scope.form.relation = "Spelledarekaraktär";

    }, function(response) {
      if(response.status == 404) $location.path("error/404");
    } );
	}

});
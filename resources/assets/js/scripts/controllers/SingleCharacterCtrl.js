angular.module('ShApp')

// inject the Comment service into our controller
.controller('SingleCharacterCtrl', function($scope, $location, $routeParams, CharacterFactory ) {

  $scope.form = {};
  var char_status_none     = 0;
  var char_status_applying = 1;
  var char_status_playing  = 2;
  var char_status_slp      = 3;
  var char_status_blocked  = 4;

	$scope.setup = function() {
		var characterId = $routeParams.characterId;
    if( characterId == null) $location.path("error/404");

    var theCharacter = CharacterFactory.get({id: characterId}, function(response) {
      response.created_at = new Date( response.created_at );
      response.updated_at = new Date( response.updated_at );
      var relation = "";
      if (response.status == char_status_none) relation = "Arkiverad";
      if (response.status == char_status_applying) relation = "Ansöker att delta";
      if (response.status == char_status_playing) relation = "Spelare";
      if (response.status == char_status_slp) relation = "Spelledarekaraktär";
      response.status = relation;
      $scope.form = response;
    }, function(response) {
      if(response.status == 404) $location.path("error/404");
    } );
	}

});
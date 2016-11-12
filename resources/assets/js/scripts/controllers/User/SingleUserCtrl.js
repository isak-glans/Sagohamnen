angular.module('ShApp')

// inject the Comment service into our controller
.controller('SingleUserCtrl', function($scope, $routeParams, $location, userData, config, NavigationService, UserService ) {

	$scope.player_characters = [];
	$scope.applying_characters = [];
	$scope.showAlternatives = false;

	$scope.setup = function()
	{
		$scope.form = userData;
    	$scope.form.updated_at = new Date( userData.updated_at );

    	// Sort characters
    	sortCharacters(userData.user_characters);

    	// Update navigation
    	NavigationService.set([{"url" : "/#/user/"+userData.id, 'title': userData.name, 'active' : true}]);
	}

	function sortCharacters(characters) {
		$.each( characters, function( index, value ){
            if(value.status == config.charStatusApplying) $scope.applying_characters.push(value);
            if(value.status == config.charStatusPlaying) $scope.player_characters.push(value);
        });
	}

	$scope.showAlt = function() {
		$scope.showAlternatives = $scope.showAlternatives == true ? false : true;
	}

	$scope.logOut = function() {
		UserService.logout();
	}

	$scope.setup();

});
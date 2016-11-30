angular.module('ShApp')

.factory('UserService', function($http, $rootScope, UserFactory, $location, SessionFactory) {

	var factory = {};
	factory.csrf = "";
	factory.currentUser = {name : "", id: 0, loggedIn : false };

	factory.login = function() {
		// If userId exist in localstorage.
		if ( !!SessionFactory.getKey('userId') ) {
			factory.currentUser.id = SessionFactory.getKey('userId');
			factory.currentUser.name = SessionFactory.getKey('userName');
			factory.currentUser.loggedIn = true;
			updateUserMenu();
		} else {
			// User do not exist in local storage.
			// Therefor get it from the server.
			loadUserFromServer();
		}
	}

	factory.setUser = function(user){
		factory.currentUser = user;
	}

	factory.logout = function() {
		console.log("Loggar ut");
		UserFactory.logOut().$promise.then(function(response){
			factory.currentUser = {name : "", id: 0, loggedIn: false};

            SessionFactory.deleteKey('userId');
            SessionFactory.deleteKey('userName');

			factory.updateLogin();
			$location.path("/home");
		}, function(error) {
			console.log(error);
		});
	};

	factory.updateLogin = function(){
		$rootScope.$broadcast('loginChange', {});
	}

	function loadUserFromServer(){
		console.log("Laddar userinfo froms server");
		UserFactory.loadUser().$promise.then(function(response){
            // Store result as service property.
            factory.currentUser = {name :response.name, id: response.id, loggedIn : response.signed_in};

            // Save user in local storage.
            if (response.signed_in){
            	console.log("Fyller i localstorage nu...");
            	SessionFactory.setKey('userId', response.id);
            	SessionFactory.setKey('userName', response.name);
            }

			updateUserMenu();
        }, function(error) {
        	console.log(error);
        });
	}

	function updateUserMenu()
	{
		// Update the user menu button.
    	$rootScope.$broadcast('loginChange', {});
	}

	return factory;

});
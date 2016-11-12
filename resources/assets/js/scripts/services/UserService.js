angular.module('ShApp')

.factory('UserService', function($http, $rootScope, UserFactory, $location) {

	var factory = {};

	factory.csrf = "";
	factory.currentUser = {name : "", id: 0, loggedIn : false };

	factory.loadUser = function() {
		UserFactory.loadUser().$promise.then(function(response){
            factory.currentUser = {name :response.name, id: response.id, loggedIn : response.signed_in};
        	$rootScope.$broadcast('loginChange', {});
        }, function(error) {
        	console.log(error);
        });

	}

	factory.setUser = function(user){
		factory.currentUser = user;
	}

	factory.logout = function() {
		console.log("Loggar ut");
		//return UserFactory.logOut().$promise;
		UserFactory.logOut().$promise.then(function(response){
			factory.currentUser = {name : "", id: 0, loggedIn: false};
			factory.updateLogin();
			$location.path("/home");
		}, function(error) {
			console.log(error);
		});
	};

	factory.updateLogin = function(){
		$rootScope.$broadcast('loginChange', {});
	}

	return factory;

});
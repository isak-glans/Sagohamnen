angular.module('ShApp')

.factory('PortraitService', function(config, MediaFactory) {
	var factory = {};
	factory.all_portraits = [];

	factory.loadPortraits = function(){
		MediaFactory.fetch_portraits().$promise.then(function(response){
			factory.all_portraits = response.portraits;
		}, function(error) {
			console.log("Error");
		});
	}

	factory.fetchPortraits = function(){
		return MediaFactory.fetch_portraits().$promise;
	}

	factory.setPortraits = function(data){
		factory.all_portraits = data;
	}

	return factory;

});
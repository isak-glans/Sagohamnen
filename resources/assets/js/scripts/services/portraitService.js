angular.module('ShApp')

.factory('PortraitService', function(config, MediaFactory, $q) {
	var factory = {};
	factory.all_portraits = [];

	factory.loadPortraits = function(){
		var deferred = $q.defer();

		if (factory.all_portraits.length > 0){
			console.log("Porträtt finns redan.");
			deferred.resolve();
			return deferred;
		}

		var result = MediaFactory.fetch_portraits().$promise
		result.then(function(response){
			factory.all_portraits = response.portraits;
		}, function(error) {
			console.log("Error");
		});

		return result;
	}

	factory.fetchPortraits = function(){
		return MediaFactory.fetch_portraits().$promise;
	}

	factory.setPortraits = function(data){
		factory.all_portraits = data;
	}

	return factory;

});
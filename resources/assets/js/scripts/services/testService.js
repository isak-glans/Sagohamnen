angular.module('ShApp')

.factory('TestService', function($q) {
	var factory = {};

	factory.tungUppgift = function() {
		var p = $q.defer();
		setTimeout(function(){
			p.resolve("Här är svaret!");
		}, 5000);
		return p.promise;
	}

	factory.tungUppgift2 = function(){
		var p = $q.defer();
		setTimeout(function(){
			p.resolve("Uppg2 svar!");
			console.log("Upp2 klar.");
		}, 3000);
		return p.promise;
	}

	factory.tungUppgift3 = function(){
		var p = $q.defer();
		setTimeout(function(){
			p.resolve("Uppg3 svar!");
			console.log("Upp3 klar.");
		}, 2000);
		return p.promise;
	}

	/*TestService.tungUppgift().then(function(svar){
            console.log("NU är det klart!", svar);
        })
            .then(TestService.tungUppgift2)
            .then(TestService.tungUppgift3)
            .then(function(){console.log("allt klart!");});*/

	return factory;
});
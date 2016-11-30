angular.module('ShApp')

.factory('SessionFactory', [ function() {

	var factory = {};

	factory.setKey = function(key, value){
		sessionStorage.setItem(key, value);
	}
	factory.getKey = function(key){
		return sessionStorage.getItem(key);
	}
	factory.deleteKey = function(key){
		sessionStorage.removeItem(key);
	}

	return factory;
}
]);
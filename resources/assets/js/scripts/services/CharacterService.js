angular.module('ShApp')

.factory('CharacterService', function($resource) {
	var vm = {};

	var Character = $resource('/api/character/:characterId',{},{
		setupEdit : { method : "GET", url : "/api/character/:characterId/edit" },
		changeStatus : {method: "GET", url: "/api/character/:id/status/:status"},
    	update : {method: "PUT", url: "/api/character/:id" }
	});

	vm.getInfo = function(characterId) {

	}

	vm.update = function(id, postData){
		return Character.update({id: id}, postData).$promise;
	}

	vm.changeStatus = function(characterID, newStatus){
		return Character.changeStatus({id: characterID, status: newStatus}).$promise;
	}

	vm.setupEditCharacter = function(id) {
		return Character.setupEdit({'characterId' : id});
	}

	return vm;
});
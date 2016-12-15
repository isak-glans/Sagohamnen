angular.module('ShApp')

// inject the Comment service into our controller
.controller('ChronicleController', function($scope, $routeParams, $location, ChronicleService, entriesPerPage ) {

	$scope.init = function() {
		$scope.chronicles();
		console.log(entriesPerPage);
	}

	$scope.chronicles = function() {
		var campaignId 	= $routeParams.campaignId;
		var pageNr 		= $routeParams.pageNr;
		/*console.log($routeParams);
		console.log(campaignId, pageNr);*/
		ChronicleService.chroniclesPerPage(campaignId,pageNr).then(function successCallback(response) {
			console.log(response);
			$scope.chronicles = response.chronicles;
			$scope.campaign = response.campaign;
		}, function errorCallback(response) {

		});
	}
});
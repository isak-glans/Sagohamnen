angular.module('ShApp')

// inject the Comment service into our controller
.controller('SearchPortraitCtrl', function($scope, $http, $routeParams, MediaService ) {

	$scope.portraits = [];
	$scope.portraits_counted = 0;
	$scope.portraits_nrPages = 0;
    $scope.currentSearchPage = 0;
    $scope.maxSearchPage = 0;

	$scope.searchPortrait_init = function() {
        var campaignId = $routeParams.campaignId;
        $scope.searchPortrait("", 1);
    }

	$scope.searchPortrait = function(searchTag, pageNr) {
        $scope.currentSearchPage = pageNr;
		MediaService.searchPortrait(searchTag, pageNr).then(function successCallback(response) {
            var images_per_page = response.images_per_page;
            $scope.portraits = response.result;
            $scope.portraits_counted = response.nr_results;
            $scope.portraits_nrPages = Math.ceil(response.nr_results / images_per_page);
            $scope.maxSearchPage = $scope.portraits_nrPages;
        }, function errorCallback(response) {
            $location.path("error/500");
        });
	};

	$scope.selectPortrait = function(portrait)
    {
        // If parent scope have currentPortrait attribute.
        if ( !angular.isUndefined($scope.currentPortrait) ) {
        	$scope.currentPortrait.id = portrait.id;
            $scope.currentPortrait.url = portrait.medium;
        }
    }

    $scope.setDefaultPortrait = function()
    {
        $scope.current_portrait = $scope.default_portrait;
    }

	$scope.repeatXTimes = function(n){
         return new Array(n);
    };

});
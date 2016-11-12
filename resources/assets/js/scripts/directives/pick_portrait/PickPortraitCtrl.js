angular.module('ShApp')
.controller('PickPortraitCtrl', function($scope, PickPortraitService ) {
    console.log("Ctrl lästes in.");

    var init = function() {
        console.log("Inne i pickCtrl", $scope.campaignId);
    }
    init();


    /*$scope.searchPortrait = function(searchTag, pageNr) {
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
    };*/
});
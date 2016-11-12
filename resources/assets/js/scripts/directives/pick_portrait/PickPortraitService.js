angular.module('ShApp')

.factory('PickPortraitService', function(MediaFactory) {

    var factory = {};

    factory.portraits_per_page = 10;
    factory.portraits = [];
    factory.portraits_counted = 0;
    factory.portraits_nrPages = 0;
    factory.currentSearchPage = 0;
    factory.maxSearchPage = 0;
    factory.selectedPortrait = {};

	factory.searchPortrait = function(tag, pageNr) {
        $scope.currentSearchPage = pageNr;

        MediaFactory.get
        /*var images_per_page = response.images_per_page;
                    $scope.portraits = response.result;
                    $scope.portraits_counted = response.nr_results;
                    $scope.portraits_nrPages = Math.ceil(response.nr_results / images_per_page);
                    $scope.maxSearchPage = $scope.portraits_nrPages;*/


	}
	return factory;

});
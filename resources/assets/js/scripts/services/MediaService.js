angular.module('ShApp')

.factory('MediaService', function($http, $sce, DbService) {

    var portraits_per_page = 10;

	var factory = {};

	factory.searchPortrait = function(tag, pageNr) {
		var result;

		return DbService.searchPortrait(tag, pageNr).then(function successCallback(response) {
            console.log(response);
            /*jQuery.each(response.media, function(index, item) {
                item.clicked = false;
            });*/

            //console.log(response);
            return response.data;
        }, function errorCallback(response) {
            if(response.status == 404) {
                $location.path("error/404");
            }
        });

        //return result;
	}


	return factory;

});
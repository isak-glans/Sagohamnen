angular.module('ShApp')

.factory('ChronicleService', function($http, $sce, DbService) {

	var factory = {};

	factory.chroniclesPerPage = function(campaignId,pageNr) {
		var result;

		return DbService.chroniclesPerPage(campaignId, pageNr).then(function successCallback(response) {
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
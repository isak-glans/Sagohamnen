angular.module('ShApp')

.factory('NavigationService', function($http, $sce, $rootScope) {

    //$rootScope.navigation.url = {'title' : '', 'active': false, 'url':'#' };
	var factory = {};

    factory.set = function(navArray){
        /*$rootScope.navigation.url = url;
        $rootScope.navigation.title = title;
        $rootScope.navigation.active = active;*/
        //$rootScope.navigation.push({'title' : title, 'active': false, 'url':'#' });
        $rootScope.navigation = navArray;
        //$rootScope.$apply();
    }

	return factory;

});

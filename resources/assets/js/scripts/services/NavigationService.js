angular.module('ShApp')

.factory('NavigationService', function($http, $sce, $rootScope) {

    //$rootScope.navigation.url = {'title' : '', 'active': false, 'url':'#' };
	var vm = {};
    $rootScope.navigation = [];

    vm.set = function(navArray){
        /*$rootScope.navigation.url = url;
        $rootScope.navigation.title = title;
        $rootScope.navigation.active = active;*/
        //$rootScope.navigation.push({'title' : title, 'active': false, 'url':'#' });
        $rootScope.navigation = navArray;
        //$rootScope.$apply();
    }

    vm.addToMenu = function(theUrl, theTitle, ifActive)
    {
        var menuObj = {
            'url' : theUrl,
            'title' : theTitle,
            'active' : ifActive
        }
        $rootScope.navigation.push(menuObj);
    }


	return vm;

});

angular.module('ShApp')

.directive('headerMenu', function() {
    return {
    	restrict: 'E',
    	controller : 'headerMenuCtrl',
	    scope: {},
	    templateUrl: 'views/directives/header_menu.html'
    };
});
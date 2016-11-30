angular.module('ShApp')
.directive('pickPortraitDir', function(PortraitService) {
    return {
    	restrict: 'E',
    	scope: {
	      portrait: '=portrait'
	      /* '@' means One Way Binding (Parent changes affect child, child changes does not affect parent)
	        The '=' means Two Ways Binding.*/
	    },
    	templateUrl : "views/media/pick_portrait.html",
        controller: 'PickPortraitCtrl'

    };
});

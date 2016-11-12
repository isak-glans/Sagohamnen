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
    	link: function(scope, element, attrs){
            scope.searchTag = "male";
            scope.portraits = [];
            scope.genders = [
                {label: 'male'},
                {label: 'female'}];
            scope.races = [{label : '' }, {label: 'dwarf'}, {label: 'human'}];

            if(PortraitService.all_portraits.length == 0){
                PortraitService.fetchPortraits().then(function(){
                    scope.portraits = PortraitService.all_portraits;
                    PortraitService.setPortraits = scope.portraits;
                    console.log("Hämtat" );
                });
            } else {
                scope.portraits = PortraitService.all_portraits;
                console.log("Inne", typeof(PortraitService.all_portraits) );
            }

            /*scope.$watch('portraits', function() {
                // all the code here...
                //scope.$apply();
                console.log("Watching", scope.portraits);
             });*/

            /*setTimeout(function() {
                scope.portraits = PortraitService.all_portraits;
            } );*/


            //PortraitService.fetch_portraits();


            scope.test = function(){
            	//console.log("inne", scope.portrait.id);
                scope.searchTag = "female";
                //scope.portraits = PortraitService.all_portraits;
 			};


    	}
    };
});

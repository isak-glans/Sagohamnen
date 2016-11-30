angular.module('ShApp')
.directive('routeLoadingIndicator', function($rootScope, $route, $timeout) {
  return {
    restrict: 'E',
    replace: true,
    template: "<div class='col-lg-12' ng-if='isRouteLoading'><h1>Loading <i class='fa fa-spinner' aria-hidden='true'></i></h1></div>",
    link: function(scope, element) {

      $rootScope.$on('$routeChangeStart', function(event, currentRoute, previousRoute) {
        console.log("Nu laddas en route.");
        scope.isRouteLoading = true;

        if (previousRoute) return;

        $timeout(function() {
          element.removeClass('ng-hide');
        });
      });

      $rootScope.$on('$routeChangeSuccess', function() {
        element.addClass('ng-hide');
        scope.isRouteLoading = false;
      });
    }
  };
});



/*var routeLoadingIndicator = function($rootScope, $route, $timeout){
  return {
    restrict:'E',
    template:"<h1 ng-if='isRouteLoading'>Loading...</h1>",
    link:function(scope, elem, attrs){
      scope.isRouteLoading = true;

      console.log("Inne i routerLoeaderDir");

      $rootScope.$on('$routeChangeStart', function(){
        scope.isRouteLoading = true;
        console.log("Nu laddas en route.");
      });

      $rootScope.$on('$routeChangeSuccess', function(){
        scope.isRouteLoading = false;
        console.log("Nu har en route laddats klart.");
      });



    }
  };
};*/

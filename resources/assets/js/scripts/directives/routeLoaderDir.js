// This directive will communicate with the index.php
// and show a loader icon when Angular Route are waiting
// for a resolver to finish. This way the user wont be
// confused if nothing happens while page is loading.

angular.module('ShApp')
.directive('routeLoadingIndicator', function($rootScope, $route, $timeout) {
  return {
    restrict: 'E',
    replace: true,
    template: "<div class='col-lg-12' ng-if='isRouteLoading'><h1>Loading <i class='fa fa-spinner' aria-hidden='true'></i></h1></div>",
    link: function(scope, element) {

      $rootScope.$on('$routeChangeStart', function(event, currentRoute, previousRoute) {
        scope.isRouteLoading = true;
      });

      $rootScope.$on('$routeChangeSuccess', function() {
        scope.isRouteLoading = false;
      });
    }
  };
});


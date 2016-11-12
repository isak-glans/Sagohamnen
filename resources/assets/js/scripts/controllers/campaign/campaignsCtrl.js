angular.module('ShApp')
.controller('CampaignsCtrl', function($scope, $routeParams, $sce, $location, CampaignService, $route, NavigationService, campaignsData ) {

    NavigationService.set([]);

    $scope.setup = function() {
        $scope.campaigns = campaignsData.campaigns;
        $scope.can_create = Boolean(campaignsData.can_create);
    }

    $scope.setup();

});
angular.module('ShApp')

// inject the Comment service into our controller
.controller('CampaignController', function($scope, $http, DbService, $routeParams, $sce, $location, CampaignService, $route, MediaService, $timeout, NavigationService ) {

    $scope.campaignData = [];
    $scope.user = {};
    $scope.is_user_logged_in = false;
    $scope.is_user_gm = false;
    $scope.can_apply = false;
    $scope.nrPages = 0;

    NavigationService.set([]);

    $scope.campaign = function() {
        /*var campaignId = $routeParams.campaignId;
        if( campaignId == null) $location.path("error/404");

        DbService.getCampaign(campaignId).then(function successCallback(response) {
            console.log("resultat:", response);
            $scope.form = CampaignService.campaign(response.data,$scope.myId);
        }, function errorCallback(response) {
            if(response.status == 404) {
                $location.path("error/404");
            }
        });*/
    }

    $scope.getCampaigns = function() {
        DbService.getCampaigns().then(function successCallback(response) {
            $scope.campaigns = response.data.campaigns;
            $scope.can_create = Boolean(response.data.can_create);
        }, function errorCallback(response) {
            if(response.status == 404) {
                $location.path("error/404");
            }
        });
    };

    $scope.editCampaigns_setup = function() {
        var theId = $routeParams.campaignId;
        if ( ! theId === parseInt(theId, 10) || theId == null ) {
            $location.path("error/404");
        }

        DbService.getCampaign(theId).then(function succesCallback(response) {
            $scope.campaign = CampaignService.campaign(response.data,$scope.myId);
            //$scope.campaignData = response.campaign;
            $scope.form = angular.copy($scope.campaign);
        }, function errorCallback(response) {
            $location.path("error/500");
        });
    }

    $scope.editCampaign_save = function() {
        var changedData = $scope.form;

        DbService.updateCampaign(changedData).then(function succesCallback(response) {
            //$scope.campaignData = response.data;
            $location.path("campaign/" + changedData.id);
        }, function errorCallback(response) {
            $location.path("error/500");
        });
    }

    $scope.editCampaign_cancel = function() {
        $location.path("campaign/" + $scope.form.id);
    }

    $scope.applyToCampaign = function() {
        var userId = $scope.myId;
        var campaignId = $scope.form.id;
        $location.path("campaign_apply/" + campaignId);
    }

    $scope.newCampaing = function() {
        console.log("New campaign");
    }

    $scope.approveCharacterApply = function(applyer)
    {
        console.log("Inne");
        applyer.status = 2;
    }


    //$scope.getCampaigns();

});
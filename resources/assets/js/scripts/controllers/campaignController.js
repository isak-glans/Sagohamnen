angular.module('ShApp')

// inject the Comment service into our controller
.controller('campaignController', function($scope, $http, DbService) {
    // CampaignService object to hold all the data for the new comment form

    $scope.apa = "Hej";
    $scope.campaignData = {};

    DbService.getCampaign(4)
        .success(function(data) {
            $scope.campaignData = data;
            console.log(data);
    });


});
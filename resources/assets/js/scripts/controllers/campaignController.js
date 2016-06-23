angular.module('ShApp')

// inject the Comment service into our controller
.controller('CampaignController', function($scope, $http, DbService) {
    // CampaignService object to hold all the data for the new comment form

    $scope.campaignData = {};
    $scope.user = {};

    $scope.getCampaigns = function() {
    	console.log("Gettings campaigns");
    	DbService.getCampaigns()
	        .success(function(data) {
	            $scope.campaignData = data;
	            console.log(data);
	    });
    };

    $scope.newCampaing = function() {

        console.log("Spara PPPP");

        console.log($scope.campaignName);

        var data = { 'name' : $scope.campaignName, 'genre' : $scope.campaignGenre, 'text' :  $scope.campaignText }
        var url = 'http://localhost:8000/api/campaigns';
        //var url = 'http://localhost:8000/api/admin';


        $http.post(url, data ).then(function(data){
            console.log("success");
        }, function(data) {
            console.log(data)
        });
    }

    $scope.getCampaigns();

});
angular.module('ShApp')

.factory('CampaignService', function($http, $sce, DbService) {
	var factory = {};

	factory.campaign = function(data, myId)
	{
        var status_applying = 1;
        var status_playing = 2;

        data.created_at = new Date( data.created_at );
        data.updated_at = new Date( data.updated_at );
        //data.description = $sce.trustAsHtml(data.description);

        var player_characters = data.player_characters;
        data.players = [];
        data.appliers = [];
        $.each( player_characters, function( index, value ){
            if(value.status == status_applying) data.appliers.push(value);
            if(value.status == status_playing) data.players.push(value);
        });
        return data;
	}

    factory.identifyCampaign = function(campaignId) {
        return DbService.identifyCampaign(campaignId).then(function successCallback(response) {
            return response.data;
        }, function errorCallback(response) {
            $location.path("error/500");
        });
    }

    factory.validateImgUrl = function(imgUrl) {
        var imgUrl = formdata.image_url;
        var flickDomain = "staticflickr.com";
        return imgUrl.indexOf(flickDomain) < 0 ? false : true;
    }

    factory.saveApplication = function(campaignId, formdata) {
        // If image url dose not contain staticflickr.com
        // then dont accept the image.

        console.log(formdata);

        var imgUrl = formdata.image_url;
        var flickDomain = "staticflickr.com";

        if (imgUrl.indexOf(flickDomain) < 0) {
            console.log("Ej godkänd.");
        } else {
            console.log("godkänd");
        }

        return;
        return DbService.saveApplication(campaignId).then(function successCallback(response) {
            return response.data;
        }, function errorCallback(response) {
            $location.path("error/500");
        });
    }

	return factory;

});
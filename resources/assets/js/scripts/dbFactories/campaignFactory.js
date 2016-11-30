angular.module('ShApp')

.factory('CampaignFactory', ['$resource',
    function($resource) {
        //return $resource('/api/campagin/:campaign_id');
        // var url =  var url = './api/campaign';;
        return $resource('/api/campaign/:campaign_id', {}, {
        	campaigns : { method : "GET", url : "/api/campaign" },
            identify : { method : "GET", url: "/api/identify_campaign/:id" },
            applyingPlayingCharacters : { method : "GET", url: "/api/camp_applications_setup/:id"},
            editCampaign : { method : "GET", url : "/api/campaign/:id/edit" },
            update : { method : "PUT", url : "/api/campaign/:id" },
            activate : {method : "GET", url : "/api/activate_campaign/:id "},
            setupRpg : {method : "GET", url : "/api/setup_rpg/:id "}
        });
    }
]);

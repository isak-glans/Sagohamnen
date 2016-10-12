angular.module('ShApp')

.factory('CampaignFactory', ['$resource',
    function($resource) {
        //return $resource('/api/campagin/:campaign_id');
        return $resource('/api/campaign/:campaign_id', {}, {
            identify : { method : "GET", url: "/api/identify_campaign/:id" },
            applyingPlayingCharacters : { method : "GET", url: "/api/camp_applications_setup/:id"}
        });
    }
]);
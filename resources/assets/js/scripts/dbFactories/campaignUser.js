angular.module('ShApp')

.factory('CampaignUser', ['$resource',
    function($resource) {
        //return $resource('/api/campagin/:campaign_id');
        return $resource('/api/campaign_user/:id', {}, {});
    }
]);
angular.module('ShApp')

.factory('Campaign', ['$resource',
    function($resource) {
        //return $resource('/api/campagin/:campaign_id');
        return $resource('/api/campagin/:campaign_id', {}, {
            identify : { method : "GET", url: "/api/identify_campaign/:id" }
        });
    }
]);
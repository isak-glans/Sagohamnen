angular.module('ShApp')

.factory('CharacterFactory', ['$resource',
    function($resource) {
        //return $resource('/api/campagin/:campaign_id');
        return $resource('/api/character/:id', {}, {
        	leaveCampaign : { method : "GET", url: "/api/character/:id/leave_campaign" },
        	changeStatus : {method: "GET", url: "/api/character/:id/status/:status" }
        });
    }
]);
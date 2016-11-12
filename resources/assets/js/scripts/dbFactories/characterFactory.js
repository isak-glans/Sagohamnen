angular.module('ShApp')

.factory('CharacterFactory', ['$resource',
    function($resource) {
        //return $resource('/api/campagin/:campaign_id');
        return $resource('/api/character/:id', {}, {
        	changeStatus : {method: "GET", url: "/api/character/:id/status/:status"},
        	update : {method: "PUT", url: "/api/character/:id" }
        });
    }

    //, params:{id:'@id', status:'@status'}
]);
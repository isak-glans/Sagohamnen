angular.module('ShApp')

.factory('CharacterFactory', ['$resource',
    function($resource) {
        //return $resource('/api/campagin/:campaign_id');
        return $resource('/api/character/:id', {}, {
        });
    }
]);
angular.module('ShApp')

.factory('ChronicleFactory', ['$resource',
    function($resource) {
        //return $resource('/api/campagin/:campaign_id');
        return $resource('/api/chronicle/:id', {}, {
        	/*save: { method: 'POST' , isArray: false},*/
        });
    }

    //, params:{id:'@id', status:'@status'}
]);
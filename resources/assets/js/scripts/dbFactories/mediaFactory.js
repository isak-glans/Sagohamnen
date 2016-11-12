angular.module('ShApp')

.factory('MediaFactory', ['$resource',
    function($resource) {
        return $resource('/api/portraits/:id', {}, {
            fetch_portraits : { method : "GET", url : "/api/fetch_portraits" }
        });
    }
]);
angular.module('ShApp')

.factory('DbService', function($http) {

    return {
        // get all the comments
        getCampaigns : function() {
            var url = 'http://localhost:8080/sagohamnen_laravel/public/api/campaigns';
            return $http.get(url);
        },

        getCampaign : function(id){
            var url = 'http://localhost:8080/sagohamnen_laravel/public/api/campaign/' + id;
            return $http.get(url);
        }

        // save a comment (pass in comment data)
        /*save : function(commentData) {
            return $http({
                method: 'POST',
                url: '/api/comments',
                headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                data: $.param(commentData)
            });
        },*/

        // destroy a comment
        /*destroy : function(id) {
            return $http.delete('/api/comments/' + id);
        }*/
    }

});
angular.module('ShApp')

.factory('DbService', function($http) {

    return {
        // get all the comments
        getCampaigns : function() {
            var url = './api/campaigns';
            return $http.get(url);
        },

        getCampaign : function(id){
            var url = 'http://localhost:8080/sagohamnen_laravel/public/api/campaign/' + id;
            return $http.get(url);
        }

    }

});
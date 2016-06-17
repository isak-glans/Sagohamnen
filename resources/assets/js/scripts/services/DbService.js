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
        },


        postLogin : function() {
            $http.get('./api/mytoken').then(function(token_data){
                var user_data = {email : 'isakglans@hotmail.com', password : 'bananskruv', _token : token_data.token };
                $http.post('/login', user_data ).then(function(data){
                    console.log("Success");
                }, function() {
                    console.log("Failure");
                });
            });
        },

        getLogout : function() {
            return $http.get('./logout');
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
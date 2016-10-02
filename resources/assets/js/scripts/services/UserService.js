angular.module('ShApp')

.factory('UserService', function($http) {

	var factory = {};

	factory.csrf = "";

	factory.name_and_id = function() {
		return $http.get('./api/username_and_id');
	}

	factory.login = function() {
		console.log("UserService rad 14");
		/*$http.get('./api/mytoken').then(function(response){
			console.log("Token: ", response.data.token );
			factory.csrf = response.data.token;
            var user_data = {email : 'isakglans@hotmail.com', password : 'bananskruv', _token : response.data.token };
            $http.post('/login', user_data ).then(function(data){
                console.log(data);
                return true;
            }, function() {
                return false;
            });
        });*/
	};

	factory.logout = function() {
		return $http.get('./logout');
	};

	return factory;

});
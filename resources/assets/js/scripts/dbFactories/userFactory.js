angular.module('ShApp')

.factory('UserFactory', ['$resource',
    function($resource) {
        //return $resource('/api/campagin/:campaign_id');
        return $resource('/api/user/:userId', {}, {
        	setupEditUser : {method: "GET", url: "/api/user/:id/edit"},
        	updateA : {method: "PUT", url: "/api/user/:id"},
        	loadUser : {method : "GET", url: '/api/username_and_id' },
        	logIn : {method : "GET", url: '/api/username_and_id' },
        	logOut : {method : "GET", url: '/logout' }
        });
    }
]);
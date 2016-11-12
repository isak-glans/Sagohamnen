angular.module('ShApp')

// inject the Comment service into our controller
.controller('MainController', function($scope, UserService, PortraitService, $rootScope) {

    //Here your view content is fully loaded !!
    $scope.$on('$viewContentLoaded', function(){
        loadUser();
        PortraitService.loadPortraits();
    });

    function loadUser(){
        UserService.loadUser();
    };

});


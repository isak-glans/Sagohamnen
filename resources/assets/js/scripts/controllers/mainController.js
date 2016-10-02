angular.module('ShApp')

// inject the Comment service into our controller
.controller('MainController', function($scope, $http, DbService, UserService) {

	/*--------------------------------*/
    /*       User methods             */
    /*--------------------------------*/
    var userMenu = $('#user_menu');
    var usernameSpan = $('#user_menu .username');
    var userSettingsIcon = $('#user_section .glyphicon');
    var userLoginBt = $('#user_section .loginBt');
    var userBox = $('#user_section .user_bootstrap');

    $scope.username = "";
    $scope.id = 0;
    $scope.signedIn = false;
    $scope.userOptions = [];

    var init = function() {
        loginUser();
    }
    init();

    $scope.logIn = function() {
        loginUser();
    }

    $scope.logOut = function() {
        UserService.logout().then(function() {
            updateUserMenu();
        }, function() {
            console.log("Misslyckades att utlogga");
        });
    };

    $scope.showUserMenu = function() {
        userMenu.slideToggle();
    }

    function loginUser(){
        UserService.name_and_id().then(function(result) {
            $scope.myName = result.data.name;
            $scope.myId = result.data.id;
            $scope.meSignedIn = result.data.signed_in;
        });
    };

    var updateUserMenu = function(logedIn) {
        usernameSpan.html($scope.myName);

        $scope.userOptions = [];

        if (logedIn) {
            //userLoginBt.hide();
            var option = {'href' : './logout', 'text' : 'Logga ut' };
            $scope.userOptions.push(option);
        } else {
            //userLoginBt.show();
            userBox.hide();
            var option = {'href' : '#/login', 'text' : 'Logga in' };
            $scope.userOptions.push(option);
        }

        /*<li><a ng-href="#/login">Logga in</a><li>
                        <li><a href="./logout">Logga ut</a><li>*/
    }

    var editUser_save = function() {
        console.log("Spara");
    }

});
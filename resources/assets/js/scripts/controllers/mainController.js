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
    $scope.userOptions = [];

    var init = function() {
    	console.log("init");
        loginUser();
    }
    init();

    $scope.logIn = function() {
        loginUser();
    }

    $scope.logOut = function() {
        UserService.logout().then(function() {
            console.log("Utloggad");
            updateUserMenu();
        }, function() {
            console.log("Misslyckades att utlogga");
        });
    };

    $scope.showUserMenu = function() {
        console.log("Show");
        userMenu.slideToggle();
    }

    function loginUser(){
        UserService.name().then(function(result) {
            console.log(result);
            $scope.username = result.data;

            var signedIn = $scope.username != "" ? true : false;
            console.log(signedIn);
            updateUserMenu(signedIn);
        });
    };

    var updateUserMenu = function(logedIn) {
        console.log("Update menu..");
        usernameSpan.html($scope.username);

        $scope.userOptions = [];

        if (logedIn) {
            console.log("Inloggad");
            userLoginBt.hide();
            var option = {'href' : './logout', 'text' : 'Logga ut' };
            $scope.userOptions.push(option);
        } else {
            console.log("Inte Inloggad");
            userLoginBt.show();
            userBox.hide();
            var option = {'href' : '#/login', 'text' : 'Logga in' };
            $scope.userOptions.push(option);
        }


        /*<li><a ng-href="#/login">Logga in</a><li>
                        <li><a href="./logout">Logga ut</a><li>*/
    }


});
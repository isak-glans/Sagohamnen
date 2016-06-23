var sagohamnenApp = angular.module('ShApp', ["ngRoute"]);



sagohamnenApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/home.html"
    })
    .when("/home", {
        templateUrl : "views/home.html"
    })
    .when("/campaign/new", {
        templateUrl : "views/campaigns/new_campaign.html",
        controller: 'CampaignController'
    })
    .when("/login", {
        templateUrl : "views/users/login.html"
    });
});
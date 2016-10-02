var sagohamnenApp = angular.module('ShApp', ["ngRoute", "ngSanitize", "ngResource"]);

sagohamnenApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/home.html"
    })
    .when("/home", {
        templateUrl : "views/home.html"
    })
    .when("/user/edit/:userId", {
        templateUrl : "views/users/edit_user.html",
        controller  : "UserController"
    })
    .when("/user/:userId", {
        templateUrl : "views/users/single_user.html",
        controller  : "UserController"
    })
    .when("/campaign/:campaignId", {
        templateUrl : "views/campaigns/campaign.html",
        controller  : 'CampaignController'
    })
    .when("/campaign/:campaignId/edit", {
        templateUrl : "views/campaigns/edit_campaign.html",
        controller  : 'CampaignController'
    })
    .when("/campaign_apply/:campaignId", {
        templateUrl : "views/campaigns/campaign_apply.html",
        controller  : 'CampaignController'
    })
    .when("/campaign_participants/:campaignId", {
        templateUrl : "views/campaigns/campaign_participants.html",
        controller  : 'CampaignController'
    })
    .when("/campaign/new", {
        templateUrl : "views/campaigns/new_campaign.html",
        controller  : 'CampaignController'
    })
    .when("/campaign/:campaignId/chronicle/:pageNr", {
        templateUrl : "views/chronicles/chronicles.html",
        controller  : 'ChronicleController'
    })
    .when("/character/:characterId", {
        templateUrl : "views/characters/character.html",
        controller  : 'SingleCharacterCtrl'
    })
    .when("/edit_character/:characterId", {
        templateUrl : "views/characters/edit_character.html",
        controller  : 'EditCharacterCtrl'
    })
    .when("/error/401", {
        templateUrl : "views/error/401.html"
    })
    .when("/error/403", {
        templateUrl : "views/error/403.html"
    })
    .when("/error/404", {
        templateUrl: "views/error/404.html"
    })
    .when("/error/500", {
        templateUrl: "views/error/500.html"
    })
    .when("/login", {
        templateUrl : "views/users/login.html"
    });
});

sagohamnenApp.filter("show_linebreaks", function($filter) {
 return function(data) {
   if (!data) return data;
   return data.replace(/\n\r?/g, '<br />');
 };
});
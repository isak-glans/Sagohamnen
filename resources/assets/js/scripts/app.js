var sagohamnenApp = angular.module('ShApp', ["ngRoute", "ngSanitize", "ngResource"]);

sagohamnenApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/campaigns/all_campaigns.html",
        controller : "CampaignController"
    })
    .when("/home", {
        templateUrl : "views/campaigns/all_campaigns.html",
        controller : "CampaignController"
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
        controller  : 'SingleCampaignCtrl',
        resolve: {
            campaignData: function(CampaignFactory,$route){
                return CampaignFactory.get({campaign_id : $route.current.params.campaignId}).$promise;
            }
        }
    })
    .when("/campaign/:campaignId/edit", {
        templateUrl : "views/campaigns/edit_campaign.html",
        controller  : 'CampaignController'
    })
    .when("/campaign_apply/:campaignId", {
        templateUrl : "views/campaigns/campaign_apply.html",
        controller  : 'ApplyCampaignCtrl'
    })
    .when("/campaign_applications/:campaignId", {
        templateUrl : "views/campaigns/camp_applications.html",
        controller  : 'CampApplicationCtrl',
        resolve: {
            campaignData: function(CampaignFactory,$route){
                return CampaignFactory.applyingPlayingCharacters({id : $route.current.params.campaignId}).$promise;
            }
        }
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

sagohamnenApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
        return {
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    $location.path('/error/403'); // Replace with whatever should happen
                }
                 if(response.status === 500) {
                    $location.path('/error/500');
                 }
                return $q.reject(response);
            }
        };
    }]);
}]);


sagohamnenApp.filter("show_linebreaks", function($filter) {
 return function(data) {
   if (!data) return data;
   return data.replace(/\n\r?/g, '<br />');
 };
});

sagohamnenApp.constant('config', {
    charStatusNone                  :0,
    charStatusApplying              :1,
    charStatusPlaying               :2,
    charStatusSlp                   :3,
    charStatusDeleted               :4,
    campaginUserStatusNone          :0,
    campaignUserStatusApplying      :1,
    campaignUserStatusPlaying       :2,
    campaignUserStatusGamemaster    :3,
    campaignUserStatusBlocked       :4,
});


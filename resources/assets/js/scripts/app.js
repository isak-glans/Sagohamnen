var sagohamnenApp = angular.module('ShApp', ["ngRoute", "ngSanitize", "ngResource",  "ngMaterial", 'ui.bootstrap', 'luegg.directives', 'ui.select' ]);

sagohamnenApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/campaigns/all_campaigns.html",
        controller : "CampaignsCtrl",
        resolve: {
            campaignsData: function(CampaignFactory,$route){
                return CampaignFactory.campaigns().$promise;
            }
        }
    })
    .when("/home", {
        templateUrl : "views/campaigns/all_campaigns.html",
        controller : "CampaignsCtrl",
        resolve: {
            campaignsData: function(CampaignFactory,$route){
                return CampaignFactory.campaigns().$promise;
            }
        }
    })
    .when("/edit_user/:userId", {
        templateUrl : "views/users/edit_user.html",
        controller  : "EditUserCtrl",
        resolve: {
            setupEditUserData: function(UserFactory,$route){
                return UserFactory.setupEditUser({id : $route.current.params.userId}).$promise;
            }
        }
    })
    .when("/user/:userId", {
        templateUrl : "views/users/single_user.html",
        controller  : "SingleUserCtrl",
        resolve: {
            userData: function(UserFactory,$route){
                return UserFactory.get({userId : $route.current.params.userId}).$promise;
            }
        }
    })
    .when("/campaign/new", {
        templateUrl : "views/campaigns/new_campaign.html",
        controller  : 'newCampaignCtrl',
    })
    .when("/campaign/:campaignId", {
        templateUrl : "views/campaigns/single_campaign.html",
        controller  : 'SingleCampaignCtrl',
        resolve: {
            campaignData: function(CampaignFactory,$route){
                return CampaignFactory.get({campaign_id : $route.current.params.campaignId}).$promise;
            }
        }
    })
    .when("/edit_campaign/:campaignId", {
        templateUrl : "views/campaigns/edit_campaign.html",
        controller  : 'EditCampaignCtrl',
        resolve: {
            editCampaignData: function(CampaignFactory,$route){
                return CampaignFactory.editCampaign({id : $route.current.params.campaignId}).$promise;
            }
        }
    })
    .when("/campaign_apply/:campaignId", {
        templateUrl : "views/campaigns/campaign_apply.html",
        controller  : 'ApplyCampaignCtrl',
        resolve: {
            identifyCampaign: function(CampaignFactory,$route){
                return CampaignFactory.identify({id : $route.current.params.campaignId}).$promise;
            },
            portraitData : function(PortraitService){
                return PortraitService.loadPortraits();
            }
        }
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
    .when("/campaign/:campaignId/chronicle/:pageNr", {
        templateUrl : "views/chronicles/chronicles.html",
        controller  : 'ChronicleController'
    })
    .when("/character/:characterId", {
        templateUrl : "views/characters/single_character.html",
        controller  : 'SingleCharacterCtrl',
        resolve: {
            singleCharacter: function(CharacterFactory,$route){
                return CharacterFactory.get({id : $route.current.params.characterId}).$promise;
            }
        }
    })
    .when("/edit_character/:characterId", {
        templateUrl : "views/characters/edit_character.html",
        controller  : 'EditCharacterCtrl',
        resolve : {
            portraitData : function(PortraitService){
                return PortraitService.loadPortraits();
            }
        }
    })
    .when("/rpg/:campaignId", {
        templateUrl : "views/rpg/single_rpg.html",
        controller  : 'SingleRpgCtrl',
        resolve: {
            setupData: function(CampaignFactory,$route){
                return CampaignFactory.setupRpg({id : $route.current.params.campaignId}).$promise;
            },
            portraitData : function(PortraitService){
                return PortraitService.loadPortraits().$promise;
            }
        }
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
    $httpProvider.interceptors.push(['$q', '$location', '$rootScope', function ($q, $location, $rootScope) {
        return {
            'responseError': function(response) {
                if(response.status === 401) {
                    $location.path('/error/403'); // Replace with whatever should happen
                }
                else if (response.status === 403 ){
                    // Ask the user to login?
                    $rootScope.signedIn = false;
                    $rootScope.$broadcast('loginChange', { logedIn: false });
                    $location.path('/error/403'); // Replace with whatever should happen
                }
                else if(response.status === 500) {
                    $location.path('/error/500');
                 }
                return $q.reject(response);
            }
        };
    }]);
}]);







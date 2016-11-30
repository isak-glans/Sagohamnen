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







angular.module('ShApp')
.filter('start', function () {
        return function (input, start) {
            if (!input || !input.length) { return; }

            start = +start;
            return input.slice(start);
        };
    })

.filter("show_linebreaks", function($filter) {
 return function(data) {
   if (!data || data == null || typeof data !== 'string' ) return data;
   return data.replace(/\n\r?/g, '<br />');
 };
});

angular.module('ShApp').filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});


function helloWorld(a,b) {

	return a + b;
}
sagohamnenApp.constant('config', {
    charStatusArchived              :0,
    charStatusApplying              :1,
    charStatusPlaying               :2,
    charStatusNpc                   :3,
    charStatusDeleted               :4,
    charStatusBlocked               :5,
    campaginArchived                :0,
    campaginActive                  :1,

    rpgChatStyleMessage				:0,
    rpgChatStyleDie					:1,


});
angular.module('ShApp')

// inject the Comment service into our controller
.controller('ChronicleController', function($scope, $http, DbService, $routeParams, $sce, $location, ChronicleService, $route ) {

	$scope.init = function() {
		$scope.chronicles();
	}

	$scope.chronicles = function() {
		var campaignId 	= $routeParams.campaignId;
		var pageNr 		= $routeParams.pageNr;
		/*console.log($routeParams);
		console.log(campaignId, pageNr);*/
		ChronicleService.chroniclesPerPage(campaignId,pageNr).then(function successCallback(response) {
			console.log(response);
			$scope.chronicles = response.chronicles;
			$scope.campaign = response.campaign;
		}, function errorCallback(response) {

		});
	}
});

angular.module('ShApp')

// inject the Comment service into our controller
.controller('MainController', function($scope, UserService, PortraitService, $rootScope, SessionFactory) {

	$scope.init = function(){
		setTimeout(function() {
	        login();
		},1 );
	}

    function login(){
        UserService.login();
    };

    $scope.init();
});



angular.module('ShApp')

.factory('CampaignFactory', ['$resource',
    function($resource) {
        //return $resource('/api/campagin/:campaign_id');
        // var url =  var url = './api/campaign';;
        return $resource('/api/campaign/:campaign_id', {}, {
        	campaigns : { method : "GET", url : "/api/campaign" },
            identify : { method : "GET", url: "/api/identify_campaign/:id" },
            applyingPlayingCharacters : { method : "GET", url: "/api/camp_applications_setup/:id"},
            editCampaign : { method : "GET", url : "/api/campaign/:id/edit" },
            update : { method : "PUT", url : "/api/campaign/:id" },
            activate : {method : "GET", url : "/api/activate_campaign/:id "},
            setupRpg : {method : "GET", url : "/api/setup_rpg/:id "}
        });
    }
]);

angular.module('ShApp')

.factory('CharacterFactory', ['$resource',
    function($resource) {
        //return $resource('/api/campagin/:campaign_id');
        return $resource('/api/character/:id', {}, {
        	changeStatus : {method: "GET", url: "/api/character/:id/status/:status"},
        	update : {method: "PUT", url: "/api/character/:id" }
        });
    }

    //, params:{id:'@id', status:'@status'}
]);
angular.module('ShApp')

.factory('ChronicleFactory', ['$resource',
    function($resource) {
        //return $resource('/api/campagin/:campaign_id');
        return $resource('/api/chronicle/:id', {}, {
        });
    }

    //, params:{id:'@id', status:'@status'}
]);
angular.module('ShApp')

.factory('MediaFactory', ['$resource',
    function($resource) {
        return $resource('/api/portraits/:id', {}, {
            fetch_portraits : { method : "GET", url : "/api/fetch_portraits" }
        });
    }
]);
angular.module('ShApp')

.factory('RpgChatFactory', ['$resource',
    function($resource) {
        return $resource('/api/rpg_chat/:campaignId', {}, {
        	newestChats : { method : "GET", url : "/api/rpg_update/:campaignId/newest/:chatId/:chronicleId" }
        });
    }
]);
angular.module('ShApp')

.factory('SessionFactory', [ function() {

	var factory = {};

	factory.setKey = function(key, value){
		sessionStorage.setItem(key, value);
	}
	factory.getKey = function(key){
		return sessionStorage.getItem(key);
	}
	factory.deleteKey = function(key){
		sessionStorage.removeItem(key);
	}

	return factory;
}
]);
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
angular.module('ShApp')

.directive('chronicleEntry', function() {
    var result = {};
    result.restrict =  'E';
    result.templateUrl = "views/chronicles/chronicle_directive.html";

    return result;
});
angular.module('ShApp')
.directive('routeLoadingIndicator', function($rootScope, $route, $timeout) {
  return {
    restrict: 'E',
    replace: true,
    template: "<div class='col-lg-12' ng-if='isRouteLoading'><h1>Loading <i class='fa fa-spinner' aria-hidden='true'></i></h1></div>",
    link: function(scope, element) {

      $rootScope.$on('$routeChangeStart', function(event, currentRoute, previousRoute) {
        console.log("Nu laddas en route.");
        scope.isRouteLoading = true;

        if (previousRoute) return;

        $timeout(function() {
          element.removeClass('ng-hide');
        });
      });

      $rootScope.$on('$routeChangeSuccess', function() {
        element.addClass('ng-hide');
        scope.isRouteLoading = false;
      });
    }
  };
});



/*var routeLoadingIndicator = function($rootScope, $route, $timeout){
  return {
    restrict:'E',
    template:"<h1 ng-if='isRouteLoading'>Loading...</h1>",
    link:function(scope, elem, attrs){
      scope.isRouteLoading = true;

      console.log("Inne i routerLoeaderDir");

      $rootScope.$on('$routeChangeStart', function(){
        scope.isRouteLoading = true;
        console.log("Nu laddas en route.");
      });

      $rootScope.$on('$routeChangeSuccess', function(){
        scope.isRouteLoading = false;
        console.log("Nu har en route laddats klart.");
      });



    }
  };
};*/

angular.module('ShApp')

.factory('CampaignService', function($http, $sce, DbService, config) {
	var factory = {};

	factory.campaign = function(data, myId)
	{
        var status_applying = config.charStatusApplying;
        var status_playing = config.charStatusPlaying;

        data.created_at = new Date( data.created_at );
        data.updated_at = new Date( data.updated_at );
        //data.description = $sce.trustAsHtml(data.description);

        var player_characters = data.player_characters;
        data.players = [];
        data.appliers = [];
        $.each( player_characters, function( index, value ){
            if(value.status == status_applying) data.appliers.push(value);
            if(value.status == status_playing) data.players.push(value);
        });
        return data;
	}

    factory.identifyCampaign = function(campaignId) {
        return DbService.identifyCampaign(campaignId).then(function successCallback(response) {
            return response.data;
        }, function errorCallback(response) {
            $location.path("error/500");
        });
    }

    factory.validateImgUrl = function(imgUrl) {
        var imgUrl = formdata.image_url;
        var flickDomain = "staticflickr.com";
        return imgUrl.indexOf(flickDomain) < 0 ? false : true;
    }

    factory.saveApplication = function(campaignId, formdata) {
        // If image url dose not contain staticflickr.com
        // then dont accept the image.

        console.log(formdata);

        var imgUrl = formdata.image_url;
        var flickDomain = "staticflickr.com";

        if (imgUrl.indexOf(flickDomain) < 0) {
            console.log("Ej godkänd.");
        } else {
            console.log("godkänd");
        }

        return;
        return DbService.saveApplication(campaignId).then(function successCallback(response) {
            return response.data;
        }, function errorCallback(response) {
            $location.path("error/500");
        });
    }

	return factory;

});
angular.module('ShApp')

.factory('CharacterService', function($http, $sce,  DbService) {
	var factory = {};

	factory.getInfo = function(characterId) {

	}

	return factory;
});
angular.module('ShApp')

.factory('ChronicleService', function($http, $sce, DbService) {

	var factory = {};

	factory.chroniclesPerPage = function(campaignId,pageNr) {
		var result;

		return DbService.chroniclesPerPage(campaignId, pageNr).then(function successCallback(response) {
            //console.log(response);
            return response.data;
        }, function errorCallback(response) {
            if(response.status == 404) {
                $location.path("error/404");
            }
        });

        //return result;
	}


	return factory;

});
angular.module('ShApp')

.factory('DbService', function($http) {

    return {
        // get all the comments
        getCampaigns : function() {
            var url = './api/campaign';
            return $http.get(url);
        },

        getCampaign : function(id){
            var url = './api/campaign/' + id;
            return $http.get(url);
        },

        identifyCampaign : function(campaignId) {
            var url = './api/identify_campaign/' + campaignId;
            return $http.get(url);
        },

        updateCampaign : function(changedData){
            var url = './api/campaign/' + changedData.id ;
            //var url = './api/campaigns/' + id + '/edit';
            //return $http.post(url, $.param(changedData));
            return $http.put(url, changedData);
        },

        applyToCampaign : function(campaignId, userId){
            var url = "./api/apply_to_campaign/" + campaignId ;
            return $http.get(url);
        },

        saveApplication : function(campaignId){
            var url = "./api/save_application/" + campaignId ;
            return $http.get(url);
        },

        getUser : function(id) {
            var url = './api/user/' + id;
            return $http.get(url);
        },

        updateUser : function(changedData){
            var url = "./api/user/" + changedData.id;
            return $http.put(url, changedData);
        },

        chroniclesPerPage : function(campaign_id, pageNr){
            var url = "./api/campaign/" + campaign_id + "/page/" + pageNr;
            return $http.get(url);
        },

        searchPortrait : function(tag, pageNr){
            var url = "./api/portraits";
            return $http.post(url, {'tag' : tag, 'page_nr' : pageNr });
        }

    }

});
angular.module('ShApp')

.factory('NavigationService', function($http, $sce, $rootScope) {

    //$rootScope.navigation.url = {'title' : '', 'active': false, 'url':'#' };
	var factory = {};

    factory.set = function(navArray){
        /*$rootScope.navigation.url = url;
        $rootScope.navigation.title = title;
        $rootScope.navigation.active = active;*/
        //$rootScope.navigation.push({'title' : title, 'active': false, 'url':'#' });
        $rootScope.navigation = navArray;
        //$rootScope.$apply();
    }

	return factory;

});

angular.module('ShApp')

.factory('PortraitService', function(config, MediaFactory, $q) {
	var factory = {};
	factory.all_portraits = [];

	factory.loadPortraits = function(){
		var deferred = $q.defer();

		if (factory.all_portraits.length > 0){
			console.log("Porträtt finns redan.");
			deferred.resolve();
			return deferred;
		}

		var result = MediaFactory.fetch_portraits().$promise
		result.then(function(response){
			factory.all_portraits = response.portraits;
		}, function(error) {
			console.log("Error");
		});

		return result;
	}

	factory.fetchPortraits = function(){
		return MediaFactory.fetch_portraits().$promise;
	}

	factory.setPortraits = function(data){
		factory.all_portraits = data;
	}

	return factory;

});
angular.module('ShApp')

.factory('RpgService', function(RpgChatFactory, UserService, config, $rootScope, PortraitService, $q, ChronicleFactory) {

	var factory = {};
	//factory.portraits = [];
	factory.onlineUsersId = [];
	factory.onlineUsers = [];
	factory.users = [];
	factory.characters = [];
	factory.portraits = [];
	factory.info = {
		readyForLoop	: false,
		readyForLoop	: false,
		updateCounter 	: 0,
		updateDelay		: 3000,
		lastReadChatId	: 0,
		lastReadChronicleId	: 0,
		campaignId 		: 0,
		gmId			: 0,
	}
	var timerId = 0;

	factory.init = function(setupData){
		// Restart counter when page load.
		factory.info.updateCounter = 0;
		factory.info.updateDelay = 3000;
		factory.info.lastReadChatId = 0;
		factory.info.lastReadChronicleId = 0;
		// Store importent info.
		factory.info.campaignId = setupData.campaign.id;
		factory.info.gmId		= setupData.campaign.user_id;
		factory.users 			= setupData.users;
		factory.characters 		= setupData.characters;

		console.log("Porträtt", PortraitService.all_portraits);

		// Fetch the portraits.
		giveCharactersPortraits(factory.characters);



		// Run the shit!
		chatLoop();

	}

	factory.myCharacters = function(){
		var myCharacters = [];

		// If user is gm, add an extra option for "no" character.
		if (meGm() ){
			myCharacters.push( {id:"0", name:"Ingen", portrait_id:0});
		}

		// Collect those characters that are the user´s.
		factory.characters.forEach(function(character){
			if (character.id == UserService.currentUser.id) {
				myCharacters.push(character);
			}
		});

		return myCharacters;
	}

	factory.getNewest = function() {
		var lastReadChatId = factory.info.lastReadChatId;
		var lastRecievedChronicleId = factory.info.lastReadChronicleId;
		var campaignId = factory.info.campaignId;

		// Fetch updates.
		RpgChatFactory.newestChats({'campaignId': campaignId,
			'chatId' : lastReadChatId, 'chronicleId': lastRecievedChronicleId }).$promise.then(function(response){
			callback_Updates(response);
		}, function(error) {
			console.log(error);
		});
	}

	factory.storeChat = function(message, campaignId) {
		factory.info.updateCounter = 0;
		storeRpgChat(message, campaignId, config.rpgChatStyleMessage).then(function(){
			factory.getNewest();
		});
	}

	factory.storeChronicle = function(message, characterId) {
		factory.info.updateCounter = 0;
		var chronicle = new ChronicleFactory;
		chronicle.text 			= message;
		chronicle.campaign_id 	= factory.info.campaignId;
		chronicle.character_id 	= characterId;
		chronicle.$save();
		console.log("Sparar");
	}

	factory.storeDie = function(message, campaignId, type) {
		//toreRpgChat(message, campaignId, config.rpgChatStyleDie);
	}

	factory.stopPulling = function(){
		clearInterval(timerId);
	}

	// ===================================
	// PRIVATE FUNCTIONS
	// ===================================

	var callback_Updates = function(response){
		var newChronicles = [];
		var newChats = [];
		var newDices = [];

		// Last chat and chronicle id:s
		var latestChatId = response.newest_chats.last_chat_id;
		var latestChronicleId = response.newest_chronicles.last_chronicle_id;

		// Active users
		var currentOnlineUsersId = response.active_users;
		var onlineUsersChanged = simpleArraysEqual(factory.onlineUsersId, currentOnlineUsersId) == true ? false : true;

		if( onlineUsersChanged ){
			var currentOnlineUsers = [];

			// Iterate and add name and avatar to list.
			currentOnlineUsersId.forEach(function(userId){
				var data = findUser(userId);
				currentOnlineUsers.push({'id' : userId, 'name': data.name, 'avatar' : data.avatar});
			});

			factory.onlineUsers 	= currentOnlineUsers;
			factory.onlineUsersId 	= currentOnlineUsersId;
		}

		// If new chronicles
		if (latestChronicleId > factory.info.lastReadChronicleId) {

			// Remember if new chronicles arrived.
			factory.info.lastReadChronicleId = latestChronicleId;

			// Fetch new chronicles.
			newChronicles = response.newest_chronicles.chronicles;

			newChronicles.reverse();

			// Attach info.
			newChronicles.forEach(function(row){

				// If GM add style class.
				if (row.user_id == factory.info.gmId)
					row.styleClass = "entry-chronicle-gm";

				// Attach portrait url:s
				if (row.character !== null){
					// Add status classes.
					if (row.character.status == config.charStatusPlaying )
						row.styleClass = "entry-chronicle-player";
					else if (row.character.status == config.charStatusNpc )
						row.styleClass = "entry-chronicle-npc";
					else row.styleClass = "";

					row.character.portrait = findPortrait(row.character.portrait_id).thumbnail;
					//PortraitService.all_portraits[row.character.portrait_id].thumbnail;
				}

				// Find user
				row.name = findUser(row.user_id).name;
			});

			console.log("karaktärs", newChronicles);
		}

		// If new chats.
		if (latestChatId > factory.info.lastReadChatId ) {
			factory.info.lastReadChatId = latestChatId;
			factory.info.updateCounter = 0;

			// Get the new chats.
			newChats = response.newest_chats.chats;

			// Make some changes
			newChats.forEach(function(row){
				// Convert string to date.
	            row.date = new Date(row.date);

	            // Add username, wich was fetched with setupData.
	            row.name = findUser(row.user_id).name;

	            // if dices results
	            if (row.type == config.rpgChatStyleDie) {
	            	newDices.push(row);
	            }
	        });

			// Make sure the list of chats is not too large.
	        //TrimNrChats();

	        // Make newest appear last in list.
	        newChats.reverse();
		}

		// Transmit result to the controller.
		$rootScope.$broadcast('rpgUpdate', {
			'newChats'			: newChats,
			'newDices' 			: newDices,
			'newChronicles' 	: newChronicles,
			'activeUsers' 		: factory.onlineUsers,
			'onlineUsersChanged' : onlineUsersChanged });
	}

	var TrimNrChats = function() {
        var totalNr = factory.chats.length;
        var maxNrChats = 40;
        if ( totalNr > maxNrChats) {
            var nrToRemove = totalNr - maxNrChats;
            factory.chats.splice(0,nrToRemove);
        }
    }

	var chatLoop = function () {

		// Kill possible old timer.
		clearTimeout(timerId);

	    function updateLoop() {
	        factory.info.updateCounter += 1;
	        if (factory.info.updateCounter == 5)
	        	factory.info.updateDelay = 5000;
	        if (factory.info.updateCounter == 10)
	        	factory.info.updateDelay = 10000;
	        if (factory.info.updateCounter == 50)
	        	factory.info.updateDelay = 60000;
	        //console.log("Hämtar inlägg. counter: " + factory.info.updateCounter + " and delay: " + factory.info.updateDelay );
	        //console.log(factory.info.updateCounter);
	        factory.getNewest();


	        // Make this function loop.
	        timerId = setTimeout(updateLoop, factory.info.updateDelay)
	    }
	    updateLoop();
	}

	var storeRpgChat = function(message, campaignId, type) {
		var chat = new RpgChatFactory();
		chat.user_id		= UserService.currentUser.id;
		chat.text 			=  message;
		chat.campaign_id 	= campaignId;
		chat.type		 	= type;
		return chat.$save();
	}

    var findUser = function(userId)
    {
    	var data = {'name' : '', 'avatar' : ''};
    	factory.users.forEach(function(user){
    		if (user.id == userId) {
    			data.name = user.name;
    			data.avatar = user.avatar;
    		}
    	});
    	return data;
    }

    var simpleArraysEqual = function (array1, array2)
    {
    	var ok = true;
    	var i = 0;

    	if (array1.length != array2.length) return false;

    	// Sort it
    	array1.sort();
    	array2.sort();

    	array1.forEach(function(){
    		//debugger;
    		if (array1[i] != array2[i]) ok = false;
    		i++;
    	});

    	return ok;
    }

    var findPortrait = function(portraitID)
    {
    	var thePorrait;

    	if (!! PortraitService.all_portraits){
    		PortraitService.all_portraits.forEach(function(portrait){
    		if (portrait.id == portraitID)
	    		thePorrait = portrait;
	    	});
	    	return thePorrait;
    	} else {
    		console.log("Porträtten kunde inte hittas.");
    		return null;
    	}
    }

    var giveCharactersPortraits = function(characters)
    {
    	characters.forEach(function(character){
			character.portrait = {
				'thumbnail': findPortrait(character.portrait_id).thumbnail,
				'medium' : findPortrait(character.portrait_id).medium};
    	});
    }

    var meGm = function(){
    	return factory.info.gmId == UserService.currentUser.id;
    }
	return factory;

});
angular.module('ShApp')

.factory('TestService', function($q) {
	var factory = {};

	factory.tungUppgift = function() {
		var p = $q.defer();
		setTimeout(function(){
			p.resolve("Här är svaret!");
		}, 5000);
		return p.promise;
	}

	factory.tungUppgift2 = function(){
		var p = $q.defer();
		setTimeout(function(){
			p.resolve("Uppg2 svar!");
			console.log("Upp2 klar.");
		}, 3000);
		return p.promise;
	}

	factory.tungUppgift3 = function(){
		var p = $q.defer();
		setTimeout(function(){
			p.resolve("Uppg3 svar!");
			console.log("Upp3 klar.");
		}, 2000);
		return p.promise;
	}

	/*TestService.tungUppgift().then(function(svar){
            console.log("NU är det klart!", svar);
        })
            .then(TestService.tungUppgift2)
            .then(TestService.tungUppgift3)
            .then(function(){console.log("allt klart!");});*/

	return factory;
});
angular.module('ShApp')

.factory('UserService', function($http, $rootScope, UserFactory, $location, SessionFactory) {

	var factory = {};
	factory.csrf = "";
	factory.currentUser = {name : "", id: 0, loggedIn : false };

	factory.login = function() {
		// If userId exist in localstorage.
		if ( !!SessionFactory.getKey('userId') ) {
			factory.currentUser.id = SessionFactory.getKey('userId');
			factory.currentUser.name = SessionFactory.getKey('userName');
			factory.currentUser.loggedIn = true;
			updateUserMenu();
		} else {
			// User do not exist in local storage.
			// Therefor get it from the server.
			loadUserFromServer();
		}
	}

	factory.setUser = function(user){
		factory.currentUser = user;
	}

	factory.logout = function() {
		console.log("Loggar ut");
		UserFactory.logOut().$promise.then(function(response){
			factory.currentUser = {name : "", id: 0, loggedIn: false};

            SessionFactory.deleteKey('userId');
            SessionFactory.deleteKey('userName');

			factory.updateLogin();
			$location.path("/home");
		}, function(error) {
			console.log(error);
		});
	};

	factory.updateLogin = function(){
		$rootScope.$broadcast('loginChange', {});
	}

	function loadUserFromServer(){
		console.log("Laddar userinfo froms server");
		UserFactory.loadUser().$promise.then(function(response){
            // Store result as service property.
            factory.currentUser = {name :response.name, id: response.id, loggedIn : response.signed_in};

            // Save user in local storage.
            if (response.signed_in){
            	console.log("Fyller i localstorage nu...");
            	SessionFactory.setKey('userId', response.id);
            	SessionFactory.setKey('userName', response.name);
            }

			updateUserMenu();
        }, function(error) {
        	console.log(error);
        });
	}

	function updateUserMenu()
	{
		// Update the user menu button.
    	$rootScope.$broadcast('loginChange', {});
	}

	return factory;

});
angular.module('ShApp')

// inject the Comment service into our controller
.controller('ApplyCampaignCtrl', function($scope,  $location, identifyCampaign, CharacterFactory ) {

	$scope.form;
    $scope.campaign = { id : 0, name : ""};
    $scope.portrait = {id:6, url:"http://localhost:8000/assets/img/portraits/default.png"};

	$scope.campaignApplication_init = function() {
		$scope.campaign.id = identifyCampaign.id;
        $scope.campaign.name = identifyCampaign.name;
    }

    $scope.save = function() {
        $scope.apply.portrait_id = $scope.portrait.id;
        $scope.apply.campaign_id = $scope.campaign.id;

        console.log("portrait id " + $scope.apply.portrait_id);

        //return;

        CharacterFactory.save($scope.apply, function(data){
            $location.path("campaign/" + $scope.campaign.id);
        }, function(error){
            //console.log("error");
            $location.path("error/403");
        });
    }

    $scope.cancel = function() {
    	$location.path("campaign/" + $scope.campaign.id);
    }
});
angular.module('ShApp')
.controller('CampaignsCtrl', function($scope, $routeParams, $sce, $location, CampaignService, $route, NavigationService, campaignsData ) {

    NavigationService.set([]);

    $scope.setup = function() {
        $scope.campaigns = campaignsData.campaigns;
        $scope.can_create = Boolean(campaignsData.can_create);
    }

    $scope.setup();

});
angular.module('ShApp')

// inject the Comment service into our controller
.controller('CampApplicationCtrl', function($scope, $routeParams, $location, CampaignFactory, config, NavigationService, campaignData, CharacterFactory, $mdDialog ) {

    $scope.data = [];
    $scope.data.players = [];
    $scope.data.applicants = [];


	$scope.setupApplications = function(){
		var campaignId = $routeParams.campaignId;
        if( campaignId == null) $location.path("error/404");

        $scope.data.maxNrPlayers = campaignData.max_nr_players;
        $scope.data.name = campaignData.name;

        $.each(campaignData.characters, function( index, value ){
            if(value.status == config.charStatusApplying) $scope.data.applicants.push(value);
            if(value.status == config.charStatusPlaying) $scope.data.players.push(value);
        });

        // Update the main navigationmenu.
        NavigationService.set([{"url" : "/#/campaign/"+campaignData.id, 'title': campaignData.name, 'active' : false}, {"url" : '', 'title': 'Ansökningar', 'active' : true }]);
	}

	$scope.approveApplicant = function(applyer)
    {
       changeStatus(applyer, config.charStatusPlaying);
    };

    $scope.removePlayer = function(player)
    {
        changeStatus(player, config.charStatusApplying);
    }

    $scope.removeApplicant = function(event, player)
    {
        var confirm = $mdDialog.confirm()
          .title('Vill du verkligen ta bort ' + player.name + "?")
          .textContent('Karaktären kommer att bli arkiverad.')
          .ariaLabel('Sagohamnen.se')
          .targetEvent(event)
          .ok('Ja')
          .cancel('Nej');

        // Confirm delete.
        $mdDialog.show(confirm).then(function() {
            changeStatus(player, config.charStatusArchived);
        }, function() {
        });
    }

    function changeStatus(character, newStatus)
    {
        // Call backend API
        CharacterFactory.changeStatus({id : character.id,  status: newStatus }, function(response) {
            // On success.
            var fromArray, toArray;

            if (newStatus == config.charStatusApplying) {
                fromArray   =  $scope.data.players;
                toArray     = $scope.data.applicants;
            } else if (newStatus == config.charStatusPlaying) {
                fromArray    =  $scope.data.applicants;
                toArray      = $scope.data.players;
            } else if (newStatus == config.charStatusArchived) {

                // Remove from applicants array.
                var index = $scope.data.applicants.indexOf(character);
                if (index > -1) {
                    $scope.data.applicants.splice(index, 1);
                }
                return;
            }

            moveCharacter(character, fromArray, toArray);
        }, function(response){
            console.log("Failure");
        });
    }

    function moveCharacter(character, fromArray, toArray){
    	// Move it from applyer list to player list.
        for (var i = 0; i < fromArray.length; i++) {
            // Find the applyer in list.
            if (fromArray[i].id == character.id) {
            	// Remove it from array.
            	fromArray.splice(i, 1);
            	toArray.push(character);
            	i--;
            }
        }
    }

});
angular.module('ShApp')

// inject the Comment service into our controller
.controller('EditCampaignCtrl', function($scope, $location, config, NavigationService, editCampaignData, CampaignFactory, $mdDialog ) {

	$scope.form;
	$scope.headerName = "";

	$scope.setup = function(){
		//console.log(editCampaignData);
		$scope.form = editCampaignData;

		// Set the header name.
		$scope.headerName = editCampaignData.name;

		// Update the navigation.
        NavigationService.set([
        	{"url" : "/#/campaign/"+editCampaignData.id, 'title': editCampaignData.name, 'active' : false},
        	{"url" : "", 'title': "Redigera", 'active' : true}]);
	}

	$scope.editCampaign_save = function() {
        var changedData = $scope.form;

        CampaignFactory.update({id: $scope.form.id}, changedData, function(response){
        	//console.log(response);
        	$location.path("campaign/" + changedData.id);
        }, function(response){
        	$location.path("error/500");
        });
    }

    $scope.editCampaign_cancel = function() {
        $location.path("campaign/" + $scope.form.id);
    }

    $scope.removeCampaign = function() {

        var confirm = $mdDialog.confirm()
          .title('Vill du verkligen ta bort ' + $scope.form.name + "?")
          .textContent('Kampanjen kommer att bli arkiverad.')
          .ariaLabel('Sagohamnen.se')
          .targetEvent(event)
          .ok('Ja')
          .cancel('Nej');
        // Confirm delete.
        $mdDialog.show(confirm).then(function() {
            CampaignFactory.remove({campaign_id : $scope.form.id }, function(success) {
                $location.path("campaign/" + $scope.form.id);
            }, function(error) {
                $location.path("error/500");
            });

        }, function() {
             console.log("Nope");
        });
    }

	$scope.setup();
});
angular.module('ShApp')

// inject the Comment service into our controller
.controller('newCampaignCtrl', function($scope, $location, $window, NavigationService, CampaignFactory ) {

	$scope.setup = function(){
		//$scope.form.max_nr_players = 4;
	}

	$scope.cancel = function(){
		$window.history.back();

	}

	$scope.submit_new_campaign = function(){
		console.log("Spara", $scope.form.name);
		var campaign = new CampaignFactory;
		campaign.name 				=  $scope.form.name;
		campaign.genre 				=  $scope.form.genre;
		campaign.description 		=  $scope.form.description;
		campaign.max_nr_players 	=  $scope.form.max_nr_players;
		campaign.$save();

		$location.path("home");
	}

	$scope.setup();
});
angular.module('ShApp')

// inject the Comment service into our controller
.controller('SingleCampaignCtrl', function($scope, $http, DbService, $routeParams, $sce, $location, $route, $timeout, CampaignFactory, CampaignService, config, NavigationService, campaignData) {

    $scope.showAlternatives = false;

	$scope.setupCampaign = function() {
        //console.log("Innen i single camp ctrl");
        var campaignId = $routeParams.campaignId;
        if( campaignId == null) $location.path("error/404");

        response = campaignData;
        var characters = response.player_characters;
        response.created_at = new Date( response.created_at );
        response.updated_at = new Date( response.updated_at );

        response.archived = response.status == config.campaginArchived;

        // Update the navigation.
        NavigationService.set([{"url" : "/#/campaign/"+campaignData.id, 'title': campaignData.name, 'active' : true}]);

        $scope.form = response;
    }

    $scope.applyToCampaign = function() {
        var userId = $scope.myId;
        var campaignId = $scope.form.id;
        $location.path("campaign_apply/" + campaignId);
    }

    $scope.approveCharacterApply = function(applyer)
    {
        moveApplyerToPlayer(applyer);
    }

    function moveApplyerToPlayer(applyer){
    	// Move it from applyer list to player list.
        for (var i = 0; i < $scope.form.appliers.length; i++) {
            // Find the applyer in list.
            if ($scope.form.appliers[i].id == applyer.id) {
            	// Remove it from array.
            	$scope.form.appliers.splice(i, 1);
            	$scope.form.players.push(applyer);
            	i--;
            }
        }
    }

    $scope.showAlt = function(){
        $scope.showAlternatives = $scope.showAlternatives == true? false : true;
    }

    $scope.edit = function(){
        $location.path('edit_campaign/'+ $scope.form.id );
    }
    $scope.handleApplicants = function(){
        $location.path('campaign_applications/' + $scope.form.id);
    }

    $scope.activateCampaign = function(){
        CampaignFactory.activate({ id : $scope.form.id}, function(success){
            console.log("Ej arkiverad");
            $scope.form.archived = false;
        }, function (error) {

        });
    }
});
angular.module('ShApp')

// inject the Comment service into our controller
.controller('EditCharacterCtrl', function($scope, $location, $routeParams, CharacterFactory, config, $mdDialog) {

	$scope.form = {};
	$scope.portrait = {id : 0, url: ""};

	//var status = { 0=>'Arkiverad', 1=>'Ansöker', 2=>'Spelare', 3=>'SLP'};

	$scope.setup = function () {
		var characterId = $routeParams.characterId;
    	if( characterId == null) $location.path("error/404");

    	var theCharacter = CharacterFactory.get({id: characterId}, function(response) {

    		// If character is archived then user are not allowed to edit it.
    		if (response.can_edit == false){
    			$location.path("error/403");
    		}

    		$scope.campaignId = response.id;
			response.created_at = new Date( response.created_at );
			response.updated_at = new Date( response.updated_at );

			$scope.portrait.id 	= response.portrait.id;
			$scope.portrait.url 	= response.portrait.medium;

			$scope.headline = angular.copy(response.name);
			$scope.form = response;
	      //console.log(response);
	    }, function(response) {
	      if(response.status == 404) $location.path("error/404");
	    } );
	}

	$scope.saveEdit = function(){
		//console.log("Dags att spara");

		var postData = {};
		postData.id 				= $scope.form.id;
		postData.name 				= $scope.form.name;
		postData.description 		= $scope.form.description;
		postData.secret_data 		= $scope.form.secret_data;
		postData.portrait_id 		= $scope.portrait.id;
		postData.excerpt 			= $scope.form.excerpt;
		//postData.campaign_id		= $scope.form.campaign.id;

		CharacterFactory.update({id: $scope.form.id}, postData, function(response) {
			//console.log(response);
			$location.path("character/"+postData.id);
	    }, function(response) {
    		//console.log(response);
	      //if(response.status == 404) $location.path("error/404");
	    } );

	}

	$scope.cancelEdit = function()
	{
		$location.path("character/" + $scope.form.id);
	}

	$scope.remove = function()
	{
		var confirm = $mdDialog.confirm()
          .title('Vill du verkligen ta bort ' + $scope.form.name + "?")
          .textContent('Karaktären kommer att bli arkiverad.')
          .ariaLabel('Sagohamnen.se')
          .targetEvent(event)
          .ok('Ja')
          .cancel('Nej');

        // Confirm delete.
        $mdDialog.show(confirm).then(function() {
        	CharacterFactory.changeStatus({id: $scope.form.id, status: config.charStatusArchived} , function(response) {
        		$location.path("character/"+$scope.form.id);
			}, function(response){
				console.log("failure");
				$location.path("error/500");
			});
        }, function() {
             console.log("Nope");
        });

	}
});
angular.module('ShApp')

// inject the Comment service into our controller
.controller('SingleCharacterCtrl', function($scope, singleCharacter, config, NavigationService, CharacterFactory ) {

	$scope.form = {};
	$scope.showConfirmArchive = false;
	$scope.charAction = {'title' : "", 'status' : 0, 'icon' : ""};
	$scope.relationText = "";
	$scope.archived = false;
	$scope.showAlternatives = false;

	$scope.setup = function() {
		singleCharacter.created_at = new Date( singleCharacter.created_at );
		singleCharacter.updated_at = new Date( singleCharacter.updated_at );
		$scope.form = singleCharacter;

		// Character status as text.
		setStatusText(singleCharacter.status);

		// Update the navigation.
        NavigationService.set([
        	{"url" : "/#/campaign/"+singleCharacter.campaign.id, 'title': singleCharacter.campaign.name, 'active' : false},
        	{"url" : "/#/character/"+singleCharacter.id, 'title': singleCharacter.name, 'active' : true}]);
	}

	function setStatusText(charStatus)
	{
		$scope.archived = false;
		if (charStatus == config.charStatusArchived) {
			$scope.relationText = "Arkiverad";
			$scope.archived = true;
		}
		else if (charStatus == config.charStatusApplying) $scope.relationText = "Ansöker att delta";
		else if (charStatus == config.charStatusPlaying) $scope.relationText = "Spelare";
		else if (charStatus == config.charStatusNpc) $scope.relationText = "Spelledarekaraktär";
	}

	var changeCharStatus = function(newStatus){
		CharacterFactory.changeStatus({id: $scope.form.id, status: newStatus} , function(response) {
			setStatusText(newStatus);
		}, function(response){
			console.log("failure");
		})
	}

	$scope.showAlt = function() {
		$scope.showAlternatives = $scope.showAlternatives == true ? false : true;
	}

	$scope.setApplier = function() {
		changeCharStatus(config.charStatusApplying);
	}

	$scope.setup();
});
angular.module('ShApp')
.controller('SingleRpgCtrl', function($scope, setupData, NavigationService, RpgService ) {

    $scope.chats = [];
    $scope.dices = [];
    $scope.chronicles = [];
    $scope.activeUsers;
    $scope.myCharacters = [];
    $scope.input = {chat:"", chronicle:""};
    $scope.campaginData;

    // I think I need it for the pick character to say.
    $scope.characterItem = {};

	$scope.init = function(){
        var campaign = setupData.campaign;
        $scope.campaginData = campaign;

		// Update the navigation.
        NavigationService.set([{"url" : "/#/campaign/" + campaign.id, 'title': campaign.name, 'active' : false},
        	{"url" : "/#", 'title': 'Rollspel', 'active' : true}]);

        // Iniate the RPG service.
        RpgService.init(setupData);

        // Fetch those characters that are mine.
        $scope.myCharacters = RpgService.myCharacters();

        if ($scope.myCharacters.length > 0)
        {
            $scope.characterItem.selectedItem = $scope.myCharacters[0];
        }


        /*UserService.userLoaded.then(function(res){
            console.log("Nu har userservice hämtat användar id.");

            setTimeout(function(){
                $scope.myCharacters = RpgService.myCharacters();
                if ($scope.myCharacters.length > 0)
                {
                    console.log($scope.myCharacters[0]);
                    console.log($scope.myCharacters[0].portrait.thumbnail );
                    $scope.myCurrentCharacters = $scope.myCharacters[0];
                }
            },1000);
        });*/

	}

    $scope.sendChat = function(){
        //console.log("Skickar " + $scope.input.chat);
        var message = $scope.input.chat;
        var campaignId = $scope.campaginData.id;
        if(message == "")return;

        $scope.input.chat = "";
        RpgService.storeChat(message,campaignId);
    }

    $scope.newChronicleEntry = function()
    {
        var chroEntry = $scope.input.chronicle.text;
        var pickedChar = $scope.characterItem.selectedItem;

        // If no character picked
        if (pickedChar == 0) pickedChar =null;

        console.log("Chro entry", chroEntry);
        console.log("Spara krönikeinlägg", pickedChar.id);

        RpgService.storeChronicle(chroEntry, pickedChar.id);

        // Reset textarea.
        $scope.input.chronicle.text = "";
    }

    $scope.$on('rpgUpdate', function(event, response){
        // If new dices
        if (response.newDices.length > 0) {
            response.newDices.forEach(function(row){
                $scope.dices.push(row);
            });
        }
        // If new chats
        if (response.newChats.length > 0) {
            response.newChats.forEach(function(row){
                $scope.chats.push(row);
            });
        }

        // If new chronicles.
        if (response.newChronicles.length > 0 ) {
            response.newChronicles.forEach(function(row){
                $scope.chronicles.push(row);
            });
        }

        // If online users changed.
        if (response.onlineUsersChanged ){
            //console.log("Ändring i users online");
            $scope.activeUsers = response.activeUsers;
        }

    });

    $scope.$on("$destroy", function(){
        console.log("Lämnar rpg.");
        RpgService.stopPulling();
    });

});


angular.module('ShApp')

// inject the Comment service into our controller
.controller('EditUserCtrl', function($scope, $location, $routeParams, config, NavigationService, setupEditUserData, UserFactory ) {

	$scope.form;
	$scope.title;

	$scope.setup = function() {
		$scope.form = setupEditUserData;
		$scope.title = setupEditUserData.name;
	}

	$scope.editUser_save = function() {
        UserFactory.updateA({id: $scope.form.id}, $scope.form, function(response){
        	$location.path("user/" + $scope.form.id);
        }, function(response) {
        	$location.path("error/401");
        });
	}

	$scope.cancelBt = function(){
		$location.path("user/" + $scope.form.id);
	}

	$scope.setup();

});
angular.module('ShApp')

// inject the Comment service into our controller
.controller('SingleUserCtrl', function($scope, $routeParams, $location, userData, config, NavigationService, UserService ) {

	$scope.player_characters = [];
	$scope.applying_characters = [];
	$scope.showAlternatives = false;

	$scope.setup = function()
	{
		$scope.form = userData;
    	$scope.form.updated_at = new Date( userData.updated_at );

    	// Sort characters
    	sortCharacters(userData.user_characters);

    	// Update navigation
    	NavigationService.set([{"url" : "/#/user/"+userData.id, 'title': userData.name, 'active' : true}]);
	}

	function sortCharacters(characters) {
		$.each( characters, function( index, value ){
            if(value.status == config.charStatusApplying) $scope.applying_characters.push(value);
            if(value.status == config.charStatusPlaying) $scope.player_characters.push(value);
        });
	}

	$scope.showAlt = function() {
		$scope.showAlternatives = $scope.showAlternatives == true ? false : true;
	}

	$scope.logOut = function() {
		UserService.logout();
	}

	$scope.setup();

});
angular.module('ShApp')
// Got from:
// http://stackoverflow.com/questions/15847726/is-there-a-simple-way-to-use-button-to-navigate-page-as-a-link-does-in-angularjs
.directive( 'goClick', function ( $location ) {
  return function ( scope, element, attrs ) {
    var path;

    attrs.$observe( 'goClick', function (val) {
      path = val;
    });

    element.bind( 'click', function () {
      scope.$apply( function () {
        $location.path( path );
      });
    });
  };
});
angular.module('ShApp')

// inject the Comment service into our controller
.controller('headerMenuCtrl', function($scope, $rootScope, UserService, $location) {

	$scope.currentUser = { name: "", id: 0, loggedIn: false };

	$scope.$on('loginChange', function(){
		$scope.currentUser = UserService.currentUser;
	});

	$scope.logout = function() {
		UserService.logout();
	}

});
angular.module('ShApp')

.directive('headerMenu', function() {
    return {
    	restrict: 'E',
    	controller : 'headerMenuCtrl',
	    scope: {},
	    templateUrl: 'views/directives/header_menu.html'
    };
});
angular.module('ShApp')
.controller('PickPortraitCtrl', function($scope, PortraitService,filterFilter ) {

    $scope.list = [];
    $scope.portraits = [];
    $scope.selectedPortrait = {id:0, url:""};

    $scope.currentPage = 1;
    $scope.maxSize = 100;
    $scope.bigCurrentPage = 1;
    $scope.pageSize = 6;

    $scope.init = function () {
        fetchPortraits();
    };

    var fetchPortraits = function(){

        // If no portraits JSON loaded
        if(PortraitService.all_portraits.length == 0){
            console.log("Hämta!");
            // Fetch JSOn from service.
            PortraitService.fetchPortraits().then(function(){
                $scope.portraits = PortraitService.all_portraits;
                PortraitService.setPortraits = $scope.portraits;
                console.log($scope.portraits);
                setDefaultPreview()
            });
        } else {
            console.log("Finns redan!");
            // Add JSON to scope.
            $scope.portraits = PortraitService.all_portraits;
            setDefaultPreview();
        }
    }

    var setDefaultPreview = function(){
        $scope.selectedPortrait.id = $scope.portraits[0].id;
        $scope.selectedPortrait.url = $scope.portraits[0].medium;
    }

    // This comparison function is used to show
    // all portraits, even if search is empty.
    // http://stackoverflow.com/questions/21199759/angularjs-filter-comparator-true-while-displaying-ng-repeat-list-when-input-fiel
    $scope.exceptEmptyComparator = function (actual, expected) {
        if (!expected) {
           return true;
        }
        return angular.equals(expected, actual);
    }

    $scope.selectPortrait = function(portrait)
    {
        // If parent scope have currentPortrait attribute.
        if ( !angular.isUndefined($scope.currentPortrait) ) {
            $scope.currentPortrait.id = portrait.id;
            $scope.currentPortrait.url = portrait.medium;
        }
    }

    $scope.selectImg = function(thePortrait)
    {
        $scope.selectedPortrait.id = thePortrait.id;
        $scope.selectedPortrait.url = thePortrait.medium;
    }

    $scope.pickImg = function()
    {
        $scope.portrait.id  = $scope.selectedPortrait.id;
        $scope.portrait.url = $scope.selectedPortrait.url;
    }


});
angular.module('ShApp')
.directive('pickPortraitDir', function(PortraitService) {
    return {
    	restrict: 'E',
    	scope: {
	      portrait: '=portrait'
	      /* '@' means One Way Binding (Parent changes affect child, child changes does not affect parent)
	        The '=' means Two Ways Binding.*/
	    },
    	templateUrl : "views/media/pick_portrait.html",
        controller: 'PickPortraitCtrl'

    };
});

//# sourceMappingURL=sagohamnen.js.map

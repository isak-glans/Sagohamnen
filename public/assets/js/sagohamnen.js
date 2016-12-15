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
    // View chronicles per page.
    .when("/campaign/:campaignId/chronicle/:pageNr", {
        templateUrl : "views/chronicles/chronicles.html",
        controller  : 'chronicle/ChronicleController',
        resolve : {
            entriesPerPage : function(ChronicleService, $route) {
                return ChronicleService.entriesPerPage({
                    'campaignId'  : $route.current.params.characterId,
                    'chronicleId' : $route.current.params.pageNr });
            }
        }
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
    .when("/edit_character/:id", {
        templateUrl : "views/characters/edit_character.html",
        controller  : 'EditCharacterCtrl',
        resolve : {
            setupData : function(CharacterService, $route ){
                return CharacterService.setupEditCharacter($route.current.params.id).$promise;
            },
            portraitData : function(PortraitService){
                return PortraitService.loadPortraits();
            }
        }
    })
    .when("/rpg/:campaignId", {
        templateUrl : "views/rpg/single_rpg.html",
        controller  : 'SingleRpgCtrl',
        resolve: {
            checkUser: function(UserService){
                UserService.checkIfLoggedIn();
            },
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
                    $location.path('/error/401');
                }
                else if (response.status === 403 ){
                    $location.path('/error/403');
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

    maxChroniclesInRow              :10,

    // How many chats the user can do
    // before he/she is considered spamming.
    chatSpamNr                     :30,
    // The max length of a chat entry.
    chatMaxLength                   :500,

    dicesMaxNr                      :100,
    dicesTypes                      :[4,6,8,10,12,20,100],
    dicesModMax                     :1000,
    dicesModMin                     :-1000,
    dicesDescriptionMaxLength       :250,
});

angular.module('ShApp')

// inject the Comment service into our controller
.controller('MainController', function($scope, UserService, PortraitService, $rootScope, SessionFactory, $location) {

	$scope.$on('$viewContentLoaded', function() {
		// Get current page.
		// Send this to userservice.
		var page = $location.url().substring(1);

    	UserService.checkIfLoggedIn(page);
	});

    function login(){
        UserService.checkIfLoggedIn();
    };

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
        	/*save: { method: 'POST' , isArray: false},*/
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
        	newestChats : { method : "GET", url : "/api/rpg_update/:campaignId/newest/:chatId/:chronicleId" },
        	storeDices : { method: "POST", url : "/api/rpg/role_dice"}
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
// This directive will communicate with the index.php
// and show a loader icon when Angular Route are waiting
// for a resolver to finish. This way the user wont be
// confused if nothing happens while page is loading.

angular.module('ShApp')
.directive('routeLoadingIndicator', function($rootScope, $route, $timeout) {
  return {
    restrict: 'E',
    replace: true,
    template: "<div class='col-lg-12' ng-if='isRouteLoading'><h1>Loading <i class='fa fa-spinner' aria-hidden='true'></i></h1></div>",
    link: function(scope, element) {

      $rootScope.$on('$routeChangeStart', function(event, currentRoute, previousRoute) {
        scope.isRouteLoading = true;
      });

      $rootScope.$on('$routeChangeSuccess', function() {
        scope.isRouteLoading = false;
      });
    }
  };
});


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

.factory('CharacterService', function($resource) {
	var vm = {};

	var Character = $resource('/api/character/:characterId',{},{
		setupEdit : { method : "GET", url : "/api/character/:characterId/edit" },
		changeStatus : {method: "GET", url: "/api/character/:id/status/:status"},
    	update : {method: "PUT", url: "/api/character/:id" }
	});

	vm.getInfo = function(characterId) {

	}

	vm.update = function(id, postData){
		return Character.update({id: id}, postData).$promise;
	}

	vm.changeStatus = function(characterID, newStatus){
		return Character.changeStatus({id: characterID, status: newStatus}).$promise;
	}

	vm.setupEditCharacter = function(id) {
		return Character.setupEdit({'characterId' : id});
	}

	return vm;
});
angular.module('ShApp')

.factory('ChatService', function($resource, config) {

	var vm = {};

	var Chat = $resource('/api/rpg_chat/:campaignId',{},{
		newestChats : { method : "GET", url : "/api/rpg_update/:campaignId/newest/:chatId/:chronicleId" },
    	storeDices : { method: "POST", url : "/api/rpg/role_dice"}
	});

	vm.diceThrowValid = function(nr, type, mod, ob, description){
		if (nr < 1)
			return "Antalet tärningar är för litet.";
		if (nr > config.dices_max_nr)
			return "Antalet tärningar får max vara 100 stycken.";
    	if ( config.dicesTypes.indexOf(type) == -1 )
    		return "Tärningtypen ej tillåten.";
    	if (mod < config.dicesModMin || mod > config.dicesModMax )
    		return "Tärningsmodifikationen är för hög eller låg.";
    	if (ob < 0 || ob > 1 ) // This should be a boolean
    		return "Alternativet OB har fel format.";

    	if (!!description && description.length > config.dicesDescriptionMaxLength)
    		return "Beskrivningen innehåller för många tecken.";

    	return "";
	}

	vm.storeDiceThrow = function(campaignId, nr, type, mod, ob, description){
		var chatDice = {};
		chatDice.campaign_id 	= campaignId;
    	chatDice.dice_nr 		= nr;
    	chatDice.dice_type 		= type;
    	chatDice.dice_ob 		= ob;
    	chatDice.dice_mod 		= mod;
    	chatDice.dice_description = description;

    	return Chat.storeDices({}, chatDice).$promise;
	}

	vm.chatValid = function(message ){
		var error = "";
		if (message.length > config.chatMaxLength) return "Chatinlägget är för långt.";
		if (message.length < 1) return "Inlägget är tomt";
		return error;
	}

	vm.storeChat = function(message, campaignId, userId) {
		var chat = new Chat({id: campaignId });
		chat.user_id		= userId;
		chat.text 			= message;
		chat.campaign_id 	= campaignId;
		chat.type		 	= config.rpgChatStyleMessage;
		return chat.$save();
	}

	return vm;

});
angular.module('ShApp')

.factory('ChronicleService', function($resource, entriesPerPage) {

	var vm = {};

    var Chronicle = $resource('/api/chronicle/:campaignId',{},{
        // campaign/{campaign_id}/page/{page_nr}
        entriesPerPage : { method : "GET", url : "/api/campaign/:campaignId/page/:chronicleId" },
    });

    vm.entriesPerPage = function(campaignID, pageNr){
        Chronicle.entriesPerPage({ 'campaignId' : campaignID, 'chronicleId' : pageNr}).$promise;
    }

    vm.storeEntry = function(campaignId, text, characterId){
        var chronicle = new Chronicle({id: campaignId});
        chronicle.text          = text;
        chronicle.campaign_id   = campaignId;
        chronicle.character_id  = characterId;

        var result = chronicle.$save();
        return result;
    }

	return vm;

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
	var vm = {};
    $rootScope.navigation = [];

    vm.set = function(navArray){
        /*$rootScope.navigation.url = url;
        $rootScope.navigation.title = title;
        $rootScope.navigation.active = active;*/
        //$rootScope.navigation.push({'title' : title, 'active': false, 'url':'#' });
        $rootScope.navigation = navArray;
        //$rootScope.$apply();
    }

    vm.addToMenu = function(theUrl, theTitle, ifActive)
    {
        var menuObj = {
            'url' : theUrl,
            'title' : theTitle,
            'active' : ifActive
        }
        $rootScope.navigation.push(menuObj);
    }


	return vm;

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

.factory('RpgService', function(UserService, config, $rootScope, $resource, PortraitService) {

	var factory = {};

	var RpgChat = $resource('/api/rpg_chat/:campaignId',{},{
		newestChats : { method : "GET", url : "/api/rpg_update/:campaignId/newest/:chatId/:chronicleId"}
	});

	factory.onlineUsersId = [];
	factory.onlineUsers = [];
	factory.users = {
        online : [],
        onlineIDs : [],
        all : [],
    }
	factory.characters = [];
	factory.portraits = [];
	factory.info = {
		readyForLoop	: false,
		updateCounter 	: 0,
		updateDelay		: 3000,
		lastReadChatId	: 0,
		lastReadChronicleId	: 0,
		campaignId 		: 0,
		gmId			: 0,
		chronicleError	: ""
	}
	factory.messages = {
		spamingChronicle  : "Var god och vänta med att skriva inlägg tills dess en annan spelare gjort ett."
	}
	var timerId = 0;

	factory.init = function(setupData){
		// Restart counter when page load.
		factory.info.updateCounter = 0;
		factory.info.updateDelay = 3000;
		factory.info.lastReadChatId = 0;
		factory.info.lastReadChronicleId = 0;

		// Store important info.
		factory.info.campaignId = setupData.campaign.id;
		factory.info.gmId		= setupData.campaign.user_id;
		factory.characters 		= setupData.characters;



		// Save data about all users who play or are GM,
		// and store in the service.
		factory.users.all = setupData.users;

		// Fetch the portraits for characters.
		giveCharactersPortraits(factory.characters);


		// Run the shit!
		chatLoop();

	}

	factory.my_characters = function(){
		var myCharacters = [];

		// If rpg have no characters.
		if (factory.characters.length == 1 ) return myCharacters;

		// If user is gm, add an extra option for "no" character.
		if (meGm() ){
			myCharacters.push( {id:"0", name:"Berättarröst", portrait_id:0});
		}

		// Collect those characters that are the user´s.
		factory.characters.forEach(function(character){
			if (character.id == UserService.currentUser.id) {
				myCharacters.push(character);
			}
		});

		return myCharacters;
	}

	factory.stopPulling = function(){
		clearInterval(timerId);
	}

	factory.interpret_stored_chat_response = function(response) {
		var chatEntry = {};
		if (!!response.id && !!response.text && !!response.created_at && !!response.user_id ) {
            chatEntry.id           = response.id;
            chatEntry.text         = response.text;
            chatEntry.date         = response.created_at;
            chatEntry.user_id      = response.user_id;
            // Format result.
            chatEntry = format_chat_from_db(chatEntry);
            return chatEntry;
        } else return null;
	}

	factory.format_chronicle = function( campaignId, text, characterId, info ){
		var entry = {
            'id' : info.id,
            'text' : text,
            'campaign_id' : campaignId,
            'character_id' : characterId,
            'user_id'       : info.user_id,
        }

        // Add Character info if there is some.
        if (entry.character_id > 0){
        	entry.character =  { status : info.chararacter_status, 'portrait_id' : info.character_portrait_id};
        }

		return format_chronicle_from_db(entry);
	}

	factory.doEntryExist = function(oldEntries, newEntry)
	{
		var exists = false;
		oldEntries.forEach(function(row){
			if (row.id == newEntry.id) {
				exists = true;
				return true;
			}
		});

		return exists;
	}

	// ===================================
	// PRIVATE FUNCTIONS
	// ===================================

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

	        getNewest();

	        // Make this function loop.
	        timerId = setTimeout(updateLoop, factory.info.updateDelay)
	    }
	    updateLoop();
	}

	function getNewest() {
		var lastReadChatId = factory.info.lastReadChatId;
		var lastRecievedChronicleId = factory.info.lastReadChronicleId;
		var campaignId = factory.info.campaignId;

		// Fetch updates.
		RpgChat.newestChats({
			'campaignId'	: campaignId,
			'chatId' 		: lastReadChatId,
			'chronicleId'	: lastRecievedChronicleId }).$promise.then(function(response){
			callback_Updates(response);
		}, function(error) {
			console.log(error);
		});
	}

	var callback_Updates = function(response){
		var newChronicles = [];
		var newChats = [];
		var newDices = [];

		// Last chat and chronicle id:s
		var latestChatId = response.newest_chats.last_chat_id;
		var latestChronicleId = response.newest_chronicles.last_chronicle_id;
		var currentOnlineUsers = [];

		// Active users
		var currentOnlineUsersId = response.active_users;
		// See if new users have come online, or someone left.
		var onlineUsersChanged = simpleArraysEqual(factory.onlineUsersId, currentOnlineUsersId) == true ? false : true;

		// Update online users
		if( onlineUsersChanged ){
			// Iterate and add name and avatar to list.
			currentOnlineUsersId.forEach(function(userId){
				var data = findUser(userId);
				currentOnlineUsers.push({'id' : userId, 'name': data.name, 'avatar' : data.avatar});
			});
		}

		// If new chronicles
		if (latestChronicleId > factory.info.lastReadChronicleId) {
			// Remember if new chronicles arrived.
			factory.info.lastReadChronicleId = latestChronicleId;

			newChronicles = response.newest_chronicles.chronicles;
			newChronicles.forEach(function(row){
				row = format_chronicle_from_db(row);
			});

			newChronicles.reverse();
		}

		// If new chats.
		if (latestChatId > factory.info.lastReadChatId ) {
			factory.info.lastReadChatId = latestChatId;
			factory.info.updateCounter = 0;

			newChats = response.newest_chats.chats;
			newChats.forEach(function(row){
				row = format_chat_from_db(row);
	            // Fetch dices.
	            if (row.type == config.rpgChatStyleDie)
	            	newDices.push(row);
	        });

	        newChats.reverse();
		}

		// Transmit result to the controller.
		$rootScope.$broadcast('rpgUpdate', {
			'newChats'			: newChats,
			'newDices' 			: newDices,
			'newChronicles' 	: newChronicles,
			'activeUsers' 		: currentOnlineUsers,
			'onlineUsersChanged' : onlineUsersChanged });
	}

	function format_chat_from_db(chat){
		chat.date = new Date(chat.date);
        // Add username, wich was fetched with setupData.
        chat.name = findUser(chat.user_id).name;
        return chat;
	}

	function format_chronicle_from_db(chronicle)
	{
		// If GM add style class.
		if (chronicle.user_id == factory.info.gmId)
			chronicle.styleClass = "entry-chronicle-gm";

		// Attach portrait url:s
		if (!!chronicle.character){
			// Add status classes.
			if (chronicle.character.status == config.charStatusPlaying )
				chronicle.styleClass = "entry-chronicle-player";
			else if (chronicle.character.status == config.charStatusNpc )
				chronicle.styleClass = "entry-chronicle-npc";
			else chronicle.styleClass = "";

			chronicle.character.portrait = findPortrait(chronicle.character.portrait_id);
		}

		// Find user
		chronicle.name = findUser(chronicle.user_id).name;

		return chronicle;
	}


	var TrimNrChats = function() {
        var totalNr = factory.chats.length;
        var maxNrChats = 40;
        if ( totalNr > maxNrChats) {
            var nrToRemove = totalNr - maxNrChats;
            factory.chats.splice(0,nrToRemove);
        }
    }

    var findUser = function(userId)
    {
    	var data = {'name' : '', 'avatar' : ''};
    	factory.users.all.forEach(function(user){
    		if (user.id == userId) {
    			data.name = user.name;
    			data.avatar = user.avatar;
    		}
    	});
    	return data;
    }

    // Compare two arrays to see if they
    // have the same content.
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

    var findPortrait = function(portraitID, thumbnail = true)
    {
    	var thePorrait;

    	if (!! PortraitService.all_portraits){
    		PortraitService.all_portraits.forEach(function(portrait){
    		if (portrait.id == portraitID)
	    		thePorrait = portrait;
	    	});
	    	return thumbnail ? thePorrait.thumbnail : thePorrait.medium;
    	} else {
    		console.log("Porträtten kunde inte hittas.");
    		return null;
    	}
    }

    var giveCharactersPortraits = function(characters)
    {
    	characters.forEach(function(character){
			character.portrait = {
				'thumbnail': findPortrait(character.portrait_id),
				'medium' : findPortrait(character.portrait_id, false)};
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

.factory('UserService', function($rootScope, $resource, $location, SessionFactory) {
	console.log("UserService läses in.");
	var vm = {};
	vm.csrf = "";
	vm.currentUser = {name : "", id: 0, loggedIn : false };

	var User = $resource('/api/user/:id',{},{
		setupEditUser : {method: "GET", url: "/api/user/:id/edit"},
    	updateA : {method: "PUT", url: "/api/user/:id"},
    	loadUser : {method : "GET", url: '/api/username_and_id' },
    	logIn : {method : "GET", url: '/api/username_and_id' },
    	logOut : {method : "GET", url: '/logout' }
	});

	vm.checkIfLoggedIn = function(currentPage) {
		console.log("INne i checkIfLoggedIn");
		// User logged in?
		if (! vm.currentUser.loggedIn) {
			console.log("Userserives säger att jag inte är inloggad.");
			// If not check Localstorage.
			if ( !!SessionFactory.getKey('userId') ) {
				console.log("currentUser not logged in but getting from local session.");
				// Here I am using local session, because
				// if user refresh a page, all service data
				// will be lost. But local session will remain
				// until user close tab/browser.
				vm.currentUser.id = SessionFactory.getKey('userId');
				vm.currentUser.name = SessionFactory.getKey('userName');
				vm.currentUser.loggedIn = true;
				console.log(vm.currentUser);
			// If recently logged in the user will
			// be directed to index, which means
			// current page will be empty.
			} else if (currentPage == '') {
				console.log("Now ask server");
				// Only ask the server for authentication
				// when user asks to log in.
				ask_server_if_user_logged_in();
			}
		} else {
			console.log("My id "+ vm.currentUser.id);
		}

		// Always update the user menu for each page load.
		updateUserMenu();
	}

	vm.setUser = function(user){
		vm.currentUser = user;
	}

	vm.logout = function() {
		console.log("Loggar ut");
		User.logOut({}, function(response){
			console.log("User have been logged out on server.");
			vm.setLogout();
			updateUserMenu();
			$location.path("/home");
		});
	};

	// Call this when user get a 403.
	vm.setLogout = function() {
		vm.currentUser.id = 0;
        vm.currentUser.name = "";
        vm.currentUser.loggedIn = false;
		if ( !!SessionFactory.getKey('userId') && !!SessionFactory.getKey('userName')) {
			SessionFactory.deleteKey('userId');
            SessionFactory.deleteKey('userName');
		}
	}

	/* ========================================
			Private methods
	   ======================================= */

	function ask_server_if_user_logged_in(){
		console.log("Asking server.");
		User.loadUser().$promise.then(function(response){
			console.log("Serverser responded", response);
			// Check if missing JSON columns.
			if (!response.hasOwnProperty('name') || !response.hasOwnProperty('id')
				|| !response.hasOwnProperty('signed_in')) {
				$location.path("/500");
			}

            // Signed in?
            if (response.signed_in){
            	console.log("Nu sätts currentUser");
            	// Save user in local session.
            	vm.currentUser.name = response.name;
            	vm.currentUser.id = response.id;
            	vm.currentUser.loggedIn = true;
            	SessionFactory.setKey('userId', response.id);
            	SessionFactory.setKey('userName', response.name);
            } else {
            	// User not logged in.
            	vm.setLogout();
            }
            // Update view
            updateUserMenu();
        }, function(error) {
        	console.log(error);
        });
	}

	function updateUserMenu()
	{
		$rootScope.$broadcast('loginChange', {});
	}

	return vm;

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
.controller('EditCharacterCtrl', function($scope, $location, $routeParams, config, $mdDialog, setupData, CharacterService) {

	$scope.form = {};
	$scope.portrait = {id : 0, url: ""};

	//var status = { 0=>'Arkiverad', 1=>'Ansöker', 2=>'Spelare', 3=>'SLP'};

	$scope.setup = function () {
		$scope.campaignId = setupData.id;
		setupData.created_at = new Date( setupData.created_at );
		setupData.updated_at = new Date( setupData.updated_at );

		$scope.portrait.id 	= setupData.portrait.id;
		$scope.portrait.url 	= setupData.portrait.medium;

		$scope.headline = angular.copy(setupData.name);
		$scope.form = setupData;
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

		var result = CharacterService.update($scope.form.id, postData);
		result.then(function(response){
			$location.path("character/"+postData.id);
		});

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
        	// Ask server to change status.
        	var characterID = $scope.form.id;
        	var newStatus = config.charStatusArchived;

        	CharacterService.changeStatus(characterID, newStatus).then(function(response){
        		$location.path( "character/" + characterID );
        	});
        	/*CharacterFactory.changeStatus({id: $scope.form.id, status: config.charStatusArchived} , function(response) {
        		$location.path("character/"+$scope.form.id);
			});*/
        }, function() {
             console.log("Nope");
        });

	}
});
angular.module('ShApp')

// inject the Comment service into our controller
.controller('SingleCharacterCtrl', function($scope, singleCharacter, config, NavigationService, CharacterService ) {

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

		var characterID = $scope.form.id;

    	CharacterService.changeStatus(characterID, newStatus).then(function(response){
    		setStatusText(newStatus);
    	});
	}

	$scope.showAlt = function() {
		$scope.showAlternatives = $scope.showAlternatives == true ? false : true;
	}

	$scope.setApplier = function() {
		changeCharStatus(config.charStatusApplying);
	}

	$scope.setNpc = function() {
		changeCharStatus(config.charStatusNpc);
	}

	$scope.setup();
});
angular.module('ShApp')

// inject the Comment service into our controller
.controller('ChronicleController', function($scope, $routeParams, $location, ChronicleService, entriesPerPage ) {

	$scope.init = function() {
		$scope.chronicles();
		console.log(entriesPerPage);
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
.controller('SingleRpgCtrl', function($scope, setupData, NavigationService, RpgService, ChatService, ChronicleService ) {

    $scope.chats = [];
    $scope.dices = [];
    $scope.chronicles = [];
    $scope.chronicleError = "";
    $scope.activeUsers;
    $scope.myCharacters = [];
    $scope.input = {chat:"", chronicle:""};
    $scope.campaginData;
    $scope.error = {
        chronicle : "",
        chat : "",
        dice : ""
    }

    // I think I need it for the pick character to say.
    $scope.characterItem = {};
    $scope.diceTypeOptions = [
        {name : '1T4', value : 4},
        {name : '1T6', value : 6},
        {name : '1T8', value : 8},
        {name : '1T10', value : 10},
        {name : '1T12', value : 12},
        {name : '1T20', value : 20},
        {name : '1T100', value : 100} ]

	$scope.init = function(){
        var campaign = setupData.campaign;
        $scope.campaginData = campaign;

		// Update the navigation.
        NavigationService.addToMenu("/#/campaign/" + campaign.id, campaign.name, false);
        NavigationService.addToMenu("/#", 'Rollspel', true);

        // Initiate the RPG service.
        RpgService.init(setupData);

        // Find active users.
        $scope.activUsers = setupData.users;

        // Wait some seconds for userService to find user in server,
        // if user refresh rpg room.
        setTimeout(function(){

        },100);

        // Fetch those characters that are mine.
            $scope.myCharacters = RpgService.my_characters();
            console.log("Mina karaktärer", $scope.myCharacters);

            // Set selected character.
            if ($scope.myCharacters.length > 0)
            {
                $scope.characterItem.selectedItem = $scope.myCharacters[0];
            }

            setSelectedOptions();



	}


    function setSelectedOptions(){
        $scope.input.selectDiceType = {name: "1T6", value: 6 };
    }

    $scope.saveChronicleEntry = function()
    {
        var campaignId      = setupData.campaign.id;
        var text            = $scope.input.chronicle.text;
        var characterId     = $scope.characterItem.selectedItem.id;

        // If no character picked
        if (characterId == 0) characterId = null;

        // Store it in DB.
        var result = ChronicleService.storeEntry(campaignId, text, characterId);
        result.then(function(response){
            // Spamming?
            if (response.spamming){
                $scope.chronicleError = RpgService.messages.spamingChronicle;
                return;
            }
            // If important info returned.
            if (response.info != null ){
                // Add portrait and more..
                var entry = RpgService.format_chronicle(campaignId, text, characterId, response.info);
                if(!!entry){
                    // Display it.
                    $scope.chronicles.push(entry);
                }
            }

            $scope.chronicleError = "";
            $scope.input.chronicle.text = "";

        });
    }

    $scope.storeChat = function(){
        var message     = $scope.input.chat;
        var campaignId  = setupData.campaign.id;

        $scope.error.chat = "";
        $scope.error.chat = ChatService.chatValid(message);
        if($scope.error.chat != "")
            return;

        $result = ChatService.storeChat(message,campaignId);
        $result.then(function(response){
            var chat = RpgService.interpret_stored_chat_response(response);
            if( !!chat ) {
                $scope.chats.push(chat);
                $scope.input.chat = "";
            }
        }, function(error){
            if (error.status == 429){
                $scope.error.chat = "Var god vänta med att skriva ett chatinlägg tills en annan spelare gjort ett.";
            }
        });
    }

    $scope.saveDiceThrow = function(){
        var campaignId = setupData.campaign.id;
        var nrOfDices   = $scope.input.dice.nr;
        var diceType    = $scope.input.selectDiceType.value;
        var diceMod     = $scope.input.dice.mod;
        var diceDescription  = $scope.input.dice.description;
        var ob = $scope.input.dice.ob;

        // Validate dices.
        $scope.error.dice = "";
        $scope.error.dice = ChatService.diceThrowValid(nrOfDices, diceType, diceMod, ob, diceDescription);
        if ($scope.error.dice != ""){
            return;
        }

        // Store it.
        ChatService.storeDiceThrow(campaignId, nrOfDices, diceType, diceMod, ob, diceDescription).then(function(response){
            // Interpret and add username.
            var dice = RpgService.interpret_stored_chat_response(response);
            if( !!dice ) {
                // Add to both chats and dice array.
                $scope.dices.push(dice);
                $scope.chats.push(dice);
                // Reset description input.
                $scope.input.dice.description = "";
            }
        }, function(error){
            console.log("Här blev det ett fel");
            if (error.status == 429){
                $scope.error.dice = "Var god vänta med att slå en tärning tills en annan spelare slagit ett.";
            }
        });
    }

    // Event watcher. Calls when chat should be updated.
    $scope.$on('rpgUpdate', function(event, response){
        // If new dices
        if (response.newDices.length > 0) {
            response.newDices.forEach(function(row){
                if ( ! RpgService.doEntryExist($scope.dices, row) )
                    $scope.dices.push(row);
            });
        }
        // If new chats
        if (response.newChats.length > 0) {
            response.newChats.forEach(function(row){
                // Dont add entry if already displayed.
                if ( ! RpgService.doEntryExist($scope.chats, row) )
                    $scope.chats.push(row);
            });
        }

        // If new chronicles.
        if (response.newChronicles.length > 0 ) {
            response.newChronicles.forEach(function(row){
                if ( ! RpgService.doEntryExist($scope.chronicles, row) ) {
                    $scope.chronicles.push(row);
                }
            });
        }

        // If online users changed.
        if (response.onlineUsersChanged ){
            //console.log("Ändring i users online");
            $scope.activeUsers = response.activeUsers;
        }
    });

    // When user leaves chat.
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
	$scope.menuUser = { name: "", id: 0, loggedIn: false };

	$scope.$on('loginChange', function(event, response){
		// UserService.currentUser.id
		$scope.menuUser.id = UserService.currentUser.id;
		$scope.menuUser.name = UserService.currentUser.name;
		$scope.menuUser.loggedIn = UserService.currentUser.loggedIn;
		//$scope.$digest();
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

angular.module('ShApp')

.directive('rpgInputChatDir', function() {
    var result = {};
    result.restrict =  'E';
    result.templateUrl = "views/directives/rpg_inputs/rpg_input_chat.html";

    return result;
});
angular.module('ShApp')

.directive('rpgInputChronicleDir', function() {
    var result = {};
    result.restrict =  'E';
    result.templateUrl = "views/directives/rpg_inputs/rpg_input_chronicle.html";

    return result;
});
angular.module('ShApp')

.directive('rpgInputDicesDir', function() {
    var result = {};
    result.restrict =  'E';
    result.templateUrl = "views/directives/rpg_inputs/input_dices.html";

    return result;
});
//# sourceMappingURL=sagohamnen.js.map

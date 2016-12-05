angular.module('ShApp')

.factory('RpgService', function(RpgChatFactory, UserService, config, $rootScope, PortraitService, $q, ChronicleFactory) {

	var factory = {};
	//factory.portraits = [];
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

		// Store importent info.
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
		RpgChatFactory.newestChats({
			'campaignId'	: campaignId,
			'chatId' 		: lastReadChatId,
			'chronicleId'	: lastRecievedChronicleId }).$promise.then(function(response){
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
		factory.info.chronicleError = "";

		var chronicle = new ChronicleFactory;
		chronicle.text 			= message;
		chronicle.campaign_id 	= factory.info.campaignId;
		chronicle.character_id 	= characterId;

		return chronicle.$save();
	}

	factory.storeDie = function(message, campaignId, type) {
		//toreRpgChat(message, campaignId, config.rpgChatStyleDie);

		//RpgChatFactory.storeDices(['campaignId' => campaignId]);

	}

	factory.stopPulling = function(){
		clearInterval(timerId);
	}

	factory.roleOrdinaryDices = function(nr, type, modType, mod, description){
		var campaignId = factory.info.campaignId;
    	var chatDices = new RpgChatFactory;
    	chatDices.campaign_id 	= campaignId;
    	chatDices.dice_nr 		= nr;
    	chatDices.dice_type 	= type;
    	chatDices.dice_mod_type = modType;
    	chatDices.dice_mod 		= mod;
    	chatDices.dice_description = description;
    	RpgChatFactory.storeDices({}, chatDices).$promise.then(function(res) {
    		console.log(res);
    	});

    	/*'campaign_id'        => 'required|numeric|min:1',
            'dice_nr'            => 'required|numeric|min:1|max:100',
            'dice_type'          => 'required|numeric|min:4|max:100',
            'dice_mod_type'      => 'required|numeric|min:0|max:1',
            'dice_mod'           => 'required|numeric|min:0|max:1000',
            'dice_description'*/
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

			// The new chronicles.
			newChronicles = response.newest_chronicles.chronicles;
			// Since DB sort by descending order, reverse it
			// so last entry comes at bottom.
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
			'activeUsers' 		: currentOnlineUsers,
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
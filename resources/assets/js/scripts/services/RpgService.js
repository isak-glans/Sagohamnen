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

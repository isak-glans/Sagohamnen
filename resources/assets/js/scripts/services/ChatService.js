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
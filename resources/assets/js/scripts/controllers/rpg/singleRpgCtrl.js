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


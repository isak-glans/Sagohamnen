angular.module('ShApp')
.controller('SingleRpgCtrl', function($scope, setupData, NavigationService, RpgService ) {

    $scope.chats = [];
    $scope.dices = [];
    $scope.chronicles = [];
    $scope.chronicleError = "";
    $scope.activeUsers;
    $scope.myCharacters = [];
    $scope.input = {chat:"", chronicle:""};
    $scope.campaginData;

    // I think I need it for the pick character to say.
    $scope.characterItem = {};

	$scope.init = function(){
        console.log("Nu körs init.");
        var campaign = setupData.campaign;
        $scope.campaginData = campaign;

		// Update the navigation.
        NavigationService.set([{"url" : "/#/campaign/" + campaign.id, 'title': campaign.name, 'active' : false},
        	{"url" : "/#", 'title': 'Rollspel', 'active' : true}]);

        // Iniate the RPG service.
        RpgService.init(setupData);

        $scope.activUsers = setupData.users;

        // Fetch those characters that are mine.
        $scope.myCharacters = RpgService.myCharacters();

        // Set selected character.
        if ($scope.myCharacters.length > 0)
        {
            $scope.characterItem.selectedItem = $scope.myCharacters[0];
        }

	}

    $scope.sendChat = function(){
        //console.log("Skickar " + $scope.input.chat);
        var message = $scope.input.chat;
        var campaignId = $scope.campaginData.id;
        if(message == "")return;

        $scope.input.chat = "";
        RpgService.storeChat(message,campaignId);
    }

    $scope.saveChronicleEntry = function()
    {
        var chroEntry = $scope.input.chronicle.text;
        var pickedChar = $scope.characterItem.selectedItem;

        // If no character picked
        if (pickedChar == 0) pickedChar = null;

        RpgService.storeChronicle(chroEntry, pickedChar.id).then(function(response){

            // Check if user is spamming.
            if (response.stored_id == null){
                // User is spamming.
                $scope.chronicleError = RpgService.messages.spamingChronicle;
            } else {
                // Not spamming.
                $scope.chronicleError = "";
                $scope.input.chronicle.text = "";
                RpgService.getNewest();
            }

        }).catch( function(error){
            console.log(error);
        });
    }

    // Event watcher. Calls when chat should be updated.
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

    $scope.$on('newChronicle', function(event,response){
        // If new chronicles.
        if (!! response.newChronicle) {
            $scope.chronicles.push(response.newChronicle);

        }
    });

    // When user leaves chat.
    $scope.$on("$destroy", function(){
        console.log("Lämnar rpg.");
        RpgService.stopPulling();
    });

    $scope.roleDices = function(){
        console.log("Nu ska det slåss tärningar!");

        var nrOfDices   = $scope.input.dice.nr;
        var diceType    = $scope.input.dice.type;
        var diceModType = $scope.input.dice.modtype;
        var diceMod     = $scope.input.dice.mod;
        var diceMotivation  = $scope.input.dice.description;

        console.log("Nr " +nrOfDices+ " Type:" + diceType+ " Mod type: " +diceModType+ " Mod: " +diceMod + ", motivering: "+diceMotivation);

        RpgService.roleOrdinaryDices(nrOfDices,diceType,diceModType,diceMod,diceMotivation);

    }

});


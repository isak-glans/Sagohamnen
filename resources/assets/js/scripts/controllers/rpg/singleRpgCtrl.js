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


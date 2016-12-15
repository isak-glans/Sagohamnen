angular.module('ShApp')

.directive('rpgInputChatDir', function() {
    var result = {};
    result.restrict =  'E';
    result.templateUrl = "views/directives/rpg_inputs/rpg_input_chat.html";

    return result;
});
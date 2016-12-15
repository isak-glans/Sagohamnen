angular.module('ShApp')

.directive('rpgInputDicesDir', function() {
    var result = {};
    result.restrict =  'E';
    result.templateUrl = "views/directives/rpg_inputs/input_dices.html";

    return result;
});
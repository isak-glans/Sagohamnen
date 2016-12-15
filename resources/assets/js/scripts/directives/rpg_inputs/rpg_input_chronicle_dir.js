angular.module('ShApp')

.directive('rpgInputChronicleDir', function() {
    var result = {};
    result.restrict =  'E';
    result.templateUrl = "views/directives/rpg_inputs/rpg_input_chronicle.html";

    return result;
});
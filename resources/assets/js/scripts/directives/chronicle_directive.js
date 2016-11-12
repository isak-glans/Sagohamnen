angular.module('ShApp')

.directive('chronicleEntry', function() {
    var result = {};
    result.restrict =  'E';
    result.templateUrl = "views/chronicles/chronicle_directive.html";

    return result;
});
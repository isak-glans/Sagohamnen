angular.module('ShApp')

.directive('chronicleEntry', function() {
    var result = {};
    result.templateUrl = "views/chronicles/chronicle_directive.html";

    return result;
});
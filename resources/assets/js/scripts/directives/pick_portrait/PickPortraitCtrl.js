angular.module('ShApp')
.controller('PickPortraitCtrl', function($scope, PortraitService,filterFilter ) {

    $scope.list = [];
    $scope.portraits = [];
    $scope.selectedPortrait = {id:0, url:""};

    $scope.currentPage = 1;
    $scope.maxSize = 100;
    $scope.bigCurrentPage = 1;
    $scope.pageSize = 6;

    $scope.init = function () {
        fetchPortraits();
    };

    var fetchPortraits = function(){

        // If no portraits JSON loaded
        if(PortraitService.all_portraits.length == 0){
            console.log("Hämta!");
            // Fetch JSOn from service.
            PortraitService.fetchPortraits().then(function(){
                $scope.portraits = PortraitService.all_portraits;
                PortraitService.setPortraits = $scope.portraits;
                console.log($scope.portraits);
                setDefaultPreview()
            });
        } else {
            console.log("Finns redan!");
            // Add JSON to scope.
            $scope.portraits = PortraitService.all_portraits;
            setDefaultPreview();
        }
    }

    var setDefaultPreview = function(){
        $scope.selectedPortrait.id = $scope.portraits[0].id;
        $scope.selectedPortrait.url = $scope.portraits[0].medium;
    }

    // This comparison function is used to show
    // all portraits, even if search is empty.
    // http://stackoverflow.com/questions/21199759/angularjs-filter-comparator-true-while-displaying-ng-repeat-list-when-input-fiel
    $scope.exceptEmptyComparator = function (actual, expected) {
        if (!expected) {
           return true;
        }
        return angular.equals(expected, actual);
    }

    $scope.selectPortrait = function(portrait)
    {
        // If parent scope have currentPortrait attribute.
        if ( !angular.isUndefined($scope.currentPortrait) ) {
            $scope.currentPortrait.id = portrait.id;
            $scope.currentPortrait.url = portrait.medium;
        }
    }

    $scope.selectImg = function(thePortrait)
    {
        $scope.selectedPortrait.id = thePortrait.id;
        $scope.selectedPortrait.url = thePortrait.medium;
    }

    $scope.pickImg = function()
    {
        $scope.portrait.id  = $scope.selectedPortrait.id;
        $scope.portrait.url = $scope.selectedPortrait.url;
    }


});
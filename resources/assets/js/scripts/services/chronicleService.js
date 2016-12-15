angular.module('ShApp')

.factory('ChronicleService', function($resource, entriesPerPage) {

	var vm = {};

    var Chronicle = $resource('/api/chronicle/:campaignId',{},{
        // campaign/{campaign_id}/page/{page_nr}
        entriesPerPage : { method : "GET", url : "/api/campaign/:campaignId/page/:chronicleId" },
    });

    vm.entriesPerPage = function(campaignID, pageNr){
        Chronicle.entriesPerPage({ 'campaignId' : campaignID, 'chronicleId' : pageNr}).$promise;
    }

    vm.storeEntry = function(campaignId, text, characterId){
        var chronicle = new Chronicle({id: campaignId});
        chronicle.text          = text;
        chronicle.campaign_id   = campaignId;
        chronicle.character_id  = characterId;

        var result = chronicle.$save();
        return result;
    }

	return vm;

});